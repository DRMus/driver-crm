import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { useSafeQuery } from '@/shared/lib/hooks';

export const DashboardPage = () => {
  // Пример использования useSafeQuery
  const { data, isLoading } = useSafeQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Здесь будет запрос к API
      return { message: 'Добро пожаловать в Driver CRM!' };
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Дашборд
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              Открытые ремонты
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              0
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              Выручка за месяц
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              0 ₽
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              Ближайшие события
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              0
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography sx={{ mt: 3 }}>{data?.message}</Typography>
      )}
    </Box>
  );
};
