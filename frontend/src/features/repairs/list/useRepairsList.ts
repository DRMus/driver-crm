import { useSafeQuery } from '@/shared/lib/hooks';
import { repairApi } from '@/entities/repair';
import { queryKeys } from '@/shared/lib/react-query';

interface UseRepairsListParams {
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useRepairsList = (params?: UseRepairsListParams) => {
  const query = useSafeQuery({
    queryKey: queryKeys.repairs.list(params),
    queryFn: () => repairApi.getAll(params),
  });

  return {
    ...query,
    repairs: query.data || [],
  };
};

