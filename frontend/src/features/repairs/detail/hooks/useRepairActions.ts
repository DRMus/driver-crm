import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairApi } from '@/entities/repair';
import { queryKeys } from '@/shared/lib/react-query';
import { DELETE_CONFIRM_MESSAGE } from '../constants';

interface UseRepairActionsParams {
  repairId: string;
  vehicleId?: string;
}

export const useRepairActions = ({ repairId, vehicleId }: UseRepairActionsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repairApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repairs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      if (vehicleId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(vehicleId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.list({ vehicleId }) });
        navigate(`/vehicles/${vehicleId}`);
      } else {
        navigate('/');
      }
    },
  });

  const handleDelete = () => {
    if (window.confirm(DELETE_CONFIRM_MESSAGE)) {
      deleteMutation.mutate(repairId);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};

