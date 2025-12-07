import { z } from 'zod';

export const createClientSchema = z.object({
  fullName: z.string().min(1, 'Имя обязательно'),
  phone: z.string().optional(),
  email: z.string().email('Неверный email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;

