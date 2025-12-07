import Dexie, { Table } from 'dexie';
import { Client } from '@/entities/client';
import { Vehicle } from '@/entities/vehicle';
import { Repair } from '@/entities/repair';
import { RepairTask } from '@/entities/repair-task';
import { Part } from '@/entities/part';

// Интерфейсы для хранения в IndexedDB
export interface ClientRecord extends Client {
  _syncStatus?: 'synced' | 'pending' | 'conflict';
  _tempId?: string;
}

export interface VehicleRecord extends Vehicle {
  _syncStatus?: 'synced' | 'pending' | 'conflict';
  _tempId?: string;
}

export interface RepairRecord extends Repair {
  _syncStatus?: 'synced' | 'pending' | 'conflict';
  _tempId?: string;
}

export interface RepairTaskRecord extends RepairTask {
  _syncStatus?: 'synced' | 'pending' | 'conflict';
  _tempId?: string;
}

export interface PartRecord extends Part {
  _syncStatus?: 'synced' | 'pending' | 'conflict';
  _tempId?: string;
}

// Очередь локальных изменений для синхронизации
export interface PendingMutation {
  id: string;
  tempId?: string;
  entity: 'client' | 'vehicle' | 'repair' | 'repair-task' | 'part';
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  version?: string;
  createdAt: Date;
  retryCount: number;
}

// Класс базы данных IndexedDB
export class AppDatabase extends Dexie {
  clients!: Table<ClientRecord, string>;
  vehicles!: Table<VehicleRecord, string>;
  repairs!: Table<RepairRecord, string>;
  repairTasks!: Table<RepairTaskRecord, string>;
  parts!: Table<PartRecord, string>;
  pendingMutations!: Table<PendingMutation, string>;

  constructor() {
    super('DriverCRM');

    this.version(1).stores({
      clients: 'id, fullName, phone, email, updatedAt, _syncStatus',
      vehicles: 'id, clientId, vin, plateNumber, updatedAt, _syncStatus',
      repairs: 'id, vehicleId, reportedAt, status, updatedAt, _syncStatus',
      repairTasks: 'id, repairId, updatedAt, _syncStatus',
      parts: 'id, repairId, updatedAt, _syncStatus',
      pendingMutations: 'id, entity, operation, createdAt, retryCount',
    });
  }
}

// Экспортируем единственный экземпляр базы данных
export const db = new AppDatabase();

