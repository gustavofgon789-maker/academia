import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, CreditCard, HeartHandshake } from 'lucide-react';

const ITEMS = [
  {
    icon: Wrench,
    title: 'Veículos revisados',
    desc: 'Cada carro passa por inspeção técnica completa antes de entrar no estoque.',
  },
  {
    icon: ShieldCheck,
    title: 'Procedência garantida',
    desc: 'Histórico, documentação e laudo de vistoria conferidos para sua segurança.',
  },
  {
    icon: CreditCard,
    title: 'Facilidade no financiamento',
    desc: 'Parceria com os principais bancos. Aprovação rápida e parcelas que cabem no bolso.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento personalizado',
    desc: 'Te ajudamos a escolher o carro certo. Sem pressão, com transparência.',
  },
];

export default function Benefits() {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Por que comprar conosco</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">A experiência que você merece</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Mais de uma década entregando carros revisados e com procedência para clientes exigentes.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card p-6 hover:border-accent/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
