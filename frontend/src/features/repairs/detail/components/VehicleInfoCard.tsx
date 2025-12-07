import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { DirectionsCar as CarIcon } from '@mui/icons-material';
import { Repair } from '@/entities/repair';

interface VehicleInfoCardProps {
  vehicle: Repair['vehicle'];
}

export const VehicleInfoCard = ({ vehicle }: VehicleInfoCardProps) => {
  if (!vehicle) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CarIcon color="primary" />
          <Typography variant="h6">Автомобиль</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          {vehicle.color ? `${vehicle.color} ` : ''}{vehicle.make} {vehicle.model}
          {vehicle.year && ` (${vehicle.year})`}
        </Typography>
        {vehicle.plateNumber && (
          <Typography variant="body2" color="text.secondary">
            Госномер: {vehicle.plateNumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

