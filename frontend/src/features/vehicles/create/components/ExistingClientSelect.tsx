import { Control, FieldError } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';
import { CreateVehicleFormData } from '../schemas';

interface ExistingClientSelectProps {
  control: Control<CreateVehicleFormData>;
  error?: FieldError;
  clientsData?: { data?: Array<{ id: string; fullName: string; phone?: string }> };
}

export const ExistingClientSelect = ({
  control,
  error,
  clientsData,
}: ExistingClientSelectProps) => {
  return (
    <Controller
      name="clientId"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          label="Клиент *"
          fullWidth
          error={!!error}
          helperText={error?.message}
        >
          {clientsData?.data?.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.fullName} {client.phone && `(${client.phone})`}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

