import { apiClient } from '@/shared/api/axios';

export type ReportGroupBy = 'day' | 'week' | 'month';

export interface ReportQueryParams {
  from?: string;
  to?: string;
  groupBy?: ReportGroupBy;
}

export interface ReportSummaryItem {
  period: string;
  revenue: number;
  cost: number;
  margin: number;
  repairsCount: number;
}

export interface DailyReportRepair {
  id: string;
  name?: string;
  vehicle: string;
  revenue: number;
  cost: number;
  margin: number;
}

export interface DailyReport {
  date: string;
  revenue: number;
  cost: number;
  margin: number;
  repairsCount: number;
  repairs: DailyReportRepair[];
}

export const reportApi = {
  getSummary: async (params?: ReportQueryParams): Promise<ReportSummaryItem[]> => {
    const { data } = await apiClient.get<ReportSummaryItem[]>('/reports/summary', {
      params,
    });
    return data;
  },

  getDaily: async (params?: ReportQueryParams): Promise<DailyReport[]> => {
    const { data } = await apiClient.get<DailyReport[]>('/reports/daily', {
      params,
    });
    return data;
  },

  exportCSV: async (params?: ReportQueryParams): Promise<Blob> => {
    const response = await apiClient.get('/reports/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

