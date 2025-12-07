import { Box, Stack } from '@mui/material';
import { useCreateVehicleForm } from './hooks/useCreateVehicleForm';
import {
  ClientSelectionCard,
  VehicleDataCard,
  FormErrorAlert,
  FormActions,
} from './components';

export const CreateVehicleForm = () => {
  const {
    control,
    handleSubmit,
    errors,
    resetField,
    clientMode,
    setClientMode,
    isEditMode,
    vehicleData,
    clientsData,
    createClientMutation,
    createVehicleMutation,
    onSubmit,
    isLoading,
  } = useCreateVehicleForm();

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <ClientSelectionCard
            control={control}
            errors={errors}
            clientMode={clientMode}
            onModeChange={setClientMode}
            resetField={resetField}
            isEditMode={isEditMode}
            clientName={vehicleData?.client?.fullName}
            clientPhone={vehicleData?.client?.phone}
            clientsData={clientsData}
          />

          <VehicleDataCard control={control} errors={errors} />

          {(createClientMutation.isError || createVehicleMutation.isError) && (
            <FormErrorAlert
              createClientError={createClientMutation.error || null}
              createVehicleError={createVehicleMutation.error || null}
            />
          )}

          <FormActions
            isLoading={isLoading}
            isEditMode={isEditMode}
            vehicleId={vehicleData?.id}
            submitLabel={isEditMode ? 'Сохранить' : 'Создать'}
          />
        </Stack>
      </form>
    </Box>
  );
};
