import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export interface VehicleFilterState {
  search?: string;
  brand?: string;
  model?: string;
  year_min?: string;
  year_max?: string;
  price_min?: string;
  price_max?: string;
  mileage_max?: string;
  transmission?: string;
  fuel?: string;
  status?: string;
  body_type?: string;
  sort?: string;
}

const SORTS = [
  { value: '', label: 'Mais novos' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'year_desc', label: 'Ano mais recente' },
  { value: 'mileage_asc', label: 'Menor quilometragem' },
  { value: 'featured', label: 'Destaques primeiro' },
];

const BODY = ['Sedan', 'Hatch', 'SUV', 'Picape', 'Utilitário', 'Cupê'];
const FUEL = ['Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico'];
const TRANS = ['Manual', 'Automático', 'CVT', 'Automatizado'];
const STATUS = [
  { value: 'available', label: 'Disponível' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
];

export default function VehicleFilters({
  value,
  brands,
  onChange,
}: {
  value: VehicleFilterState;
  brands: string[];
  onChange: (next: VehicleFilterState) => void;
}) {
  const [local, setLocal] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => setLocal(value), [value]);

  const update = (patch: Partial<VehicleFilterState>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  const reset = () => {
    setLocal({});
    onChange({});
  };

  const activeCount = Object.values(value).filter((v) => v && v !== '').length;

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={local.search || ''}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Buscar por marca, modelo ou versão..."
            className="input pl-10"
          />
        </div>
        <select className="input lg:max-w-[220px]" value={local.sort || ''} onChange={(e) => update({ sort: e.target.value })}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button onClick={() => setOpen(true)} className="btn-outline whitespace-nowrap">
          <SlidersHorizontal size={16} /> Filtros {activeCount > 0 && <span className="rounded-full bg-accent px-1.5 text-[10px]">{activeCount}</span>}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-bg-900 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Filtros</h3>
                <button onClick={() => setOpen(false)} className="rounded-lg border border-border p-2">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="label">Marca</label>
                  <select className="input" value={local.brand || ''} onChange={(e) => update({ brand: e.target.value })}>
                    <option value="">Todas</option>
                    {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Modelo</label>
                  <input className="input" value={local.model || ''} onChange={(e) => update({ model: e.target.value })} placeholder="Ex: Civic" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Ano de</label>
                    <input type="number" className="input" value={local.year_min || ''} onChange={(e) => update({ year_min: e.target.value })} placeholder="2018" />
                  </div>
                  <div>
                    <label className="label">Ano até</label>
                    <input type="number" className="input" value={local.year_max || ''} onChange={(e) => update({ year_max: e.target.value })} placeholder="2025" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Preço de</label>
                    <input type="number" className="input" value={local.price_min || ''} onChange={(e) => update({ price_min: e.target.value })} placeholder="R$ 50.000" />
                  </div>
                  <div>
                    <label className="label">Preço até</label>
                    <input type="number" className="input" value={local.price_max || ''} onChange={(e) => update({ price_max: e.target.value })} placeholder="R$ 200.000" />
                  </div>
                </div>

                <div>
                  <label className="label">Quilometragem máxima</label>
                  <input type="number" className="input" value={local.mileage_max || ''} onChange={(e) => update({ mileage_max: e.target.value })} placeholder="80.000" />
                </div>

                <div>
                  <label className="label">Câmbio</label>
                  <select className="input" value={local.transmission || ''} onChange={(e) => update({ transmission: e.target.value })}>
                    <option value="">Qualquer</option>
                    {TRANS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Combustível</label>
                  <select className="input" value={local.fuel || ''} onChange={(e) => update({ fuel: e.target.value })}>
                    <option value="">Qualquer</option>
                    {FUEL.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Carroceria</label>
                  <select className="input" value={local.body_type || ''} onChange={(e) => update({ body_type: e.target.value })}>
                    <option value="">Qualquer</option>
                    {BODY.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select className="input" value={local.status || ''} onChange={(e) => update({ status: e.target.value })}>
                    <option value="">Todos</option>
                    {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={reset} className="btn-outline flex-1">Limpar</button>
                <button onClick={() => setOpen(false)} className="btn-primary flex-1">Aplicar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
