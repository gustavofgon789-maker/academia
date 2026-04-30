import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageTransition from '@/components/public/PageTransition';
import Hero from '@/components/public/Hero';
import Benefits from '@/components/public/Benefits';
import Brands from '@/components/public/Brands';
import Testimonials from '@/components/public/Testimonials';
import CTA from '@/components/public/CTA';
import VehicleCard from '@/components/public/VehicleCard';
import { api } from '@/lib/api';
import type { Vehicle } from '@/types';

export default function Home() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Vehicle[]>('/vehicles/featured'),
      api.get<string[]>('/vehicles/brands'),
    ])
      .then(([f, b]) => {
        setFeatured(f.data);
        setBrands(b.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <Hero />

      <section className="border-b border-white/8 bg-[#050505] py-20 md:py-24">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#ef2b2d]">Destaques</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
                Carros em destaque
              </h2>
              <p className="mt-3 max-w-xl text-white/60">
                Selecionamos as melhores ofertas para você dar uma olhada.
              </p>
            </div>
            <Link to="/estoque" className="btn-outline">
              Ver todos <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton aspect-[4/3] w-full" />
                    <div className="space-y-2 p-4">
                      <div className="skeleton h-3 w-1/3 rounded" />
                      <div className="skeleton h-4 w-2/3 rounded" />
                      <div className="skeleton h-6 w-1/2 rounded" />
                    </div>
                  </div>
                ))
              : featured.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
          </div>

          {!loading && featured.length === 0 && (
            <div className="mt-10 rounded-[28px] border border-dashed border-white/10 p-10 text-center text-white/50">
              Em breve novos veículos em destaque.
            </div>
          )}
        </div>
      </section>

      <Benefits />
      <Brands brands={brands} />
      <Testimonials />
      <CTA />
    </PageTransition>
  );
}
