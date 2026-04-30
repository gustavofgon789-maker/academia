import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Calendar, Settings2, Fuel } from 'lucide-react';
import clsx from 'clsx';
import type { Vehicle } from '@/types';
import { formatCurrency, formatMileage, formatYears } from '@/lib/format';
import { imageUrl } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl, vehicleInterestMessage } from '@/lib/whatsapp';

export default function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const { settings } = useSettings();
  const main = vehicle.images?.find((i) => i.is_main) || vehicle.images?.[0];
  const finalPrice = vehicle.promotional_price ?? vehicle.price;
  const hasPromo = vehicle.is_promotion && vehicle.promotional_price;

  const wa = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, vehicleInterestMessage(vehicle))
    : '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden hover:border-accent/40 hover:shadow-glow"
    >
      <Link to={`/veiculo/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-bg-700">
        {main ? (
          <img
            src={imageUrl(main.image_url)}
            alt={vehicle.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">Sem foto</div>
        )}

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {vehicle.status === 'sold' && <span className="badge bg-red-700/90 text-white">Vendido</span>}
          {vehicle.status === 'reserved' && <span className="badge bg-amber-600/90 text-white">Reservado</span>}
          {vehicle.is_featured && vehicle.status === 'available' && (
            <span className="badge bg-accent/90 text-white">⭐ Destaque</span>
          )}
          {hasPromo && <span className="badge bg-emerald-600/90 text-white">Promoção</span>}
        </div>
      </Link>

      <div className="p-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-accent">{vehicle.brand}</div>
        <Link to={`/veiculo/${vehicle.slug}`}>
          <h3 className="mt-0.5 line-clamp-1 font-display text-base font-bold text-white hover:text-accent">
            {vehicle.model} <span className="font-normal text-white/60">{vehicle.version}</span>
          </h3>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/60">
          <div className="flex items-center gap-1.5"><Calendar size={13} /> {formatYears(vehicle.year_fabrication, vehicle.year_model)}</div>
          <div className="flex items-center gap-1.5"><Gauge size={13} /> {formatMileage(vehicle.mileage)}</div>
          <div className="flex items-center gap-1.5"><Settings2 size={13} /> {vehicle.transmission}</div>
          <div className="flex items-center gap-1.5"><Fuel size={13} /> {vehicle.fuel}</div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            {hasPromo && (
              <div className="text-xs text-white/40 line-through">{formatCurrency(vehicle.price)}</div>
            )}
            <div className={clsx('font-display text-xl font-extrabold', hasPromo ? 'text-emerald-400' : 'text-white')}>
              {formatCurrency(finalPrice)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to={`/veiculo/${vehicle.slug}`} className="btn-outline flex-1 py-2 text-xs">
            Ver detalhes
          </Link>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-primary flex-1 py-2 text-xs">
            Tenho interesse
          </a>
        </div>
      </div>
    </motion.div>
  );
}
