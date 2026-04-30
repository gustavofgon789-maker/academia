import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Pencil, Trash2, Star, Tag, Eye, EyeOff, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { api, imageUrl } from '@/lib/api';
import { formatCurrency, formatMileage, formatYears, statusLabel } from '@/lib/format';
import type { Vehicle, VehicleListResponse } from '@/types';

export default function VehiclesList() {
  const [data, setData] = useState<VehicleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '20');
      const { data } = await api.get<VehicleListResponse>(`/admin/vehicles?${params.toString()}`);
      setData(data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, statusFilter, page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/vehicles/${id}/status`, { status });
      load();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const toggleFeatured = async (v: Vehicle) => {
    try {
      await api.patch(`/admin/vehicles/${v.id}/featured`, { is_featured: !v.is_featured });
      load();
    } catch {
      alert('Erro');
    }
  };

  const togglePromotion = async (v: Vehicle) => {
    try {
      await api.patch(`/admin/vehicles/${v.id}/promotion`, { is_promotion: !v.is_promotion });
      load();
    } catch {
      alert('Erro');
    }
  };

  const toggleActive = async (v: Vehicle) => {
    try {
      await api.put(`/admin/vehicles/${v.id}`, { is_active: !v.is_active });
      load();
    } catch {
      alert('Erro');
    }
  };

  const updatePrice = async (v: Vehicle) => {
    const novo = prompt(`Novo preço para ${v.brand} ${v.model}:`, String(v.price));
    if (novo === null) return;
    const valor = parseFloat(novo);
    if (isNaN(valor) || valor <= 0) {
      alert('Preço inválido');
      return;
    }
    try {
      await api.patch(`/admin/vehicles/${v.id}/price`, { price: valor });
      load();
    } catch {
      alert('Erro ao atualizar preço');
    }
  };

  const remove = async (v: Vehicle) => {
    if (!confirm(`Remover "${v.title}" permanentemente?`)) return;
    try {
      await api.delete(`/admin/vehicles/${v.id}`);
      load();
    } catch {
      alert('Erro ao remover');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Veículos</h1>
          <p className="text-sm text-white/60">{data?.pagination.total ?? 0} no total</p>
        </div>
        <Link to="/admin/veiculos/novo" className="btn-primary">
          <Plus size={16} /> Novo veículo
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por título, marca ou modelo..."
            className="input pl-10"
          />
        </div>
        <select className="input sm:max-w-[200px]" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Todos os status</option>
          <option value="available">Disponível</option>
          <option value="reserved">Reservado</option>
          <option value="sold">Vendido</option>
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        {loading ? (
          <div className="bg-bg-800 p-12 text-center text-sm text-white/40">Carregando...</div>
        ) : !data || data.vehicles.length === 0 ? (
          <div className="bg-bg-800 p-12 text-center">
            <p className="text-white/60">Nenhum veículo encontrado.</p>
            <Link to="/admin/veiculos/novo" className="btn-primary mt-4 inline-flex">
              Cadastrar o primeiro
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-900 text-left text-xs uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-4 py-3">Veículo</th>
                  <th className="px-4 py-3">Ano/KM</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-bg-800">
                {data.vehicles.map((v) => {
                  const main = v.images.find((i) => i.is_main) || v.images[0];
                  return (
                    <tr key={v.id} className="hover:bg-bg-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-bg-700">
                            {main ? (
                              <img src={imageUrl(main.image_url)} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-semibold">{v.brand} {v.model}</div>
                            <div className="text-xs text-white/50">{v.version}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/80">
                        {formatYears(v.year_fabrication, v.year_model)}
                        <div className="text-xs text-white/50">{formatMileage(v.mileage)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => updatePrice(v)} className="font-semibold hover:text-accent" title="Clique para alterar">
                          {formatCurrency(v.promotional_price ?? v.price)}
                        </button>
                        {v.promotional_price && (
                          <div className="text-xs text-white/50 line-through">{formatCurrency(v.price)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={v.status}
                          onChange={(e) => updateStatus(v.id, e.target.value)}
                          className="rounded-md border border-border bg-bg-700 px-2 py-1 text-xs"
                        >
                          <option value="available">Disponível</option>
                          <option value="reserved">Reservado</option>
                          <option value="sold">Vendido</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleFeatured(v)}
                            className={`rounded-md p-1.5 ${v.is_featured ? 'bg-amber-500/20 text-amber-400' : 'bg-bg-700 text-white/40'}`}
                            title="Destaque"
                          >
                            <Star size={14} fill={v.is_featured ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => togglePromotion(v)}
                            className={`rounded-md p-1.5 ${v.is_promotion ? 'bg-emerald-500/20 text-emerald-400' : 'bg-bg-700 text-white/40'}`}
                            title="Promoção"
                          >
                            <Tag size={14} />
                          </button>
                          <button
                            onClick={() => toggleActive(v)}
                            className={`rounded-md p-1.5 ${v.is_active ? 'bg-sky-500/20 text-sky-400' : 'bg-bg-700 text-white/40'}`}
                            title={v.is_active ? 'Anúncio ativo' : 'Anúncio inativo'}
                          >
                            {v.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/admin/veiculos/${v.id}/editar`} className="btn-ghost p-2" title="Editar">
                            <Pencil size={14} />
                          </Link>
                          <button onClick={() => remove(v)} className="btn-ghost p-2 text-red-400 hover:bg-red-500/10" title="Remover">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="btn-outline disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="px-3 text-sm text-white/60">
            {page} de {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.pagination.totalPages}
            className="btn-outline disabled:opacity-30"
          >
            Próxima <ChevronRight size={16} />
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-white/40">
        Dica: clique no preço para alterá-lo rapidamente. As flags (estrela, etiqueta, olho) ativam/desativam destaque, promoção e visibilidade.
      </p>
    </div>
  );
}
