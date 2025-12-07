import { apiClient } from '@/shared/api/axios';
import { RepairTask } from '../model/types';

export const repairTaskApi = {
  getAll: async (params?: {
    repairId?: string;
  }): Promise<RepairTask[]> => {
    const { data } = await apiClient.get<RepairTask[]>('/repair-tasks', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<RepairTask> => {
    const { data } = await apiClient.get<RepairTask>(`/repair-tasks/${id}`);
    return data;
  },

  create: async (task: Omit<RepairTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepairTask> => {
    const { data } = await apiClient.post<RepairTask>('/repair-tasks', task);
    return data;
  },

  update: async (id: string, task: Partial<Omit<RepairTask, 'id' | 'repairId' | 'createdAt' | 'updatedAt'>>): Promise<RepairTask> => {
    const { data } = await apiClient.patch<RepairTask>(`/repair-tasks/${id}`, task);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/repair-tasks/${id}`);
  },
};

