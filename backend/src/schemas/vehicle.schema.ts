import { z } from 'zod';

export const createVehicleSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  version: z.string().min(1, 'Versão é obrigatória'),
  year_fabrication: z.number().int().min(1900).max(2030),
  year_model: z.number().int().min(1900).max(2030),
  price: z.number().positive('Preço deve ser positivo'),
  promotional_price: z.number().positive().nullable().optional(),
  mileage: z.number().int().min(0),
  transmission: z.string().min(1),
  fuel: z.string().min(1),
  color: z.string().min(1),
  body_type: z.string().min(1),
  doors: z.number().int().min(1).max(6).default(4),
  plate_final: z.string().max(1),
  status: z.enum(['available', 'sold', 'reserved']).default('available'),
  is_featured: z.boolean().default(false),
  is_promotion: z.boolean().default(false),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
  options: z.any().optional(),
  internal_notes: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleStatusSchema = z.object({
  status: z.enum(['available', 'sold', 'reserved']),
});

export const vehiclePriceSchema = z.object({
  price: z.number().positive(),
  promotional_price: z.number().positive().nullable().optional(),
});

export const vehicleFeaturedSchema = z.object({
  is_featured: z.boolean(),
});

export const vehiclePromotionSchema = z.object({
  is_promotion: z.boolean(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
