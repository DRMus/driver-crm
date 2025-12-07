import { useSafeQuery } from '@/shared/lib/hooks';
import { clientApi } from '@/entities/client';
import { queryKeys } from '@/shared/lib/react-query';

interface UseClientsListParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export const useClientsList = (params?: UseClientsListParams) => {
  const query = useSafeQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: () => clientApi.getAll(params),
  });

  return {
    ...query,
    clients: query.data?.data || [],
    total: query.data?.total || 0,
  };
};

