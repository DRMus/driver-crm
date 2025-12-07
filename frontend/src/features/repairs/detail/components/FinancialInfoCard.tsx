import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  List,
  ListItem,
} from '@mui/material';
import { Repair } from '@/entities/repair';
import { formatCurrency } from '../../list/utils';

interface FinancialInfoCardProps {
  repair: Repair;
}

export const FinancialInfoCard = ({ repair }: FinancialInfoCardProps) => {
  const tasks = repair.tasks || [];
  const parts = repair.parts || [];
  
  // Вычисляем сумму работ из списка (сумма price для каждой работы)
  const calculatedLaborTotal = tasks.reduce((sum, task) => {
    const price = typeof task.price === 'string' ? parseFloat(task.price) : (task.price || 0);
    return sum + price;
  }, 0);
  
  // Вычисляем сумму запчастей из списка (сумма salePrice * quantity для каждой запчасти)
  const calculatedPartsTotal = parts.reduce((sum, part) => {
    const salePrice = typeof part.salePrice === 'string' ? parseFloat(part.salePrice) : (part.salePrice || 0);
    const quantity = typeof part.quantity === 'string' ? parseFloat(part.quantity) : (part.quantity || 1);
    return sum + salePrice * quantity;
  }, 0);
  
  // Используем вычисленные суммы, если они больше 0, иначе используем значения с бэкенда
  const laborTotal = calculatedLaborTotal > 0 ? calculatedLaborTotal : (repair.laborTotal || 0);
  const partsTotal = calculatedPartsTotal > 0 ? calculatedPartsTotal : (repair.partsTotal || 0);
  
  // Итоговая сумма = сумма работ + сумма запчастей
  const grandTotal = laborTotal + partsTotal;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Финансовая информация
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={3}>
          {/* Список работ */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Работы
            </Typography>
            {tasks.length > 0 ? (
              <List dense>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 0,
                    }}
                  >
                    <Typography variant="body2">{task.name}</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(task.price)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
              Нет работ
            </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Сумма работ
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(laborTotal)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Список запчастей */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Запчасти
            </Typography>
            {parts.length > 0 ? (
              <List dense>
                {parts.map((part) => (
                  <ListItem
                    key={part.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 0,
                    }}
                  >
                    <Typography variant="body2">
                      {part.name}
                      {part.quantity > 1 && ` × ${part.quantity}`}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatCurrency(part.purchasePrice * (part.quantity || 1))}
                      </Typography>
                      {' / '}
                      {formatCurrency(part.salePrice * (part.quantity || 1))}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
              Нет запчастей
            </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Сумма запчастей
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(partsTotal)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Итого */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Итого</Typography>
            <Typography variant="h6" color="primary">
              {formatCurrency(grandTotal)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

