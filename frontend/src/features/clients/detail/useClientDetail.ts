import { useSafeQuery } from '@/shared/lib/hooks';
import { clientApi } from '@/entities/client';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/shared/lib/react-query';

export const useClientDetail = () => {
  const { id } = useParams<{ id: string }>();

  const query = useSafeQuery({
    queryKey: queryKeys.clients.detail(id!),
    queryFn: () => {
      if (!id) throw new Error('ID клиента не указан');
      return clientApi.getById(id);
    },
    enabled: !!id,
  });

  return {
    ...query,
    client: query.data,
  };
};

