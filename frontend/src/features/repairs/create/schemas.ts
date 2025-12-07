import { z } from 'zod';

const repairTaskSchema = z.object({
  name: z.string().min(1, 'Название работы обязательно'),
  price: z.number().min(0, 'Сумма должна быть неотрицательной'),
});

const partSchema = z.object({
  name: z.string().min(1, 'Название запчасти обязательно'),
  purchasePrice: z.number().min(0, 'Цена должна быть неотрицательной').optional(),
  salePrice: z.number().min(0, 'Цена должна быть неотрицательной').optional(),
  quantity: z.number().min(0.01, 'Количество должно быть больше 0').optional(),
});

export const createRepairSchema = z.object({
  vehicleId: z.string().uuid('ID автомобиля обязателен'),
  reportedAt: z.string().min(1, 'Дата обязательна'),
  name: z.string().optional(),
  mileage: z.number().min(0).optional().or(z.literal('')),
  tasks: z.array(repairTaskSchema).optional(),
  parts: z.array(partSchema).optional(),
  comments: z.string().optional(),
});

export type CreateRepairFormData = z.infer<typeof createRepairSchema>;
export type RepairTaskFormData = z.infer<typeof repairTaskSchema>;
export type PartFormData = z.infer<typeof partSchema>;

