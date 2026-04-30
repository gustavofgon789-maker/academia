import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import PageTransition from '@/components/public/PageTransition';
import { useSettings } from '@/context/SettingsContext';
import { api } from '@/lib/api';
import { buildWhatsAppUrl, defaultMessage } from '@/lib/whatsapp';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  phone: z.string().min(8, 'Informe um telefone válido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  message: z.string().min(5, 'Conte um pouco como podemos ajudar'),
});

type FormData = z.infer<typeof schema>;

export default function Contato() {
  const { settings } = useSettings();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/leads', {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
        source: 'contato',
      });
      setSent(true);
      reset();
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    }
  };

  const business = settings?.business_name || 'Gel Veículos';
  const wa = settings?.whatsapp ? buildWhatsAppUrl(settings.whatsapp, defaultMessage(business)) : '#';
  const mapsUrl = settings?.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`
    : null;

  return (
    <PageTransition>
      <section className="border-b border-border py-12">
        <div className="container-page">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">Fale com a gente</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Estamos prontos para te atender pelo WhatsApp, telefone ou pessoalmente em nossa loja.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <div className="space-y-4">
            <a href={wa} target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-5 hover:border-accent/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-400">
                <MessageCircle size={22} />
              </div>
              <div>
                <div className="font-bold">WhatsApp</div>
                <div className="text-sm text-white/60">{settings?.whatsapp ? 'Resposta rápida no WhatsApp' : '—'}</div>
              </div>
            </a>

            {settings?.phone && (
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="card flex items-center gap-4 p-5 hover:border-accent/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="font-bold">Telefone</div>
                  <div className="text-sm text-white/60">{settings.phone}</div>
                </div>
              </a>
            )}

            {settings?.address && (
              <div className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="font-bold">Endereço</div>
                    <div className="text-sm text-white/60">{settings.address}</div>
                  </div>
                </div>
                {mapsUrl && (
                  <div className="mt-5 aspect-video overflow-hidden rounded-xl border border-border">
                    <iframe src={mapsUrl} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                )}
              </div>
            )}

            {settings?.opening_hours && (
              <div className="card flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="font-bold">Horário de atendimento</div>
                  <div className="whitespace-pre-line text-sm text-white/60">{settings.opening_hours}</div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-7">
            <h2 className="font-display text-xl font-bold">Envie uma mensagem</h2>
            <p className="mt-1 text-sm text-white/60">Responderemos no menor tempo possível.</p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 flex flex-col items-center rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-8 text-center"
              >
                <CheckCircle2 size={48} className="text-emerald-400" />
                <div className="mt-4 font-display text-xl font-bold">Mensagem enviada!</div>
                <p className="mt-2 text-sm text-white/70">
                  Recebemos sua mensagem e entraremos em contato em breve.
                </p>
                <button onClick={() => setSent(false)} className="btn-outline mt-5">
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="label">Nome*</label>
                  <input className="input" {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Telefone*</label>
                    <input className="input" placeholder="(11) 99999-9999" {...register('phone')} />
                    {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label">E-mail</label>
                    <input className="input" type="email" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Mensagem*</label>
                  <textarea rows={5} className="input" {...register('message')} />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                  {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
