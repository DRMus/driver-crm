import { useSafeQuery } from '@/shared/lib/hooks';
import { repairApi } from '@/entities/repair';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/shared/lib/react-query';

export const useRepairDetail = () => {
  const { id } = useParams<{ id: string }>();

  const query = useSafeQuery({
    queryKey: queryKeys.repairs.detail(id!),
    queryFn: () => {
      if (!id) throw new Error('ID ремонта не указан');
      return repairApi.getById(id);
    },
    enabled: !!id,
  });

  return {
    ...query,
    repair: query.data,
  };
};

