import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ITEMS = [
  {
    name: 'Ricardo M.',
    role: 'Cliente desde 2022',
    text: 'Atendimento impecável do início ao fim. Encontrei o carro que queria por um preço justo e ainda saí com financiamento aprovado no mesmo dia.',
  },
  {
    name: 'Fernanda L.',
    role: 'Cliente desde 2023',
    text: 'Muito profissionalismo. O carro que comprei estava exatamente como descrito no anúncio, sem surpresas. Recomendo demais.',
  },
  {
    name: 'Carlos A.',
    role: 'Cliente desde 2021',
    text: 'Já é minha terceira compra aqui. Eles cuidam de cada detalhe e oferecem condições que dificilmente encontro em outro lugar.',
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Depoimentos</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Quem comprou recomenda</h2>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">"{item.text}"</p>
              <div className="mt-5 border-t border-border pt-4">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-white/50">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
