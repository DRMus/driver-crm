/**
 * Централизованные ключи для React Query
 * Используются для кеширования и инвалидации запросов
 */
export const queryKeys = {
  // Клиенты
  clients: {
    all: ['clients'] as const,
    lists: () => [...queryKeys.clients.all, 'list'] as const,
    list: (params?: Record<string, unknown> | object) => [...queryKeys.clients.lists(), params] as const,
    details: () => [...queryKeys.clients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },

  // Автомобили
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (params?: Record<string, unknown> | object) => [...queryKeys.vehicles.lists(), params] as const,
    details: () => [...queryKeys.vehicles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vehicles.details(), id] as const,
  },

  // Ремонты
  repairs: {
    all: ['repairs'] as const,
    lists: () => [...queryKeys.repairs.all, 'list'] as const,
    list: (params?: Record<string, unknown> | object) => [...queryKeys.repairs.lists(), params] as const,
    details: () => [...queryKeys.repairs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.repairs.details(), id] as const,
  },

  // Отчеты
  reports: {
    all: ['reports'] as const,
    summary: (params?: Record<string, unknown> | object) => [...queryKeys.reports.all, 'summary', params] as const,
    daily: (params?: Record<string, unknown> | object) => [...queryKeys.reports.all, 'daily', params] as const,
  },

  // Календарь
  calendarEvents: {
    all: ['calendarEvents'] as const,
    lists: () => [...queryKeys.calendarEvents.all, 'list'] as const,
    list: (params?: Record<string, unknown> | object) => [...queryKeys.calendarEvents.lists(), params] as const,
    details: () => [...queryKeys.calendarEvents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.calendarEvents.details(), id] as const,
    upcoming: (params?: Record<string, unknown> | object) => [...queryKeys.calendarEvents.all, 'upcoming', params] as const,
  },
} as const;

