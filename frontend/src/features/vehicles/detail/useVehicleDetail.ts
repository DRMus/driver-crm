import { useSafeQuery } from '@/shared/lib/hooks';
import { vehicleApi } from '@/entities/vehicle';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/shared/lib/react-query';

export const useVehicleDetail = () => {
  const { id } = useParams<{ id: string }>();

  const query = useSafeQuery({
    queryKey: queryKeys.vehicles.detail(id!),
    queryFn: () => {
      if (!id) throw new Error('ID автомобиля не указан');
      return vehicleApi.getById(id);
    },
    enabled: !!id,
  });

  return {
    ...query,
    vehicle: query.data,
  };
};

