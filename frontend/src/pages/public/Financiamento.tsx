import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Calculator } from 'lucide-react';
import PageTransition from '@/components/public/PageTransition';
import { api } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatCurrency } from '@/lib/format';
import type { Vehicle } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  phone: z.string().min(8, 'Informe um telefone válido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  vehicle_interest: z.string().optional(),
  vehicle_value: z.string().optional(),
  down_payment: z.string().optional(),
  installments: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Financiamento() {
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicle_id');
  const { settings } = useSettings();
  const [sent, setSent] = useState<{ name: string; phone: string; vehicle: string; value: string; down: string; installments: string } | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!vehicleId) return;
    api.get<Vehicle>(`/admin/vehicles/${vehicleId}`).catch(() => null);
    api.get<{ vehicles: Vehicle[] }>(`/vehicles?limit=50`).then((r) => {
      const found = r.data.vehicles.find((v) => v.id === vehicleId);
      if (found) {
        setVehicle(found);
        setValue('vehicle_interest', `${found.brand} ${found.model} ${found.version} ${found.year_model}`);
        const price = found.promotional_price ?? found.price;
        setValue('vehicle_value', String(price));
      }
    });
  }, [vehicleId, setValue]);

  const onSubmit = async (data: FormData) => {
    const message = [
      data.vehicle_interest ? `Veículo: ${data.vehicle_interest}` : '',
      data.vehicle_value ? `Valor do veículo: ${formatCurrency(parseFloat(data.vehicle_value))}` : '',
      data.down_payment ? `Entrada: ${formatCurrency(parseFloat(data.down_payment))}` : '',
      data.installments ? `Parcelas desejadas: ${data.installments}` : '',
      data.notes ? `Observações: ${data.notes}` : '',
    ].filter(Boolean).join('\n');

    try {
      await api.post('/leads', {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        vehicle_id: vehicleId || null,
        message,
        source: 'financiamento',
      });
      setSent({
        name: data.name,
        phone: data.phone,
        vehicle: data.vehicle_interest || '',
        value: data.vehicle_value || '',
        down: data.down_payment || '',
        installments: data.installments || '',
      });
      reset();
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    }
  };

  const buildWhatsAppLink = () => {
    if (!settings?.whatsapp || !sent) return '#';
    const text = `Olá, simulei um financiamento no site!\nNome: ${sent.name}\nTelefone: ${sent.phone}${sent.vehicle ? `\nVeículo: ${sent.vehicle}` : ''}${sent.value ? `\nValor: ${formatCurrency(parseFloat(sent.value))}` : ''}${sent.down ? `\nEntrada: ${formatCurrency(parseFloat(sent.down))}` : ''}${sent.installments ? `\nParcelas: ${sent.installments}x` : ''}`;
    return buildWhatsAppUrl(settings.whatsapp, text);
  };

  return (
    <PageTransition>
      <section className="border-b border-border py-12">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Calculator size={22} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold md:text-4xl">Simular financiamento</h1>
              <p className="text-white/60">Preencha os dados e te chamamos com a melhor proposta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page max-w-3xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-10 text-center"
            >
              <CheckCircle2 size={56} className="mx-auto text-emerald-400" />
              <h2 className="mt-5 font-display text-2xl font-bold">Simulação enviada com sucesso!</h2>
              <p className="mt-3 text-white/70">
                Recebemos sua solicitação e um consultor entrará em contato em breve.
                Quer agilizar? Envie os dados pelo WhatsApp agora mesmo.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={buildWhatsAppLink()} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5">
                  <MessageCircle size={18} /> Enviar pelo WhatsApp
                </a>
                <button onClick={() => setSent(null)} className="btn-outline px-7 py-3.5">
                  Nova simulação
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-7">
              {vehicle && (
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-accent">Veículo selecionado</div>
                  <div className="mt-1 font-display font-bold">{vehicle.brand} {vehicle.model} {vehicle.version} {vehicle.year_model}</div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Nome*</label>
                  <input className="input" {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Telefone*</label>
                  <input className="input" placeholder="(11) 99999-9999" {...register('phone')} />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">E-mail</label>
                <input className="input" type="email" {...register('email')} />
              </div>

              <div>
                <label className="label">Veículo de interesse</label>
                <input className="input" {...register('vehicle_interest')} placeholder="Marca, modelo, ano" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Valor do veículo</label>
                  <input type="number" className="input" {...register('vehicle_value')} />
                </div>
                <div>
                  <label className="label">Valor de entrada</label>
                  <input type="number" className="input" {...register('down_payment')} />
                </div>
                <div>
                  <label className="label">Parcelas</label>
                  <select className="input" {...register('installments')}>
                    <option value="">—</option>
                    <option value="12">12x</option>
                    <option value="24">24x</option>
                    <option value="36">36x</option>
                    <option value="48">48x</option>
                    <option value="60">60x</option>
                    <option value="72">72x</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Observação</label>
                <textarea rows={3} className="input" {...register('notes')} />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting ? 'Enviando...' : 'Solicitar simulação'}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
