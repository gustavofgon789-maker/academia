import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().min(8, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').nullable().optional(),
  vehicle_id: z.string().uuid().nullable().optional(),
  message: z.string().optional(),
  source: z.string().default('website'),
});

export const leadStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'converted', 'lost']),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
