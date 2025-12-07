import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairTask } from './entities/repair-task.entity';
import { CreateRepairTaskDto, UpdateRepairTaskDto } from './dto';
import { RepairsService } from '../repairs/repairs.service';

@Injectable()
export class RepairTasksService {
  constructor(
    @InjectRepository(RepairTask)
    private readonly repairTasksRepository: Repository<RepairTask>,
    private readonly repairsService: RepairsService,
  ) {}

  async create(createRepairTaskDto: CreateRepairTaskDto): Promise<RepairTask> {
    // Проверяем существование ремонта
    await this.repairsService.findOne(createRepairTaskDto.repairId);

    const task = this.repairTasksRepository.create({
      ...createRepairTaskDto,
      price: createRepairTaskDto.price || 0,
    });

    const savedTask = await this.repairTasksRepository.save(task);

    // Пересчитываем laborTotal для ремонта
    await this.recalculateRepairLaborTotal(createRepairTaskDto.repairId);

    return savedTask;
  }

  async findAll(repairId?: string): Promise<RepairTask[]> {
    const queryBuilder = this.repairTasksRepository.createQueryBuilder('task');

    if (repairId) {
      queryBuilder.where('task.repairId = :repairId', { repairId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<RepairTask> {
    const task = await this.repairTasksRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Работа с ID ${id} не найдена`);
    }

    return task;
  }

  async update(id: string, updateRepairTaskDto: UpdateRepairTaskDto): Promise<RepairTask> {
    const task = await this.findOne(id);

    Object.assign(task, updateRepairTaskDto);
    const savedTask = await this.repairTasksRepository.save(task);

    // Пересчитываем laborTotal для ремонта
    await this.recalculateRepairLaborTotal(task.repairId);

    return savedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    const repairId = task.repairId;

    await this.repairTasksRepository.remove(task);

    // Пересчитываем laborTotal для ремонта
    await this.recalculateRepairLaborTotal(repairId);
  }

  /**
   * Пересчитывает laborTotal для ремонта на основе всех его работ
   */
  private async recalculateRepairLaborTotal(repairId: string): Promise<void> {
    const tasks = await this.findAll(repairId);
    // Преобразуем price в число (PostgreSQL numeric возвращает строку)
    const laborTotalNum = tasks.reduce((sum, task) => {
      const price = typeof task.price === 'string' ? parseFloat(task.price) : (task.price || 0);
      return sum + price;
    }, 0);

    const repair = await this.repairsService.findOne(repairId);
    // Преобразуем partsTotal в число
    const partsTotalNum = typeof repair.partsTotal === 'string' ? parseFloat(repair.partsTotal) : (repair.partsTotal || 0);
    const grandTotalNum = laborTotalNum + partsTotalNum;
    
    await this.repairsService.update(repairId, { 
      laborTotal: laborTotalNum, 
      grandTotal: grandTotalNum 
    });
  }
}

