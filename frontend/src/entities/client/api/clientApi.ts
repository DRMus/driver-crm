import { apiClient } from '@/shared/api/axios';
import { Client, ClientsListResponse } from '../model/types';

export const clientApi = {
  getAll: async (params?: {
    search?: string;
    limit?: number;
    offset?: number;
    updated_since?: string;
  }): Promise<ClientsListResponse> => {
    const { data } = await apiClient.get<ClientsListResponse>('/clients', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await apiClient.get<Client>(`/clients/${id}`);
    return data;
  },

  create: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Client> => {
    const { data } = await apiClient.post<Client>('/clients', client);
    return data;
  },

  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    const { data } = await apiClient.patch<Client>(`/clients/${id}`, client);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};

