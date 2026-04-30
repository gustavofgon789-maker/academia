import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, Sparkles } from 'lucide-react';
import PageTransition from '@/components/public/PageTransition';
import CTA from '@/components/public/CTA';
import { useSettings } from '@/context/SettingsContext';

const PILLARS = [
  { icon: Target, title: 'Missão', text: 'Oferecer veículos seminovos com procedência, qualidade e atendimento que faça você se sentir em casa.' },
  { icon: Eye, title: 'Visão', text: 'Ser referência regional em concessionária de seminovos, reconhecida pela transparência e excelência.' },
  { icon: Heart, title: 'Valores', text: 'Confiança, transparência, comprometimento com o cliente e paixão pelo que fazemos todos os dias.' },
];

const DIFFS = [
  { icon: Award, title: 'Curadoria de estoque', text: 'Apenas carros que aprovaríamos para nossas próprias famílias entram no nosso estoque.' },
  { icon: Sparkles, title: 'Padrão de loja premium', text: 'Estrutura, apresentação e processo de venda no padrão das melhores lojas do Brasil.' },
  { icon: Users, title: 'Equipe especialista', text: 'Consultores com anos de experiência prontos para te orientar do test drive ao financiamento.' },
];

export default function Sobre() {
  const { settings } = useSettings();
  const business = settings?.business_name || 'Gel Veículos';

  return (
    <PageTransition>
      <section className="relative border-b border-border py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.18),transparent_60%)]" />
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Sobre nós</span>
            <h1 className="mt-3 font-display text-4xl font-black md:text-5xl">A história da {business}</h1>
            <p className="mt-5 text-white/70">
              Há mais de uma década no mercado, construímos uma trajetória pautada na confiança e
              no compromisso com cada cliente que entra na nossa loja. Acreditamos que comprar um
              carro deve ser uma experiência transparente, especial e tranquila.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="container-page">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg-900 py-20">
        <div className="container-page">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Diferenciais</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">O que nos torna únicos</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {DIFFS.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:border-accent/30"
              >
                <Icon size={28} className="text-accent" />
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </PageTransition>
  );
}
