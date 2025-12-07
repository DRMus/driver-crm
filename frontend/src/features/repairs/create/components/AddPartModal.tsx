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
import { PartFormData } from '../schemas';
import { z } from 'zod';

const partSchema = z.object({
  name: z.string().min(1, 'Название запчасти обязательно'),
  purchasePrice: z.number().min(0, 'Цена должна быть неотрицательной').optional(),
  salePrice: z.number().min(0, 'Цена должна быть неотрицательной').optional(),
});

interface AddPartModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (part: PartFormData) => void;
}

export const AddPartModal = ({ open, onClose, onAdd }: AddPartModalProps) => {
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>(0);
  const [salePrice, setSalePrice] = useState<number | ''>(0);
  const [errors, setErrors] = useState<{ name?: string; purchasePrice?: string; salePrice?: string }>({});

  const handleSubmit = () => {
    const result = partSchema.safeParse({
      name,
      purchasePrice: typeof purchasePrice === 'number' ? purchasePrice : 0,
      salePrice: typeof salePrice === 'number' ? salePrice : 0,
    });

    if (!result.success) {
      const fieldErrors: { name?: string; purchasePrice?: string; salePrice?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'purchasePrice') fieldErrors.purchasePrice = err.message;
        if (err.path[0] === 'salePrice') fieldErrors.salePrice = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAdd(result.data);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setPurchasePrice(0);
    setSalePrice(0);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить запчасть</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Название запчасти"
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
            label="Цена закупочная (руб.)"
            type="number"
            fullWidth
            value={purchasePrice}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : '';
              setPurchasePrice(value);
              if (errors.purchasePrice) setErrors({ ...errors, purchasePrice: undefined });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
            error={!!errors.purchasePrice}
            helperText={errors.purchasePrice}
          />
          <TextField
            label="Цена продажи (руб.)"
            type="number"
            fullWidth
            value={salePrice}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : '';
              setSalePrice(value);
              if (errors.salePrice) setErrors({ ...errors, salePrice: undefined });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
            error={!!errors.salePrice}
            helperText={errors.salePrice}
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

