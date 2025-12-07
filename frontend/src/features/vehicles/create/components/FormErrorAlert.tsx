import { Alert, Box } from '@mui/material';

interface FormErrorAlertProps {
  createClientError?: Error | null;
  createVehicleError?: Error | null;
}

export const FormErrorAlert = ({
  createClientError,
  createVehicleError,
}: FormErrorAlertProps) => {
  if (!createClientError && !createVehicleError) {
    return null;
  }

  return (
    <Alert severity="error">
      Ошибка при создании. Проверьте правильность заполнения полей.
      {createClientError && (
        <Box component="div" sx={{ mt: 1, fontSize: '0.875rem' }}>
          Ошибка клиента:{' '}
          {createClientError instanceof Error
            ? createClientError.message
            : 'Неизвестная ошибка'}
        </Box>
      )}
      {createVehicleError && (
        <Box component="div" sx={{ mt: 1, fontSize: '0.875rem' }}>
          Ошибка автомобиля:{' '}
          {createVehicleError instanceof Error
            ? createVehicleError.message
            : 'Неизвестная ошибка'}
        </Box>
      )}
    </Alert>
  );
};

