import { apiClient } from '@/shared/api/axios';
import { Part } from '../model/types';

export const partApi = {
  getAll: async (params?: {
    repairId?: string;
  }): Promise<Part[]> => {
    const { data } = await apiClient.get<Part[]>('/parts', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Part> => {
    const { data } = await apiClient.get<Part>(`/parts/${id}`);
    return data;
  },

  create: async (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>): Promise<Part> => {
    const { data } = await apiClient.post<Part>('/parts', part);
    return data;
  },

  update: async (id: string, part: Partial<Omit<Part, 'id' | 'repairId' | 'createdAt' | 'updatedAt'>>): Promise<Part> => {
    const { data } = await apiClient.patch<Part>(`/parts/${id}`, part);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/parts/${id}`);
  },
};

