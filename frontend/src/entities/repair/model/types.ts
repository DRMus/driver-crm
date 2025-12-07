import { Vehicle } from '../../vehicle/model/types';
import { Part } from '../../part';
import { RepairTask } from '../../repair-task';

export interface Repair {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  reportedAt: string;
  name?: string;
  mileage?: number;
  laborTotal: number;
  partsTotal: number;
  grandTotal: number;
  comments?: string;
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  parts?: Part[];
  tasks?: RepairTask[];
}

