import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './entities/part.entity';
import { CreatePartDto, UpdatePartDto } from './dto';
import { RepairsService } from '../repairs/repairs.service';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private readonly partsRepository: Repository<Part>,
    private readonly repairsService: RepairsService,
  ) {}

  async create(createPartDto: CreatePartDto): Promise<Part> {
    // Проверяем существование ремонта
    await this.repairsService.findOne(createPartDto.repairId);

    const part = this.partsRepository.create({
      ...createPartDto,
      purchasePrice: createPartDto.purchasePrice || 0,
      salePrice: createPartDto.salePrice || 0,
      quantity: createPartDto.quantity || 1,
    });

    const savedPart = await this.partsRepository.save(part);

    // Пересчитываем partsTotal для ремонта
    await this.recalculateRepairPartsTotal(createPartDto.repairId);

    return savedPart;
  }

  async findAll(repairId?: string): Promise<Part[]> {
    const queryBuilder = this.partsRepository.createQueryBuilder('part');

    if (repairId) {
      queryBuilder.where('part.repairId = :repairId', { repairId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.partsRepository.findOne({
      where: { id },
    });

    if (!part) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }

    return part;
  }

  async update(id: string, updatePartDto: UpdatePartDto): Promise<Part> {
    const part = await this.findOne(id);

    Object.assign(part, updatePartDto);
    const savedPart = await this.partsRepository.save(part);

    // Пересчитываем partsTotal для ремонта
    await this.recalculateRepairPartsTotal(part.repairId);

    return savedPart;
  }

  async remove(id: string): Promise<void> {
    const part = await this.findOne(id);
    const repairId = part.repairId;

    await this.partsRepository.remove(part);

    // Пересчитываем partsTotal для ремонта
    await this.recalculateRepairPartsTotal(repairId);
  }

  /**
   * Пересчитывает partsTotal для ремонта на основе всех его запчастей
   */
  private async recalculateRepairPartsTotal(repairId: string): Promise<void> {
    const parts = await this.findAll(repairId);
    // Преобразуем salePrice и quantity в числа (PostgreSQL numeric возвращает строку)
    const partsTotalNum = parts.reduce((sum, part) => {
      const salePrice = typeof part.salePrice === 'string' ? parseFloat(part.salePrice) : (part.salePrice || 0);
      const quantity = typeof part.quantity === 'string' ? parseFloat(part.quantity) : (part.quantity || 1);
      return sum + salePrice * quantity;
    }, 0);

    const repair = await this.repairsService.findOne(repairId);
    // Преобразуем laborTotal в число
    const laborTotalNum = typeof repair.laborTotal === 'string' ? parseFloat(repair.laborTotal) : (repair.laborTotal || 0);
    const grandTotalNum = laborTotalNum + partsTotalNum;
    
    await this.repairsService.update(repairId, { 
      partsTotal: partsTotalNum, 
      grandTotal: grandTotalNum 
    });
  }
}

