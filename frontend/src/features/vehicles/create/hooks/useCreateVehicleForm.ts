import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSafeQuery } from '@/shared/lib/hooks';
import { queryKeys } from '@/shared/lib/react-query';
import { vehicleApi } from '@/entities/vehicle';
import { clientApi } from '@/entities/client';
import { createVehicleSchema, type CreateVehicleFormData } from '../schemas';
import { CLIENT_MODE, type ClientMode } from '../constants';

export const useCreateVehicleForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [clientMode, setClientMode] = useState<ClientMode>(CLIENT_MODE.EXISTING);

  // Загружаем данные автомобиля для редактирования
  const { data: vehicleData } = useSafeQuery({
    queryKey: queryKeys.vehicles.detail(id!),
    queryFn: () => vehicleApi.getById(id!),
    enabled: isEditMode && !!id,
  });

  // Загружаем список клиентов для выбора
  const { data: clientsData } = useSafeQuery({
    queryKey: queryKeys.clients.list({ limit: 100 }),
    queryFn: () => clientApi.getAll({ limit: 100 }),
    enabled: clientMode === CLIENT_MODE.EXISTING || isEditMode,
  });

  const form = useForm<CreateVehicleFormData>({
    resolver: zodResolver(createVehicleSchema),
    mode: 'onBlur',
  });

  const { control, handleSubmit, formState: { errors }, resetField, reset } = form;

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (isEditMode && vehicleData) {
      reset({
        clientId: vehicleData.clientId,
        newClient: undefined,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        plateNumber: vehicleData.plateNumber || '',
        vin: vehicleData.vin || '',
        engine: vehicleData.engine || '',
        transmission: vehicleData.transmission || '',
        color: vehicleData.color || '',
        notes: vehicleData.notes || '',
      });
      setClientMode(CLIENT_MODE.EXISTING);
    }
  }, [isEditMode, vehicleData, reset]);

  const createClientMutation = useMutation({
    mutationFn: (data: CreateVehicleFormData['newClient']) => {
      if (!data) throw new Error('Данные клиента не указаны');
      return clientApi.create({
        ...data,
        email: data.email || undefined,
      });
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (data: CreateVehicleFormData) => {
      let clientId = data.clientId;

      // Если создаем нового клиента (только при создании, не при редактировании)
      if (!isEditMode && !clientId && data.newClient) {
        try {
          const newClient = await createClientMutation.mutateAsync(data.newClient);
          clientId = newClient.id;
        } catch (error) {
          console.error('Ошибка при создании клиента:', error);
          throw error;
        }
      }

      if (!clientId) {
        throw new Error('ID клиента не указан');
      }

      try {
        if (isEditMode && id) {
          // Редактирование
          const vehicle = await vehicleApi.update(id, {
            clientId,
            make: data.make,
            model: data.model,
            year: typeof data.year === 'number' ? data.year : undefined,
            plateNumber: data.plateNumber || undefined,
            vin: data.vin || undefined,
            engine: data.engine || undefined,
            transmission: data.transmission || undefined,
            color: data.color || undefined,
            notes: data.notes || undefined,
          });
          return vehicle;
        } else {
          // Создание
          const vehicle = await vehicleApi.create({
            clientId,
            make: data.make,
            model: data.model,
            year: typeof data.year === 'number' ? data.year : undefined,
            plateNumber: data.plateNumber || undefined,
            vin: data.vin || undefined,
            engine: data.engine || undefined,
            transmission: data.transmission || undefined,
            color: data.color || undefined,
            notes: data.notes || undefined,
          });
          return vehicle;
        }
      } catch (error) {
        console.error(
          `Ошибка при ${isEditMode ? 'обновлении' : 'создании'} автомобиля:`,
          error
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(id!) });
        navigate(`/vehicles/${id}`);
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      console.error(
        `Ошибка мутации ${isEditMode ? 'обновления' : 'создания'} автомобиля:`,
        error
      );
    },
  });

  const onSubmit = (data: CreateVehicleFormData) => {
    createVehicleMutation.mutate(data);
  };

  const isLoading = createClientMutation.isPending || createVehicleMutation.isPending;

  return {
    form,
    control,
    handleSubmit,
    errors,
    resetField,
    clientMode,
    setClientMode,
    isEditMode,
    vehicleData,
    clientsData,
    createClientMutation,
    createVehicleMutation,
    onSubmit,
    isLoading,
  };
};

