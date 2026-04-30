import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '@/components/public/PageTransition';
import VehicleCard from '@/components/public/VehicleCard';
import VehicleFilters, { type VehicleFilterState } from '@/components/public/VehicleFilters';
import { api } from '@/lib/api';
import type { VehicleListResponse } from '@/types';

export default function Estoque() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<VehicleListResponse | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: VehicleFilterState = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    api.get<string[]>('/vehicles/brands').then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    api
      .get<VehicleListResponse>(`/vehicles?${params.toString()}`)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilters = (next: VehicleFilterState) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  return (
    <PageTransition>
      <section className="border-b border-border bg-bg-900 py-12">
        <div className="container-page">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">Nosso estoque</h1>
          <p className="mt-2 text-white/60">
            {data ? `${data.pagination.total} veículos encontrados` : 'Carregando...'}
          </p>
        </div>
      </section>

      <section className="border-b border-border py-6">
        <div className="container-page">
          <VehicleFilters value={filters} brands={brands} onChange={handleFilters} />
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-[4/3] w-full" />
                  <div className="space-y-2 p-4">
                    <div className="skeleton h-3 w-1/3 rounded" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-6 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : data && data.vehicles.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.vehicles.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} index={i} />
                ))}
              </div>
              {data.pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                    className="btn-outline disabled:opacity-30"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-white/60">
                    Página {data.pagination.page} de {data.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.totalPages}
                    className="btn-outline disabled:opacity-30"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-16 text-center">
              <p className="font-display text-xl font-bold">Nenhum veículo encontrado</p>
              <p className="mt-2 text-white/50">Tente ajustar os filtros para ver outros resultados.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
