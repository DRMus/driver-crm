import { apiClient } from '@/shared/api/axios';
import { Vehicle } from '../model/types';
import { Client } from '@/entities/client';
import { Repair } from '@/entities/repair';

export interface VehicleWithClient extends Vehicle {
  client?: Client;
  repairs?: Repair[];
}

export const vehicleApi = {
  getAll: async (params?: {
    clientId?: string;
    vin?: string;
    plateNumber?: string;
    updated_since?: string;
  }): Promise<VehicleWithClient[]> => {
    const { data } = await apiClient.get<VehicleWithClient[]>('/vehicles', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<VehicleWithClient> => {
    const { data } = await apiClient.get<VehicleWithClient>(`/vehicles/${id}`);
    return data;
  },

  create: async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<VehicleWithClient> => {
    const { data } = await apiClient.post<VehicleWithClient>('/vehicles', vehicle);
    return data;
  },

  update: async (id: string, vehicle: Partial<Vehicle>): Promise<VehicleWithClient> => {
    const { data } = await apiClient.patch<VehicleWithClient>(`/vehicles/${id}`, vehicle);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
};

