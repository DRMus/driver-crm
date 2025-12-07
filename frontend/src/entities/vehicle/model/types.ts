import { Vehicle } from '../../client/model/types';
import { Repair } from '../../repair/model/types';

export type { Vehicle };

export interface VehicleWithRepair extends Vehicle {
  repairs?: Repair[];
}

export interface VehiclesListResponse {
  data: Vehicle[];
  total?: number;
}

