import { Control, FieldErrors } from 'react-hook-form';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  TextField,
  Box,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { CreateVehicleFormData } from '../schemas';

interface VehicleDataCardProps {
  control: Control<CreateVehicleFormData>;
  errors: FieldErrors<CreateVehicleFormData>;
}

export const VehicleDataCard = ({ control, errors }: VehicleDataCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Данные автомобиля
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name="make"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Марка *"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
                  error={!!errors.make}
                  helperText={errors.make?.message}
                />
              )}
            />
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Модель *"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
                  error={!!errors.model}
                  helperText={errors.model?.message}
                />
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Год"
                  type="number"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 120px' } }}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  error={!!errors.year}
                  helperText={errors.year?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name="plateNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Госномер"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
                  error={!!errors.plateNumber}
                  helperText={errors.plateNumber?.message}
                />
              )}
            />
            <Controller
              name="vin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="VIN"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 300px' } }}
                  error={!!errors.vin}
                  helperText={errors.vin?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name="engine"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Двигатель"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
                  error={!!errors.engine}
                  helperText={errors.engine?.message}
                />
              )}
            />
            <Controller
              name="transmission"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Коробка передач"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
                  error={!!errors.transmission}
                  helperText={errors.transmission?.message}
                />
              )}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Цвет"
                  fullWidth
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 150px' } }}
                  error={!!errors.color}
                  helperText={errors.color?.message}
                />
              )}
            />
          </Box>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Заметки"
                multiline
                rows={4}
                fullWidth
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

