import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useClientsList } from './useClientsList';
import { useNavigate } from 'react-router-dom';

export const ClientsList = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { clients, isLoading, error } = useClientsList({
    search: search || undefined,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Клиенты
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clients/new')}
        >
          Добавить клиента
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Поиск по имени, телефону или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              {search ? 'Клиенты не найдены' : 'Нет клиентов. Добавьте первого клиента.'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {clients.map((client) => (
            <Card
              key={client.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {client.fullName}
                    </Typography>
                    {client.phone && (
                      <Typography variant="body2" color="text.secondary">
                        📞 {client.phone}
                      </Typography>
                    )}
                    {client.email && (
                      <Typography variant="body2" color="text.secondary">
                        ✉️ {client.email}
                      </Typography>
                    )}
                    {client.address && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        📍 {client.address}
                      </Typography>
                    )}
                  </Box>
                  {client.vehicles && client.vehicles.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {client.vehicles.length} авто
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

