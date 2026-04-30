import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FALLBACK = ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Renault', 'Jeep', 'Nissan'];

export default function Brands({ brands }: { brands: string[] }) {
  const list = brands.length ? brands : FALLBACK;

  return (
    <section className="border-b border-border bg-bg-900 py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Marcas</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Trabalhamos com as melhores</h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {list.slice(0, 10).map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/estoque?brand=${encodeURIComponent(brand)}`}
                className="flex h-20 items-center justify-center rounded-xl border border-border bg-bg-800 px-4 font-display font-bold text-white/70 transition-all hover:border-accent/40 hover:bg-bg-700 hover:text-white"
              >
                {brand}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
