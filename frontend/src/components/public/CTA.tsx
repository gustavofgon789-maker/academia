import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl, defaultMessage } from '@/lib/whatsapp';

export default function CTA() {
  const { settings } = useSettings();
  const business = settings?.business_name || 'Gel Veículos';
  const wa = settings?.whatsapp ? buildWhatsAppUrl(settings.whatsapp, defaultMessage(business)) : '#';

  return (
    <section className="relative overflow-hidden border-b border-border py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.18),transparent_60%)]" />
      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl border border-accent/20 bg-gradient-to-br from-bg-800 to-bg-900 p-10 text-center shadow-glow md:p-14"
        >
          <h2 className="font-display text-3xl font-extrabold md:text-5xl">
            Pronto para encontrar seu carro?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Fale agora com um consultor pelo WhatsApp ou explore todo nosso estoque em poucos cliques.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={wa} target="_blank" rel="noreferrer" className="btn-primary px-7 py-4 text-base">
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
            <Link to="/estoque" className="btn-outline px-7 py-4 text-base">
              Ver estoque <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
