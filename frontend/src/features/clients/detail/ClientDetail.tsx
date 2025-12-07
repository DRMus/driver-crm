import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClientDetail } from './useClientDetail';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/entities/client';
import { queryKeys } from '@/shared/lib/react-query';
import { DELETE_CONFIRM_MESSAGE } from './constants';

export const ClientDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { client, isLoading, error } = useClientDetail();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      navigate('/clients');
    },
  });

  const handleDelete = () => {
    if (client && window.confirm(DELETE_CONFIRM_MESSAGE)) {
      deleteMutation.mutate(client.id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Клиент не найден
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/clients')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {client.fullName}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/clients/${client.id}/edit`)}
        >
          Редактировать
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          Удалить
        </Button>
      </Box>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Контактная информация
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              {client.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="action" />
                  <Typography>{client.phone}</Typography>
                </Box>
              )}
              {client.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Typography>{client.email}</Typography>
                </Box>
              )}
              {client.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationIcon color="action" />
                  <Typography>{client.address}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {client.notes && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Заметки
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {client.notes}
              </Typography>
            </CardContent>
          </Card>
        )}

        {client.vehicles && client.vehicles.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Автомобили ({client.vehicles.length})
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {client.vehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {vehicle.color ? `${vehicle.color} ` : ''}{vehicle.make} {vehicle.model}
                        {vehicle.year && ` (${vehicle.year})`}
                      </Typography>
                      {vehicle.plateNumber && (
                        <Typography variant="body2" color="text.secondary">
                          Госномер: {vehicle.plateNumber}
                        </Typography>
                      )}
                      {vehicle.vin && (
                        <Typography variant="body2" color="text.secondary">
                          VIN: {vehicle.vin}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

