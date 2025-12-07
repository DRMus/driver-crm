import { useState } from 'react';
import { Box, IconButton, Button, Stack, Typography, Card, CardContent, Chip } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, InboxOutlined as InboxIcon } from '@mui/icons-material';
import { Control, useFieldArray } from 'react-hook-form';
import { CreateRepairFormData, RepairTaskFormData } from '../schemas';
import { AddTaskModal } from './AddTaskModal';
import { formatCurrency } from '@/shared/lib/utils';

interface TasksListProps {
  control: Control<CreateRepairFormData>;
}

export const TasksList = ({ control }: TasksListProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (task: RepairTaskFormData) => {
    append(task);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Наряд работ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          size="small"
        >
          Добавить
        </Button>
      </Box>

      {fields.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <InboxIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Список пуст
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined">
              <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                      {field.name || 'Без названия'}
                    </Typography>
                    <Chip
                      label={formatCurrency(field.price || 0)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <AddTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </Box>
  );
};

