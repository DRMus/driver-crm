import { db, PendingMutation } from '../indexeddb';
import { apiClient } from '@/shared/api/axios';
import { queryClient } from '../react-query/queryClient';
import { queryKeys } from '../react-query/queryKeys';

export interface SyncResult {
  id: string;
  tempId?: string;
  success: boolean;
  conflict?: boolean;
  serverVersion?: string;
  error?: string;
}

export interface SyncResponse {
  results: SyncResult[];
  conflicts: unknown[];
  timestamp: string;
}

/**
 * Сервис синхронизации данных между локальной БД и сервером
 */
export class SyncService {
  private syncInProgress = false;
  private syncInterval: number | null = null;

  /**
   * Добавить изменение в очередь синхронизации
   */
  async queueMutation(
    entity: PendingMutation['entity'],
    operation: PendingMutation['operation'],
    data: Record<string, unknown>,
    id?: string,
    tempId?: string,
    version?: string,
  ): Promise<void> {
    const mutationId = id || tempId || `temp-${Date.now()}-${Math.random()}`;

    await db.pendingMutations.add({
      id: mutationId,
      tempId: tempId || (operation === 'create' ? mutationId : undefined),
      entity,
      operation,
      data,
      version,
      createdAt: new Date(),
      retryCount: 0,
    });

    // Регистрируем Background Sync, если доступен
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const syncManager = (registration as any).sync;
        if (syncManager) {
          await syncManager.register('sync-data');
        }
      } catch (error) {
        console.warn('Background Sync не доступен:', error);
      }
    }
  }

  /**
   * Получить все ожидающие синхронизации изменения
   */
  async getPendingMutations(): Promise<PendingMutation[]> {
    return await db.pendingMutations
      .orderBy('createdAt')
      .filter((m) => m.retryCount < 3) // Максимум 3 попытки
      .toArray();
  }

  /**
   * Синхронизировать изменения с сервером
   */
  async sync(): Promise<SyncResponse | null> {
    if (this.syncInProgress) {
      return null;
    }

    const pending = await this.getPendingMutations();
    if (pending.length === 0) {
      return null;
    }

    this.syncInProgress = true;

    try {
      // Формируем батч для отправки
      const batch = {
        changes: pending.map((mutation) => ({
          id: mutation.operation !== 'create' ? mutation.id : undefined,
          tempId: mutation.tempId,
          operation: mutation.operation,
          entity: mutation.entity,
          data: mutation.data,
          version: mutation.version,
        })),
      };

      // Отправляем на сервер
      const response = await apiClient.post<SyncResponse>('/sync', batch);

      // Обрабатываем результаты
      await this.processSyncResults(pending, response.data);

      return response.data;
    } catch (error) {
      // Увеличиваем счетчик попыток для всех мутаций
      for (const mutation of pending) {
        await db.pendingMutations.update(mutation.id, {
          retryCount: mutation.retryCount + 1,
        });
      }

      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Обработать результаты синхронизации
   */
  private async processSyncResults(
    pending: PendingMutation[],
    response: SyncResponse,
  ): Promise<void> {
    for (let i = 0; i < pending.length; i++) {
      const mutation = pending[i];
      const result = response.results[i];

      if (result.success && !result.conflict) {
        // Успешная синхронизация - удаляем из очереди
        await db.pendingMutations.delete(mutation.id);

        // Обновляем локальную запись с серверным ID и статусом
        if (result.id && mutation.tempId) {
          await this.updateLocalRecordWithServerId(
            mutation.entity,
            mutation.tempId,
            result.id,
            result.serverVersion,
          );
        }

        // Инвалидируем соответствующие запросы в React Query
        this.invalidateQueries(mutation.entity);
      } else if (result.conflict) {
        // Конфликт - помечаем для ручного разрешения
        await db.pendingMutations.update(mutation.id, {
          retryCount: 999, // Помечаем как конфликт
        });
      }
    }
  }

  /**
   * Обновить локальную запись с серверным ID
   */
  private async updateLocalRecordWithServerId(
    entity: PendingMutation['entity'],
    tempId: string,
    serverId: string,
    serverVersion?: string,
  ): Promise<void> {
    switch (entity) {
      case 'client':
        await db.clients.update(tempId, {
          id: serverId,
          _tempId: undefined,
          _syncStatus: 'synced',
          updatedAt: serverVersion ? serverVersion : new Date().toISOString(),
        });
        break;
      case 'vehicle':
        await db.vehicles.update(tempId, {
          id: serverId,
          _tempId: undefined,
          _syncStatus: 'synced',
          updatedAt: serverVersion ? serverVersion : new Date().toISOString(),
        });
        break;
      case 'repair':
        await db.repairs.update(tempId, {
          id: serverId,
          _tempId: undefined,
          _syncStatus: 'synced',
          updatedAt: serverVersion ? serverVersion : new Date().toISOString(),
        });
        break;
      case 'repair-task':
        await db.repairTasks.update(tempId, {
          id: serverId,
          _tempId: undefined,
          _syncStatus: 'synced',
          updatedAt: serverVersion ? serverVersion : new Date().toISOString(),
        });
        break;
      case 'part':
        await db.parts.update(tempId, {
          id: serverId,
          _tempId: undefined,
          _syncStatus: 'synced',
          updatedAt: serverVersion ? serverVersion : new Date().toISOString(),
        });
        break;
    }
  }

  /**
   * Инвалидировать запросы React Query для сущности
   */
  private invalidateQueries(entity: PendingMutation['entity']): void {
    switch (entity) {
      case 'client':
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
        break;
      case 'vehicle':
        queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
        break;
      case 'repair':
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.all });
        break;
      case 'repair-task':
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.all });
        break;
      case 'part':
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.all });
        break;
    }
  }

  /**
   * Загрузить изменения с сервера
   */
  async pullChanges(updatedSince?: Date, entities?: string[]): Promise<Record<string, unknown[]>> {
    const params: Record<string, string> = {};
    if (updatedSince) {
      params.updated_since = updatedSince.toISOString();
    }
    if (entities) {
      params.entities = entities.join(',');
    }

    const response = await apiClient.get<Record<string, unknown[]>>('/sync/changes', { params });
    return response.data;
  }

  /**
   * Запустить автоматическую синхронизацию
   */
  startAutoSync(intervalMs: number = 30000): void {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    this.syncInterval = window.setInterval(() => {
      if (navigator.onLine) {
        this.sync().catch((error) => {
          console.error('Auto sync error:', error);
        });
      }
    }, intervalMs);
  }

  /**
   * Остановить автоматическую синхронизацию
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Экспортируем единственный экземпляр сервиса
export const syncService = new SyncService();

