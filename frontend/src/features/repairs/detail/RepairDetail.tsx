import { Box, CircularProgress, Alert, Stack } from '@mui/material';
import { useRepairDetail } from './useRepairDetail';
import { useRepairActions } from './hooks/useRepairActions';
import {
  RepairHeader,
  VehicleInfoCard,
  RepairInfoCard,
  FinancialInfoCard,
} from './components';

export const RepairDetail = () => {
  const { repair, isLoading, error } = useRepairDetail();

  // Хук должен вызываться безусловно
  const { handleDelete, isDeleting } = useRepairActions({
    repairId: repair?.id || '',
    vehicleId: repair?.vehicleId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !repair) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Ремонт не найден
      </Alert>
    );
  }

  return (
    <Box>
      <RepairHeader
        repair={repair}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        vehicleId={repair.vehicleId}
      />

      <Stack spacing={3}>
        <VehicleInfoCard vehicle={repair.vehicle} />
        <RepairInfoCard repair={repair} />
        <FinancialInfoCard repair={repair} />
      </Stack>
    </Box>
  );
};
