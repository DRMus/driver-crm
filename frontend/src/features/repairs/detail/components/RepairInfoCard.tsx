import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
} from '@mui/material';
import { Build as BuildIcon } from '@mui/icons-material';
import { Repair } from '@/entities/repair';

interface RepairInfoCardProps {
  repair: Repair;
}

export const RepairInfoCard = ({ repair }: RepairInfoCardProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BuildIcon color="primary" />
          <Typography variant="h6">Информация о ремонте</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {repair.name && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Название работы
              </Typography>
              <Typography variant="body1">{repair.name}</Typography>
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Дата обращения
            </Typography>
            <Typography variant="body1">
              {new Date(repair.reportedAt).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
          {repair.mileage && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Пробег
              </Typography>
              <Typography variant="body1">
                {repair.mileage.toLocaleString('ru-RU')} км
              </Typography>
            </Box>
          )}
          {repair.comments && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Комментарии
              </Typography>
              <Typography variant="body1">{repair.comments}</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

