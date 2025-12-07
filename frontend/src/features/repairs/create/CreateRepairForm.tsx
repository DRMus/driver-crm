import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairApi } from '@/entities/repair';
import { repairTaskApi } from '@/entities/repair-task';
import { partApi } from '@/entities/part';
import { vehicleApi } from '@/entities/vehicle';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSafeQuery } from '@/shared/lib/hooks';
import { queryKeys } from '@/shared/lib/react-query';
import { useEffect } from 'react';
import { createRepairSchema, type CreateRepairFormData } from './schemas';
import { TasksList } from './components/TasksList';
import { PartsList } from './components/PartsList';

export const CreateRepairForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const params = useParams<{ id?: string }>();
  
  // Определяем режим редактирования: если путь содержит /repairs/:id/edit
  const isEditMode = location.pathname.includes('/repairs/') && location.pathname.includes('/edit');
  const repairId = isEditMode ? params.id : undefined;
  const vehicleId = !isEditMode ? params.id : undefined;

  // Загружаем данные ремонта для редактирования
  const { data: repairData } = useSafeQuery({
    queryKey: queryKeys.repairs.detail(repairId!),
    queryFn: () => repairApi.getById(repairId!),
    enabled: isEditMode && !!repairId,
  });

  // Загружаем автомобиль для отображения (из ремонта или по vehicleId)
  const actualVehicleId = repairData?.vehicleId || vehicleId;
  const { data: vehicle } = useSafeQuery({
    queryKey: queryKeys.vehicles.detail(actualVehicleId!),
    queryFn: () => vehicleApi.getById(actualVehicleId!),
    enabled: !!actualVehicleId,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRepairFormData>({
    resolver: zodResolver(createRepairSchema),
    defaultValues: {
      vehicleId: '',
      reportedAt: new Date().toISOString().split('T')[0],
      tasks: [],
      parts: [],
    },
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (isEditMode && repairData) {
      reset({
        vehicleId: repairData.vehicleId,
        reportedAt: repairData.reportedAt ? new Date(repairData.reportedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        name: repairData.name || '',
        mileage: repairData.mileage,
        comments: repairData.comments || '',
        tasks: repairData.tasks?.map((task) => ({
          name: task.name,
          price: typeof task.price === 'string' ? parseFloat(task.price) : (task.price || 0),
        })) || [],
        parts: repairData.parts?.map((part) => ({
          name: part.name,
          purchasePrice: typeof part.purchasePrice === 'string' ? parseFloat(part.purchasePrice) : (part.purchasePrice || 0),
          salePrice: typeof part.salePrice === 'string' ? parseFloat(part.salePrice) : (part.salePrice || 0),
          quantity: typeof part.quantity === 'string' ? parseFloat(part.quantity) : (part.quantity || 1),
        })) || [],
      });
    } else if (!isEditMode && actualVehicleId) {
      reset({
        vehicleId: actualVehicleId,
        reportedAt: new Date().toISOString().split('T')[0],
        tasks: [],
        parts: [],
      });
    }
  }, [isEditMode, repairData, actualVehicleId, reset]);

  const createRepairMutation = useMutation({
    mutationFn: async (data: CreateRepairFormData) => {
      if (isEditMode && repairId) {
        // Режим редактирования
        // Обновляем ремонт
        const repair = await repairApi.update(repairId, {
          vehicleId: data.vehicleId,
          reportedAt: data.reportedAt,
          name: data.name,
          mileage: typeof data.mileage === 'number' ? data.mileage : undefined,
          comments: data.comments,
        });

        // Удаляем все существующие работы
        if (repairData?.tasks) {
          await Promise.all(
            repairData.tasks.map((task) => repairTaskApi.delete(task.id))
          );
        }

        // Создаем новые работы
        if (data.tasks && data.tasks.length > 0) {
          await Promise.all(
            data.tasks.map((task) =>
              repairTaskApi.create({
                repairId: repair.id,
                name: task.name,
                price: task.price,
              })
            )
          );
        }

        // Удаляем все существующие запчасти
        if (repairData?.parts) {
          await Promise.all(
            repairData.parts.map((part) => partApi.delete(part.id))
          );
        }

        // Создаем новые запчасти
        if (data.parts && data.parts.length > 0) {
          await Promise.all(
            data.parts.map((part) =>
              partApi.create({
                repairId: repair.id,
                name: part.name,
                purchasePrice: part.purchasePrice || 0,
                salePrice: part.salePrice || 0,
                quantity: part.quantity || 1,
              })
            )
          );
        }

        return repair;
      } else {
        // Режим создания
        const repair = await repairApi.create({
          vehicleId: data.vehicleId,
          reportedAt: data.reportedAt,
          name: data.name,
          mileage: typeof data.mileage === 'number' ? data.mileage : undefined,
          laborTotal: 0,
          partsTotal: 0,
          grandTotal: 0,
          comments: data.comments,
        });

        // Создаем работы
        if (data.tasks && data.tasks.length > 0) {
          await Promise.all(
            data.tasks.map((task) =>
              repairTaskApi.create({
                repairId: repair.id,
                name: task.name,
                price: task.price,
              })
            )
          );
        }

        // Создаем запчасти
        if (data.parts && data.parts.length > 0) {
          await Promise.all(
            data.parts.map((part) =>
              partApi.create({
                repairId: repair.id,
                name: part.name,
                purchasePrice: part.purchasePrice || 0,
                salePrice: part.salePrice || 0,
                quantity: part.quantity || 1,
              })
            )
          );
        }

        return repair;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repairs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      
      if (isEditMode && repairId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.detail(repairId) });
        if (repairData?.vehicleId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(repairData.vehicleId) });
          queryClient.invalidateQueries({ queryKey: queryKeys.repairs.list({ vehicleId: repairData.vehicleId }) });
        }
        navigate(`/repairs/${repairId}`);
      } else if (actualVehicleId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(actualVehicleId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.repairs.list({ vehicleId: actualVehicleId }) });
        navigate(`/vehicles/${actualVehicleId}`);
      }
    },
  });

  const onSubmit = (data: CreateRepairFormData) => {
    createRepairMutation.mutate(data);
  };

  const isLoading = createRepairMutation.isPending;
  const isLoadingRepairData = isEditMode && !repairData;

  if (isLoadingRepairData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <TextField
                  label="Автомобиль"
                  fullWidth
                  disabled
                  value={vehicle 
                    ? `${vehicle.color ? `${vehicle.color} ` : ''}${vehicle.make} ${vehicle.model}`.trim()
                    : 'Загрузка...'}
                />

                <Controller
                  name="reportedAt"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Дата обращения *"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.reportedAt}
                      helperText={errors.reportedAt?.message}
                    />
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Название работы"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Пробег (км)"
                      type="number"
                      fullWidth
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      error={!!errors.mileage}
                      helperText={errors.mileage?.message}
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <TasksList control={control} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <PartsList control={control} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Дополнительная информация
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Комментарии"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.comments}
                    helperText={errors.comments?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          {createRepairMutation.isError && (
            <Alert severity="error">
              Ошибка при создании ремонта. Проверьте правильность заполнения полей.
            </Alert>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => {
                if (isEditMode && repairId) {
                  navigate(`/repairs/${repairId}`);
                } else if (actualVehicleId) {
                  navigate(`/vehicles/${actualVehicleId}`);
                } else {
                  navigate('/');
                }
              }}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? (isEditMode ? 'Сохранение...' : 'Создание...') : (isEditMode ? 'Сохранить' : 'Создать')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

