import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSafeQuery } from '@/shared/lib/hooks';
import { reportApi, ReportGroupBy } from '@/entities/report';
import { formatCurrency } from '@/shared/lib/utils';
import { queryKeys } from '@/shared/lib/react-query';

export const ReportsList = () => {
  const [from, setFrom] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0]
  );
  const [to, setTo] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [groupBy, setGroupBy] = useState<ReportGroupBy>('day');

  const { data: summary, isLoading, isError } = useSafeQuery({
    queryKey: queryKeys.reports.summary({ from, to, groupBy }),
    queryFn: () => reportApi.getSummary({ from, to, groupBy }),
  });

  const handleExport = async () => {
    try {
      const blob = await reportApi.exportCSV({ from, to, groupBy });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${from}_${to}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Ошибка при экспорте отчета');
    }
  };

  const totalRevenue = summary?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalCost = summary?.reduce((sum, item) => sum + item.cost, 0) || 0;
  const totalMargin = totalRevenue - totalCost;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6">Отчеты</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              label="Дата начала"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Дата окончания"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Группировка"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as ReportGroupBy)}
              fullWidth
            >
              <MenuItem value="day">По дням</MenuItem>
              <MenuItem value="week">По неделям</MenuItem>
              <MenuItem value="month">По месяцам</MenuItem>
            </TextField>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ minWidth: 150 }}
            >
              Экспорт CSV
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка при загрузке отчета
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : summary && summary.length > 0 ? (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Итого за период
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Выручка
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Себестоимость
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalCost)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Маржа
                  </Typography>
                  <Typography
                    variant="h6"
                    color={totalMargin >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(totalMargin)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ремонтов
                  </Typography>
                  <Typography variant="h6">
                    {summary.reduce((sum, item) => sum + item.repairsCount, 0)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Детализация по периодам
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Период</TableCell>
                      <TableCell align="right">Выручка</TableCell>
                      <TableCell align="right">Себестоимость</TableCell>
                      <TableCell align="right">Маржа</TableCell>
                      <TableCell align="right">Ремонтов</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.map((item) => (
                      <TableRow key={item.period}>
                        <TableCell>{item.period}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.revenue)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.cost)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={formatCurrency(item.margin)}
                            color={item.margin >= 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{item.repairsCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              Нет данных за выбранный период
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

