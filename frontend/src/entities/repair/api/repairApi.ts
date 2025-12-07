import { apiClient } from '@/shared/api/axios';
import { Repair } from '../model/types';

export const repairApi = {
  getAll: async (params?: {
    vehicleId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    updated_since?: string;
  }): Promise<Repair[]> => {
    const { data } = await apiClient.get<Repair[]>('/repairs', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Repair> => {
    const { data } = await apiClient.get<Repair>(`/repairs/${id}`);
    return data;
  },

  create: async (repair: Omit<Repair, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'syncedAt'>): Promise<Repair> => {
    const { data } = await apiClient.post<Repair>('/repairs', repair);
    return data;
  },

  update: async (id: string, repair: Partial<Repair>): Promise<Repair> => {
    const { data } = await apiClient.patch<Repair>(`/repairs/${id}`, repair);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/repairs/${id}`);
  },

  recalculateTotals: async (id: string): Promise<Repair> => {
    const { data } = await apiClient.post<Repair>(`/repairs/${id}/recalculate`);
    return data;
  },
};

