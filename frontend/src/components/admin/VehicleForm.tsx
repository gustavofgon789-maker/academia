import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import type { Vehicle } from '@/types';

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  brand: z.string().min(1, 'Obrigatório'),
  model: z.string().min(1, 'Obrigatório'),
  version: z.string().min(1, 'Obrigatório'),
  year_fabrication: z.coerce.number().int().min(1900).max(2030),
  year_model: z.coerce.number().int().min(1900).max(2030),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  promotional_price: z.preprocess(
    (v) => (v === '' || v === null ? null : Number(v)),
    z.number().positive().nullable().optional(),
  ),
  mileage: z.coerce.number().int().min(0),
  transmission: z.string().min(1),
  fuel: z.string().min(1),
  color: z.string().min(1),
  body_type: z.string().min(1),
  doors: z.coerce.number().int().min(1).max(6),
  plate_final: z.string().max(1).default(''),
  status: z.enum(['available', 'sold', 'reserved']),
  is_featured: z.boolean(),
  is_promotion: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional().or(z.literal('')),
  options: z.string().optional().or(z.literal('')),
  internal_notes: z.string().optional().or(z.literal('')),
});

export type VehicleFormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Vehicle>;
  submitLabel: string;
  onSubmit: (data: any) => Promise<void>;
}

export default function VehicleForm({ initial, submitLabel, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const optionsString = Array.isArray(initial?.options) ? initial.options.join(', ') : '';

  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || '',
      brand: initial?.brand || '',
      model: initial?.model || '',
      version: initial?.version || '',
      year_fabrication: initial?.year_fabrication || new Date().getFullYear(),
      year_model: initial?.year_model || new Date().getFullYear(),
      price: initial?.price ? Number(initial.price) : 0,
      promotional_price: initial?.promotional_price ? Number(initial.promotional_price) : null,
      mileage: initial?.mileage || 0,
      transmission: initial?.transmission || 'Manual',
      fuel: initial?.fuel || 'Flex',
      color: initial?.color || '',
      body_type: initial?.body_type || 'Sedan',
      doors: initial?.doors || 4,
      plate_final: initial?.plate_final || '',
      status: (initial?.status as any) || 'available',
      is_featured: initial?.is_featured ?? false,
      is_promotion: initial?.is_promotion ?? false,
      is_active: initial?.is_active ?? true,
      description: initial?.description || '',
      options: optionsString,
      internal_notes: initial?.internal_notes || '',
    },
  });

  const submit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        promotional_price: data.promotional_price || null,
        description: data.description || null,
        internal_notes: data.internal_notes || null,
        options: data.options
          ? data.options.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await onSubmit(payload);
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Erro ao salvar';
      const details = e?.response?.data?.details;
      alert(`${msg}${details ? '\n' + JSON.stringify(details, null, 2) : ''}`);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Identificação">
        <div className="grid gap-4 lg:col-span-3">
          <Field label="Título do anúncio*" error={errors.title?.message}>
            <input className="input" {...register('title')} placeholder="Ex: Honda Civic Sport 2.0 Aut. 2022" />
          </Field>
        </div>
        <Field label="Marca*" error={errors.brand?.message}>
          <input className="input" {...register('brand')} />
        </Field>
        <Field label="Modelo*" error={errors.model?.message}>
          <input className="input" {...register('model')} />
        </Field>
        <Field label="Versão*" error={errors.version?.message}>
          <input className="input" {...register('version')} />
        </Field>
      </Section>

      <Section title="Anos & Preço">
        <Field label="Ano fabricação*" error={errors.year_fabrication?.message}>
          <input type="number" className="input" {...register('year_fabrication')} />
        </Field>
        <Field label="Ano modelo*" error={errors.year_model?.message}>
          <input type="number" className="input" {...register('year_model')} />
        </Field>
        <Field label="Quilometragem*" error={errors.mileage?.message}>
          <input type="number" className="input" {...register('mileage')} />
        </Field>
        <Field label="Preço (R$)*" error={errors.price?.message}>
          <input type="number" step="0.01" className="input" {...register('price')} />
        </Field>
        <Field label="Preço promocional (R$)" error={errors.promotional_price?.message as string}>
          <input type="number" step="0.01" className="input" {...register('promotional_price')} />
        </Field>
      </Section>

      <Section title="Especificações">
        <Field label="Câmbio*" error={errors.transmission?.message}>
          <select className="input" {...register('transmission')}>
            {['Manual', 'Automático', 'CVT', 'Automatizado'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Combustível*" error={errors.fuel?.message}>
          <select className="input" {...register('fuel')}>
            {['Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Cor*" error={errors.color?.message}>
          <input className="input" {...register('color')} />
        </Field>
        <Field label="Carroceria*" error={errors.body_type?.message}>
          <select className="input" {...register('body_type')}>
            {['Sedan', 'Hatch', 'SUV', 'Picape', 'Utilitário', 'Cupê'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Portas*" error={errors.doors?.message}>
          <input type="number" min={1} max={6} className="input" {...register('doors')} />
        </Field>
        <Field label="Final da placa">
          <input maxLength={1} className="input" {...register('plate_final')} placeholder="0" />
        </Field>
      </Section>

      <Section title="Status & Destaques">
        <Field label="Status*">
          <select className="input" {...register('status')}>
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </select>
        </Field>
        <CheckRow label="Destaque na home" register={register('is_featured')} />
        <CheckRow label="Em promoção" register={register('is_promotion')} />
        <CheckRow label="Anúncio ativo" register={register('is_active')} />
      </Section>

      <Section title="Conteúdo">
        <div className="lg:col-span-3">
          <Field label="Descrição">
            <textarea rows={5} className="input" {...register('description')} placeholder="Detalhes do veículo, conservação, histórico..." />
          </Field>
        </div>
        <div className="lg:col-span-3">
          <Field label="Opcionais (separe por vírgula)">
            <input className="input" {...register('options')} placeholder="Ar condicionado, Direção elétrica, Multimídia, ..." />
          </Field>
        </div>
        <div className="lg:col-span-3">
          <Field label="Observações internas (não aparece no site)">
            <textarea rows={3} className="input" {...register('internal_notes')} />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end gap-2 border-t border-border pt-6">
        <button type="submit" disabled={submitting} className="btn-primary px-7">
          <Save size={18} /> {submitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function CheckRow({ label, register }: { label: string; register: any }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-bg-700 p-3 hover:border-accent/40">
      <input type="checkbox" className="h-4 w-4 accent-red-600" {...register} />
      <span className="text-sm font-semibold">{label}</span>
    </label>
  );
}
