import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Repair } from './entities/repair.entity';
import { CreateRepairDto, UpdateRepairDto } from './dto';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(Repair)
    private readonly repairsRepository: Repository<Repair>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(createRepairDto: CreateRepairDto): Promise<Repair> {
    // Проверяем существование автомобиля
    await this.vehiclesService.findOne(createRepairDto.vehicleId);

    const repair = this.repairsRepository.create({
      ...createRepairDto,
      reportedAt: new Date(createRepairDto.reportedAt),
      laborTotal: 0,
      partsTotal: 0,
      grandTotal: 0,
    });

    return await this.repairsRepository.save(repair);
  }

  async findAll(
    vehicleId?: string,
    dateFrom?: Date,
    dateTo?: Date,
    updatedSince?: Date,
  ): Promise<Repair[]> {
    const queryBuilder = this.repairsRepository
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.client', 'client')
      .where('repair.deletedAt IS NULL');

    if (vehicleId) {
      queryBuilder.andWhere('repair.vehicleId = :vehicleId', { vehicleId });
    }

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('repair.reportedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    } else if (dateFrom) {
      queryBuilder.andWhere('repair.reportedAt >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.andWhere('repair.reportedAt <= :dateTo', { dateTo });
    }

    if (updatedSince) {
      queryBuilder.andWhere('repair.updatedAt >= :updatedSince', {
        updatedSince,
      });
    }

    queryBuilder.orderBy('repair.reportedAt', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Repair> {
    const repair = await this.repairsRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['vehicle', 'vehicle.client', 'parts', 'tasks'],
    });

    if (!repair) {
      throw new NotFoundException(`Ремонт с ID ${id} не найден`);
    }

    return repair;
  }

  async update(id: string, updateRepairDto: UpdateRepairDto): Promise<Repair> {
    const repair = await this.findOne(id);

    // Если изменяется vehicleId, проверяем существование нового автомобиля
    if (updateRepairDto.vehicleId && updateRepairDto.vehicleId !== repair.vehicleId) {
      await this.vehiclesService.findOne(updateRepairDto.vehicleId);
    }

    // Обновляем поля
    if (updateRepairDto.reportedAt) {
      repair.reportedAt = new Date(updateRepairDto.reportedAt);
    }

    if (updateRepairDto.name !== undefined) {
      repair.name = updateRepairDto.name;
    }

    if (updateRepairDto.mileage !== undefined) {
      repair.mileage = updateRepairDto.mileage;
    }

    if (updateRepairDto.laborTotal !== undefined) {
      repair.laborTotal = updateRepairDto.laborTotal;
    }

    if (updateRepairDto.partsTotal !== undefined) {
      repair.partsTotal = updateRepairDto.partsTotal;
    }

    // Всегда пересчитываем grandTotal на основе актуальных значений laborTotal и partsTotal
    // Используем обновленные значения из DTO, если они есть, иначе текущие значения из repair
    const laborTotal = updateRepairDto.laborTotal !== undefined 
      ? updateRepairDto.laborTotal 
      : (typeof repair.laborTotal === 'string' ? parseFloat(repair.laborTotal) : (repair.laborTotal || 0));
    const partsTotal = updateRepairDto.partsTotal !== undefined 
      ? updateRepairDto.partsTotal 
      : (typeof repair.partsTotal === 'string' ? parseFloat(repair.partsTotal) : (repair.partsTotal || 0));
    
    repair.grandTotal = laborTotal + partsTotal;

    if (updateRepairDto.comments !== undefined) {
      repair.comments = updateRepairDto.comments;
    }

    if (updateRepairDto.vehicleId) {
      repair.vehicleId = updateRepairDto.vehicleId;
    }

    return await this.repairsRepository.save(repair);
  }

  async remove(id: string): Promise<void> {
    const repair = await this.findOne(id);
    await this.repairsRepository.softRemove(repair);
  }

  async recalculateTotals(id: string): Promise<Repair> {
    const repair = await this.findOne(id);
    
    // Пересчет уже выполняется в RepairTasksService и PartsService
    // Этот метод оставлен для обратной совместимости
    
    return repair;
  }
}

