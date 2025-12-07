import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  InputAdornment,
} from '@mui/material';
import { RepairTaskFormData } from '../schemas';
import { z } from 'zod';

const taskSchema = z.object({
  name: z.string().min(1, 'Название работы обязательно'),
  price: z.number().min(0, 'Сумма должна быть неотрицательной'),
});

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: RepairTaskFormData) => void;
}

export const AddTaskModal = ({ open, onClose, onAdd }: AddTaskModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>(0);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const handleSubmit = () => {
    const result = taskSchema.safeParse({
      name,
      price: typeof price === 'number' ? price : 0,
    });

    if (!result.success) {
      const fieldErrors: { name?: string; price?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'price') fieldErrors.price = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAdd(result.data);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setPrice(0);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить работу</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Название работы"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
          <TextField
            label="Сумма (руб.)"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : '';
              setPrice(value);
              if (errors.price) setErrors({ ...errors, price: undefined });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

