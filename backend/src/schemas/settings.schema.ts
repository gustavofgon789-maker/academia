import { z } from 'zod';

export const updateSettingsSchema = z.object({
  business_name: z.string().min(1).optional(),
  logo_url: z.string().nullable().optional(),
  whatsapp: z.string().min(8).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  opening_hours: z.string().optional(),
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  hero_image_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional(),
  primary_color: z.string().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
