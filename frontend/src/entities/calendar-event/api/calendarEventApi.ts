import { apiClient } from '@/shared/api/axios';
import { CalendarEvent } from '../model/types';

export interface CalendarEventQueryParams {
  dateFrom?: string;
  dateTo?: string;
  isCompleted?: boolean;
  relatedRepairId?: string;
  relatedClientId?: string;
  updated_since?: string;
}

export interface UpcomingEventsParams {
  limit?: number;
  days?: number;
}

export const calendarEventApi = {
  getAll: async (params?: CalendarEventQueryParams): Promise<CalendarEvent[]> => {
    const { data } = await apiClient.get<CalendarEvent[]>('/calendar/events', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<CalendarEvent> => {
    const { data } = await apiClient.get<CalendarEvent>(`/calendar/events/${id}`);
    return data;
  },

  getUpcoming: async (params?: UpcomingEventsParams): Promise<CalendarEvent[]> => {
    const { data } = await apiClient.get<CalendarEvent[]>('/calendar/upcoming', {
      params,
    });
    return data;
  },

  create: async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<CalendarEvent> => {
    const { data } = await apiClient.post<CalendarEvent>('/calendar/events', event);
    return data;
  },

  update: async (id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const { data } = await apiClient.patch<CalendarEvent>(`/calendar/events/${id}`, event);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/calendar/events/${id}`);
  },
};

