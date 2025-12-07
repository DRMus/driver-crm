import { useSafeQuery } from '@/shared/lib/hooks';
import { vehicleApi } from '@/entities/vehicle';
import { queryKeys } from '@/shared/lib/react-query';

interface UseVehiclesListParams {
  clientId?: string;
  vin?: string;
  plateNumber?: string;
  search?: string;
}

export const useVehiclesList = (params?: UseVehiclesListParams) => {
  const query = useSafeQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => vehicleApi.getAll(params),
  });

  return {
    ...query,
    vehicles: query.data || [],
  };
};

