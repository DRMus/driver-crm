import { Control, FieldErrors } from 'react-hook-form';
import { TextField, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';
import { CreateVehicleFormData } from '../schemas';

interface NewClientFormProps {
  control: Control<CreateVehicleFormData>;
  errors?: FieldErrors<CreateVehicleFormData>['newClient'];
}

export const NewClientForm = ({ control, errors }: NewClientFormProps) => {
  return (
    <Stack spacing={2}>
      <Controller
        name="newClient.fullName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Полное имя клиента *"
            fullWidth
            error={!!errors?.fullName}
            helperText={errors?.fullName?.message}
          />
        )}
      />
      <Controller
        name="newClient.phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Телефон"
            fullWidth
            error={!!errors?.phone}
            helperText={errors?.phone?.message}
          />
        )}
      />
      <Controller
        name="newClient.email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            error={!!errors?.email}
            helperText={errors?.email?.message}
          />
        )}
      />
      <Controller
        name="newClient.address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Адрес"
            multiline
            rows={2}
            fullWidth
            error={!!errors?.address}
            helperText={errors?.address?.message}
          />
        )}
      />
    </Stack>
  );
};

