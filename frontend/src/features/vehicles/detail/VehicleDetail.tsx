import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useVehicleDetail } from './useVehicleDetail';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from '@/entities/vehicle';
import { queryKeys } from '@/shared/lib/react-query';
import { DELETE_CONFIRM_MESSAGE } from './constants';
import { useSafeQuery } from '@/shared/lib/hooks';
import { repairApi } from '@/entities/repair';
import { formatCurrency } from '@/shared/lib/utils';

export const VehicleDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { vehicle, isLoading, error } = useVehicleDetail();

  // Загружаем ремонты для данного автомобиля
  const { data: repairs, isLoading: isRepairsLoading } = useSafeQuery({
    queryKey: queryKeys.repairs.list({ vehicleId: vehicle?.id }),
    queryFn: () => repairApi.getAll({ vehicleId: vehicle!.id }),
    enabled: !!vehicle?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      navigate('/vehicles');
    },
  });

  const handleDelete = () => {
    if (vehicle && window.confirm(DELETE_CONFIRM_MESSAGE)) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Автомобиль не найден
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate('/vehicles')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'none' }}>
            {vehicle.color ? `${vehicle.color} ` : ''}{vehicle.make} {vehicle.model}
            {vehicle.year && ` (${vehicle.year})`}
          </Typography>
        </Box>
        <IconButton
          color="primary"
          onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
          title="Редактировать"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          title="Удалить"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Stack spacing={3}>
        {/* Информация о клиенте */}
        {vehicle.client && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Владелец</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {vehicle.client.fullName}
                </Typography>
                {vehicle.client.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{vehicle.client.phone}</Typography>
                  </Box>
                )}
                {vehicle.client.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2">{vehicle.client.email}</Typography>
                  </Box>
                )}
                {vehicle.client.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2">{vehicle.client.address}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Данные автомобиля */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CarIcon color="primary" />
              <Typography variant="h6">Характеристики</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Марка и модель
                </Typography>
                <Typography variant="body1">
                  {vehicle.color ? `${vehicle.color} ` : ''}{vehicle.make} {vehicle.model}
                </Typography>
              </Box>
              {vehicle.year && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Год выпуска
                  </Typography>
                  <Typography variant="body1">{vehicle.year}</Typography>
                </Box>
              )}
              {vehicle.plateNumber && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Госномер
                  </Typography>
                  <Typography variant="body1">{vehicle.plateNumber}</Typography>
                </Box>
              )}
              {vehicle.vin && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    VIN
                  </Typography>
                  <Typography variant="body1">{vehicle.vin}</Typography>
                </Box>
              )}
              {vehicle.color && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Цвет
                  </Typography>
                  <Typography variant="body1">{vehicle.color}</Typography>
                </Box>
              )}
              {vehicle.engine && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Двигатель
                  </Typography>
                  <Typography variant="body1">{vehicle.engine}</Typography>
                </Box>
              )}
              {vehicle.transmission && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Коробка передач
                  </Typography>
                  <Typography variant="body1">{vehicle.transmission}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {vehicle.notes && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Заметки
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {vehicle.notes}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Список ремонтов */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BuildIcon color="primary" />
                <Typography variant="h6">Ремонты</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/vehicles/${vehicle.id}/repairs/new`)}
              >
                Добавить ремонт
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {isRepairsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : repairs && repairs.length > 0 ? (
              <Stack spacing={2}>
                {repairs.map((repair) => (
                  <Card
                    key={repair.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => navigate(`/repairs/${repair.id}`)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '200px' } }}>
                          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                            {repair.name || `Ремонт #${repair.id.slice(0, 8)}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Дата:{' '}
                            {new Date(repair.reportedAt).toLocaleDateString('ru-RU')}
                          </Typography>
                          {repair.mileage && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Пробег: {repair.mileage.toLocaleString('ru-RU')} км
                            </Typography>
                          )}
                          {repair.comments && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1, fontStyle: 'italic' }}
                            >
                              {repair.comments}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            textAlign: { xs: 'left', sm: 'right' },
                            minWidth: { xs: '100%', sm: '150px' },
                          }}
                        >
                          {repair.grandTotal > 0 && (
                            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                              {formatCurrency(repair.grandTotal)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Нет ремонтов. Добавьте первый ремонт.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

