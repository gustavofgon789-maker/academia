import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Gauge, Fuel, Settings2, Palette, Car, DoorOpen, Hash,
  MessageCircle, Calculator, ChevronLeft, ChevronRight, Check,
} from 'lucide-react';
import PageTransition from '@/components/public/PageTransition';
import VehicleCard from '@/components/public/VehicleCard';
import { api, imageUrl } from '@/lib/api';
import { formatCurrency, formatMileage, formatYears } from '@/lib/format';
import { buildWhatsAppUrl, vehicleInterestMessage } from '@/lib/whatsapp';
import { useSettings } from '@/context/SettingsContext';
import type { Vehicle } from '@/types';

export default function VeiculoDetalhes() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [related, setRelated] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get<{ vehicle: Vehicle; related: Vehicle[] }>(`/vehicles/${slug}`)
      .then((r) => {
        setVehicle(r.data.vehicle);
        setRelated(r.data.related);
        setActiveImg(0);
      })
      .catch(() => navigate('/estoque'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !vehicle) {
    return (
      <PageTransition>
        <div className="container-page py-20">
          <div className="skeleton aspect-[16/9] rounded-2xl" />
        </div>
      </PageTransition>
    );
  }

  const finalPrice = vehicle.promotional_price ?? vehicle.price;
  const hasPromo = vehicle.is_promotion && vehicle.promotional_price;
  const wa = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, vehicleInterestMessage(vehicle))
    : '#';

  const images = vehicle.images.length > 0 ? vehicle.images : [];
  const mainImage = images[activeImg];

  const specs = [
    { icon: Calendar, label: 'Ano', value: formatYears(vehicle.year_fabrication, vehicle.year_model) },
    { icon: Gauge, label: 'KM', value: formatMileage(vehicle.mileage) },
    { icon: Settings2, label: 'Câmbio', value: vehicle.transmission },
    { icon: Fuel, label: 'Combustível', value: vehicle.fuel },
    { icon: Palette, label: 'Cor', value: vehicle.color },
    { icon: Car, label: 'Carroceria', value: vehicle.body_type },
    { icon: DoorOpen, label: 'Portas', value: String(vehicle.doors) },
    { icon: Hash, label: 'Final placa', value: vehicle.plate_final || '—' },
  ];

  return (
    <PageTransition>
      <section className="border-b border-border py-10">
        <div className="container-page">
          <div className="text-xs text-white/50">
            <Link to="/" className="hover:text-white">Início</Link> /{' '}
            <Link to="/estoque" className="hover:text-white">Estoque</Link> /{' '}
            <span className="text-white/80">{vehicle.title}</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-800">
                <AnimatePresence mode="wait">
                  {mainImage ? (
                    <motion.img
                      key={mainImage.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={imageUrl(mainImage.image_url)}
                      alt={vehicle.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/30">Sem foto</div>
                  )}
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-black/80"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-black/80"
                    >
                      <ChevronRight size={22} />
                    </button>
                    <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
                      {activeImg + 1} / {images.length}
                    </div>
                  </>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {vehicle.status === 'sold' && <span className="badge bg-red-700 text-white">Vendido</span>}
                  {vehicle.status === 'reserved' && <span className="badge bg-amber-600 text-white">Reservado</span>}
                  {vehicle.is_featured && <span className="badge bg-accent text-white">⭐ Destaque</span>}
                  {hasPromo && <span className="badge bg-emerald-600 text-white">Promoção</span>}
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-[4/3] w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        i === activeImg ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imageUrl(img.image_url)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">{vehicle.brand}</div>
              <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">
                {vehicle.model} <span className="font-normal text-white/60">{vehicle.version}</span>
              </h1>
              <div className="mt-1 text-sm text-white/50">{vehicle.title}</div>

              <div className="mt-6 rounded-2xl border border-border bg-bg-800 p-6">
                {hasPromo && (
                  <div className="text-sm text-white/40 line-through">{formatCurrency(vehicle.price)}</div>
                )}
                <div className={`font-display text-4xl font-black ${hasPromo ? 'text-emerald-400' : 'text-white'}`}>
                  {formatCurrency(finalPrice)}
                </div>
                {vehicle.status === 'available' ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <a href={wa} target="_blank" rel="noreferrer" className="btn-primary py-3.5">
                      <MessageCircle size={18} /> Tenho interesse no WhatsApp
                    </a>
                    <Link to={`/financiamento?vehicle_id=${vehicle.id}`} className="btn-outline py-3.5">
                      <Calculator size={18} /> Simular financiamento
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-amber-600/40 bg-amber-500/10 p-3 text-center text-sm text-amber-300">
                    {vehicle.status === 'sold' ? 'Veículo vendido. ' : 'Veículo reservado. '}
                    Veja outras opções em nosso <Link to="/estoque" className="underline">estoque</Link>.
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card p-3">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Icon size={14} className="text-accent" /> {label}
                    </div>
                    <div className="mt-1 font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(vehicle.description || (vehicle.options && vehicle.options.length > 0)) && (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {vehicle.description && (
                <div className="card p-6">
                  <h2 className="font-display text-xl font-bold">Descrição</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">
                    {vehicle.description}
                  </p>
                </div>
              )}
              {vehicle.options && vehicle.options.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-display text-xl font-bold">Opcionais</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {vehicle.options.map((opt) => (
                      <li key={opt} className="flex items-center gap-2 text-sm text-white/70">
                        <Check size={16} className="text-accent" /> {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 card p-6">
            <h2 className="font-display text-xl font-bold">Informações de procedência</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Veículo revisado em nossa estrutura, com vistoria documental completa e laudo cautelar disponível para consulta.
              Para detalhes específicos do histórico, entre em contato com nossos consultores.
            </p>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold">Você também pode gostar</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r, i) => <VehicleCard key={r.id} vehicle={r} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
