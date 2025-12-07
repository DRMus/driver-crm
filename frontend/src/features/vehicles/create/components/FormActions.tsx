import { Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  isLoading: boolean;
  isEditMode: boolean;
  vehicleId?: string;
  submitLabel?: string;
}

export const FormActions = ({
  isLoading,
  isEditMode,
  vehicleId,
  submitLabel,
}: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button
        variant="outlined"
        onClick={() =>
          isEditMode && vehicleId ? navigate(`/vehicles/${vehicleId}`) : navigate('/')
        }
        disabled={isLoading}
      >
        Отмена
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Создание...' : submitLabel || 'Создать'}
      </Button>
    </Stack>
  );
};

