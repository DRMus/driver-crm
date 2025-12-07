import { RepairStatus } from '@/entities/repair';
import { formatCurrency } from '@/shared/lib/utils';

export { formatCurrency };

export const getStatusLabel = (status: RepairStatus) => {
  const statusMap: Record<RepairStatus, string> = {
    draft: 'Черновик',
    in_progress: 'В работе',
    done: 'Завершен',
    cancelled: 'Отменен',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: RepairStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
  const colorMap: Record<RepairStatus, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
    draft: 'default',
    in_progress: 'primary',
    done: 'success',
    cancelled: 'error',
  };
  return colorMap[status] || 'default';
};

