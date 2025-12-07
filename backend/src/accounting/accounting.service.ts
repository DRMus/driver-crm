import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Repair } from '../repairs/entities/repair.entity';
import { Part } from '../parts/entities/part.entity';
import { ReportQueryDto, ReportGroupBy } from './dto';

export interface ReportSummaryItem {
  period: string;
  revenue: number; // Выручка (grandTotal)
  cost: number; // Себестоимость (сумма purchasePrice * quantity)
  margin: number; // Маржа (revenue - cost)
  repairsCount: number; // Количество ремонтов
}

export interface DailyReport {
  date: string;
  revenue: number;
  cost: number;
  margin: number;
  repairsCount: number;
  repairs: Array<{
    id: string;
    name?: string;
    vehicle: string;
    revenue: number;
    cost: number;
    margin: number;
  }>;
}

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(Repair)
    private readonly repairsRepository: Repository<Repair>,
    @InjectRepository(Part)
    private readonly partsRepository: Repository<Part>,
  ) {}

  /**
   * Получить сводный отчет с группировкой
   */
  async getSummary(query: ReportQueryDto): Promise<ReportSummaryItem[]> {
    const { from, to, groupBy = ReportGroupBy.DAY } = query;
    
    // Строим запрос для ремонтов
    const queryBuilder = this.repairsRepository
      .createQueryBuilder('repair')
      .where('repair.deletedAt IS NULL');

    // Фильтр по датам
    if (from && to) {
      queryBuilder.andWhere('repair.reportedAt BETWEEN :from AND :to', {
        from,
        to,
      });
    } else if (from) {
      queryBuilder.andWhere('repair.reportedAt >= :from', { from });
    } else if (to) {
      queryBuilder.andWhere('repair.reportedAt <= :to', { to });
    }

    const repairs = await queryBuilder.getMany();

    // Получаем все запчасти для этих ремонтов
    const repairIds = repairs.map(r => r.id);
    let parts: Part[] = [];
    if (repairIds.length > 0) {
      parts = await this.partsRepository.find({
        where: repairIds.map(id => ({ repairId: id })),
      });
    }

    // Группируем по периодам
    const grouped = new Map<string, {
      revenue: number;
      cost: number;
      repairsCount: number;
      repairIds: Set<string>;
    }>();

    repairs.forEach(repair => {
      const period = this.getPeriodKey(repair.reportedAt, groupBy);
      
      if (!grouped.has(period)) {
        grouped.set(period, {
          revenue: 0,
          cost: 0,
          repairsCount: 0,
          repairIds: new Set(),
        });
      }

      const group = grouped.get(period)!;
      group.revenue += Number(repair.grandTotal) || 0;
      group.repairsCount += 1;
      group.repairIds.add(repair.id);
    });

    // Рассчитываем себестоимость для каждого периода
    parts.forEach(part => {
      const repair = repairs.find(r => r.id === part.repairId);
      if (!repair) return;

      const period = this.getPeriodKey(repair.reportedAt, groupBy);
      const group = grouped.get(period);
      if (group) {
        group.cost += Number(part.purchasePrice || 0) * Number(part.quantity || 1);
      }
    });

    // Преобразуем в массив и сортируем
    const result: ReportSummaryItem[] = Array.from(grouped.entries())
      .map(([period, data]) => ({
        period,
        revenue: Number(data.revenue.toFixed(2)),
        cost: Number(data.cost.toFixed(2)),
        margin: Number((data.revenue - data.cost).toFixed(2)),
        repairsCount: data.repairsCount,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    return result;
  }

  /**
   * Получить дневной отчет с детализацией по ремонтам
   */
  async getDailyReport(query: ReportQueryDto): Promise<DailyReport[]> {
    const { from, to } = query;
    
    const queryBuilder = this.repairsRepository
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.vehicle', 'vehicle')
      .where('repair.deletedAt IS NULL');

    if (from && to) {
      queryBuilder.andWhere('repair.reportedAt BETWEEN :from AND :to', {
        from,
        to,
      });
    } else if (from) {
      queryBuilder.andWhere('repair.reportedAt >= :from', { from });
    } else if (to) {
      queryBuilder.andWhere('repair.reportedAt <= :to', { to });
    }

    queryBuilder.orderBy('repair.reportedAt', 'ASC');

    const repairs = await queryBuilder.getMany();

    // Получаем все запчасти
    const repairIds = repairs.map(r => r.id);
    let parts: Part[] = [];
    if (repairIds.length > 0) {
      parts = await this.partsRepository.find({
        where: repairIds.map(id => ({ repairId: id })),
      });
    }

    // Группируем по дням
    const grouped = new Map<string, {
      repairs: Repair[];
      parts: Map<string, Part[]>;
    }>();

    repairs.forEach(repair => {
      const dateKey = repair.reportedAt.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          repairs: [],
          parts: new Map(),
        });
      }
      grouped.get(dateKey)!.repairs.push(repair);
    });

    parts.forEach(part => {
      const repair = repairs.find(r => r.id === part.repairId);
      if (!repair) return;

      const dateKey = repair.reportedAt.toISOString().split('T')[0];
      const group = grouped.get(dateKey);
      if (group) {
        if (!group.parts.has(part.repairId)) {
          group.parts.set(part.repairId, []);
        }
        group.parts.get(part.repairId)!.push(part);
      }
    });

    // Формируем результат
    const result: DailyReport[] = Array.from(grouped.entries())
      .map(([date, data]) => {
        let totalRevenue = 0;
        let totalCost = 0;

        const repairsDetail = data.repairs.map(repair => {
          const repairParts = data.parts.get(repair.id) || [];
          const repairCost = repairParts.reduce(
            (sum, part) => sum + Number(part.purchasePrice || 0) * Number(part.quantity || 1),
            0,
          );
          const repairRevenue = Number(repair.grandTotal) || 0;
          const repairMargin = repairRevenue - repairCost;

          totalRevenue += repairRevenue;
          totalCost += repairCost;

          return {
            id: repair.id,
            name: repair.name || undefined,
            vehicle: repair.vehicle 
              ? `${repair.vehicle.color ? `${repair.vehicle.color} ` : ''}${repair.vehicle.make} ${repair.vehicle.model}`
              : 'Неизвестно',
            revenue: Number(repairRevenue.toFixed(2)),
            cost: Number(repairCost.toFixed(2)),
            margin: Number(repairMargin.toFixed(2)),
          };
        });

        return {
          date,
          revenue: Number(totalRevenue.toFixed(2)),
          cost: Number(totalCost.toFixed(2)),
          margin: Number((totalRevenue - totalCost).toFixed(2)),
          repairsCount: data.repairs.length,
          repairs: repairsDetail,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  /**
   * Экспорт отчета в CSV
   */
  async exportToCSV(query: ReportQueryDto): Promise<string> {
    const summary = await this.getSummary(query);
    
    const headers = ['Период', 'Выручка (руб.)', 'Себестоимость (руб.)', 'Маржа (руб.)', 'Количество ремонтов'];
    const rows = summary.map(item => [
      item.period,
      item.revenue.toString(),
      item.cost.toString(),
      item.margin.toString(),
      item.repairsCount.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Получить ключ периода для группировки
   */
  private getPeriodKey(date: Date, groupBy: ReportGroupBy): string {
    const d = new Date(date);
    
    switch (groupBy) {
      case ReportGroupBy.DAY:
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
      
      case ReportGroupBy.WEEK:
        // Находим начало недели (понедельник)
        const weekStart = new Date(d);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Понедельник
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        // Формат: YYYY-WW (год и номер недели)
        const weekNumber = this.getWeekNumber(weekStart);
        return `${weekStart.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
      
      case ReportGroupBy.MONTH:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      
      default:
        return d.toISOString().split('T')[0];
    }
  }

  /**
   * Получить номер недели в году
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}

