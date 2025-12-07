import { z } from 'zod';

const newClientSchema = z.object({
  fullName: z.string().min(1, 'Имя обязательно'),
  phone: z.string().optional(),
  email: z.string().email('Неверный email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const createVehicleSchema = z
  .object({
    // Клиент
    clientId: z.string().uuid().optional().or(z.literal('')),
    newClient: newClientSchema.optional(),
    // Автомобиль
    make: z.string().min(1, 'Марка обязательна'),
    model: z.string().min(1, 'Модель обязательна'),
    year: z
      .union([z.number().min(1900).max(new Date().getFullYear() + 1), z.literal('')])
      .optional(),
    plateNumber: z.string().optional(),
    vin: z.string().optional(),
    engine: z.string().optional(),
    transmission: z.string().optional(),
    color: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Если выбран существующий клиент
      if (data.clientId) {
        return true;
      }
      // Если создается новый клиент, проверяем что заполнено имя
      if (data.newClient) {
        return data.newClient.fullName && data.newClient.fullName.trim().length > 0;
      }
      return false;
    },
    {
      message: 'Выберите клиента или создайте нового',
      path: ['clientId'],
    }
  )
  .refine(
    (data) => {
      // Если создается новый клиент, валидируем его поля
      if (data.newClient && !data.clientId) {
        return newClientSchema.safeParse(data.newClient).success;
      }
      return true;
    },
    {
      message: 'Заполните все обязательные поля клиента',
      path: ['newClient'],
    }
  );

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;

