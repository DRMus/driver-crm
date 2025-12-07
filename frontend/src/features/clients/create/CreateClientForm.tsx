import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/entities/client';
import { useNavigate } from 'react-router-dom';
import { queryKeys } from '@/shared/lib/react-query';
import { createClientSchema, type CreateClientFormData } from './schemas';

export const CreateClientForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateClientFormData) =>
      clientApi.create({
        ...data,
        email: data.email || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      navigate('/clients');
    },
  });

  const onSubmit = (data: CreateClientFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Добавить клиента
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Полное имя *"
                fullWidth
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />

              <TextField
                label="Телефон"
                fullWidth
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                label="Email"
                fullWidth
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Адрес"
                fullWidth
                multiline
                rows={2}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />

              <TextField
                label="Заметки"
                fullWidth
                multiline
                rows={4}
                {...register('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />

              {mutation.isError && (
                <Typography color="error">
                  Ошибка при создании клиента
                </Typography>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/clients')}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || mutation.isPending}
                >
                  {mutation.isPending ? 'Создание...' : 'Создать'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

