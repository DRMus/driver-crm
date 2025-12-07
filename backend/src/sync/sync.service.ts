import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Repair } from '../repairs/entities/repair.entity';
import { RepairTask } from '../repair-tasks/entities/repair-task.entity';
import { Part } from '../parts/entities/part.entity';
import { SyncBatchDto, SyncItemDto, SyncOperation } from './dto';

export interface SyncResult {
  id: string;
  tempId?: string;
  success: boolean;
  conflict?: boolean;
  serverVersion?: string;
  error?: string;
}

@Injectable()
export class SyncService {
  private readonly entityRepositories: Map<string, Repository<unknown>>;

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Repair)
    private readonly repairsRepository: Repository<Repair>,
    @InjectRepository(RepairTask)
    private readonly repairTasksRepository: Repository<RepairTask>,
    @InjectRepository(Part)
    private readonly partsRepository: Repository<Part>,
  ) {
    this.entityRepositories = new Map<string, Repository<unknown>>([
      ['client', this.clientsRepository],
      ['vehicle', this.vehiclesRepository],
      ['repair', this.repairsRepository],
      ['repair-task', this.repairTasksRepository],
      ['part', this.partsRepository],
    ]);
  }

  /**
   * Получить изменения с сервера с момента последней синхронизации
   */
  async getChanges(updatedSince?: Date, entities?: string[]): Promise<Record<string, unknown[]>> {
    const result: Record<string, unknown[]> = {};

    const targetEntities = entities || ['client', 'vehicle', 'repair', 'repair-task', 'part'];

    for (const entityType of targetEntities) {
      const repository = this.entityRepositories.get(entityType);
      if (!repository) continue;

      const queryBuilder = repository.createQueryBuilder('entity');

      if (updatedSince) {
        queryBuilder.where('entity.updatedAt >= :updatedSince', { updatedSince });
      } else {
        // Если не указана дата, возвращаем все не удаленные записи
        queryBuilder.where('entity.deletedAt IS NULL');
      }

      // Исключаем удаленные записи
      if (repository.metadata.hasColumnWithPropertyPath('deletedAt')) {
        queryBuilder.andWhere('entity.deletedAt IS NULL');
      }

      queryBuilder.orderBy('entity.updatedAt', 'ASC');

      const items = await queryBuilder.getMany();
      result[entityType] = items;
    }

    return result;
  }

  /**
   * Обработать батч изменений от клиента
   */
  async processBatch(batch: SyncBatchDto): Promise<{
    results: SyncResult[];
    conflicts: SyncItemDto[];
  }> {
    const results: SyncResult[] = [];
    const conflicts: SyncItemDto[] = [];

    for (const item of batch.changes) {
      try {
        const result = await this.processItem(item);
        results.push(result);

        if (result.conflict) {
          conflicts.push(item);
        }
      } catch (error) {
        results.push({
          id: item.id || item.tempId || '',
          tempId: item.tempId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { results, conflicts };
  }

  /**
   * Обработать одно изменение
   */
  private async processItem(item: SyncItemDto): Promise<SyncResult> {
    const repository = this.entityRepositories.get(item.entity);
    if (!repository) {
      throw new BadRequestException(`Unknown entity type: ${item.entity}`);
    }

    switch (item.operation) {
      case SyncOperation.CREATE:
        return await this.handleCreate(item, repository);
      case SyncOperation.UPDATE:
        return await this.handleUpdate(item, repository);
      case SyncOperation.DELETE:
        return await this.handleDelete(item, repository);
      default:
        throw new BadRequestException(`Unknown operation: ${item.operation}`);
    }
  }

  /**
   * Обработать создание записи
   */
  private async handleCreate(
    item: SyncItemDto,
    repository: Repository<unknown>,
  ): Promise<SyncResult> {
    // Удаляем временный ID из данных
    const { tempId, ...dataWithoutTempId } = item.data as { tempId?: string };

    const entity = repository.create(dataWithoutTempId);
    const saved = await repository.save(entity);

    return {
      id: (saved as { id: string }).id,
      tempId: item.tempId,
      success: true,
      serverVersion: (saved as { updatedAt: Date }).updatedAt?.toISOString(),
    };
  }

  /**
   * Обработать обновление записи
   */
  private async handleUpdate(
    item: SyncItemDto,
    repository: Repository<unknown>,
  ): Promise<SyncResult> {
    if (!item.id) {
      throw new BadRequestException('ID is required for update operation');
    }

    const existing = await repository.findOne({
      where: { id: item.id } as unknown,
    });

    if (!existing) {
      throw new BadRequestException(`Entity with ID ${item.id} not found`);
    }

    // Проверка конфликта (last-write-wins)
    const existingVersion = (existing as { updatedAt: Date }).updatedAt;
    if (item.version && existingVersion) {
      const clientVersion = new Date(item.version);
      const serverVersion = new Date(existingVersion);

      if (clientVersion < serverVersion) {
        // Конфликт: серверная версия новее
        return {
          id: item.id,
          success: false,
          conflict: true,
          serverVersion: existingVersion.toISOString(),
        };
      }
    }

    // Обновляем запись
    Object.assign(existing, item.data);
    const saved = await repository.save(existing);

    return {
      id: item.id,
      success: true,
      serverVersion: (saved as { updatedAt: Date }).updatedAt?.toISOString(),
    };
  }

  /**
   * Обработать удаление записи
   */
  private async handleDelete(
    item: SyncItemDto,
    repository: Repository<unknown>,
  ): Promise<SyncResult> {
    if (!item.id) {
      throw new BadRequestException('ID is required for delete operation');
    }

    const existing = await repository.findOne({
      where: { id: item.id } as unknown,
    });

    if (!existing) {
      // Запись уже удалена - считаем успешным
      return {
        id: item.id,
        success: true,
      };
    }

    // Проверка конфликта
    const existingVersion = (existing as { updatedAt: Date }).updatedAt;
    if (item.version && existingVersion) {
      const clientVersion = new Date(item.version);
      const serverVersion = new Date(existingVersion);

      if (clientVersion < serverVersion) {
        // Конфликт: запись была изменена после удаления на клиенте
        return {
          id: item.id,
          success: false,
          conflict: true,
          serverVersion: existingVersion.toISOString(),
        };
      }
    }

    // Мягкое удаление (если поддерживается)
    const hasDeletedAt = repository.metadata.columns.some(
      (col) => col.propertyName === 'deletedAt',
    );
    if (hasDeletedAt) {
      await repository.softRemove(existing);
    } else {
      await repository.remove(existing);
    }

    return {
      id: item.id,
      success: true,
    };
  }
}

