import { useEffect, useState } from 'react';
import { Search, ExternalLink, MessageCircle } from 'lucide-react';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';
import { api } from '@/lib/api';
import { formatDateTime, formatPhone } from '@/lib/format';
import type { Lead, LeadListResponse, LeadStatus } from '@/types';

const SOURCES_LABEL: Record<string, string> = {
  website: 'Site',
  contato: 'Contato',
  financiamento: 'Financiamento',
  whatsapp: 'WhatsApp',
};

export default function Leads() {
  const [data, setData] = useState<LeadListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('page', String(page));
      params.set('limit', '30');
      const { data } = await api.get<LeadListResponse>(`/leads/admin?${params.toString()}`);
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
  }, [search, status, page]);

  const updateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      await api.patch(`/leads/admin/${id}/status`, { status: newStatus });
      load();
      if (selected?.id === id) setSelected({ ...selected, status: newStatus });
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">Leads</h1>
      <p className="text-sm text-white/60">Acompanhe os interessados e atualize o status do atendimento.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nome, telefone ou e-mail..."
            className="input pl-10"
          />
        </div>
        <select className="input sm:max-w-[220px]" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Todos os status</option>
          <option value="new">Novo</option>
          <option value="in_progress">Em atendimento</option>
          <option value="converted">Convertido</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        {loading ? (
          <div className="bg-bg-800 p-12 text-center text-sm text-white/40">Carregando...</div>
        ) : !data || data.leads.length === 0 ? (
          <div className="bg-bg-800 p-12 text-center text-white/60">Nenhum lead encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-900 text-left text-xs uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Veículo</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-bg-800">
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-bg-700/50">
                    <td className="px-4 py-3 font-semibold">{lead.name}</td>
                    <td className="px-4 py-3">
                      <div>{formatPhone(lead.phone)}</div>
                      {lead.email && <div className="text-xs text-white/50">{lead.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {lead.vehicle ? (
                        <a href={`/veiculo/${lead.vehicle.slug}`} target="_blank" rel="noreferrer" className="hover:text-accent">
                          {lead.vehicle.brand} {lead.vehicle.model}
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/60">{SOURCES_LABEL[lead.source] || lead.source}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                        className="rounded-md border border-border bg-bg-700 px-2 py-1 text-xs"
                      >
                        <option value="new">Novo</option>
                        <option value="in_progress">Em atendimento</option>
                        <option value="converted">Convertido</option>
                        <option value="lost">Perdido</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/60 whitespace-nowrap">{formatDateTime(lead.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost p-2 text-emerald-400 hover:bg-emerald-500/10"
                          title="Abrir WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </a>
                        <button
                          onClick={() => setSelected(lead)}
                          className="btn-ghost p-2"
                          title="Ver detalhes"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative card w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">{selected.name}</h3>
                <div className="text-sm text-white/60">{formatPhone(selected.phone)}</div>
                {selected.email && <div className="text-sm text-white/60">{selected.email}</div>}
              </div>
              <LeadStatusBadge status={selected.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-white/40">Origem</div>
                <div className="font-semibold">{SOURCES_LABEL[selected.source] || selected.source}</div>
              </div>
              <div>
                <div className="text-white/40">Data</div>
                <div className="font-semibold">{formatDateTime(selected.created_at)}</div>
              </div>
              {selected.vehicle && (
                <div className="col-span-2">
                  <div className="text-white/40">Veículo de interesse</div>
                  <div className="font-semibold">{selected.vehicle.brand} {selected.vehicle.model}</div>
                </div>
              )}
            </div>

            {selected.message && (
              <div className="mt-4">
                <div className="label">Mensagem</div>
                <div className="rounded-lg border border-border bg-bg-700 p-3 text-sm whitespace-pre-line">
                  {selected.message}
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <MessageCircle size={16} /> Abrir WhatsApp
              </a>
              <button onClick={() => setSelected(null)} className="btn-outline">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-outline disabled:opacity-30">Anterior</button>
          <span className="px-3 text-sm text-white/60">{page} de {data.pagination.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === data.pagination.totalPages} className="btn-outline disabled:opacity-30">Próxima</button>
        </div>
      )}
    </div>
  );
}
