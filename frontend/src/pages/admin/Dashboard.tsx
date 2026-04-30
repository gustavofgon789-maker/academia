import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, CheckCircle2, Clock, ShoppingCart, Star, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { VehicleStats } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<VehicleStats>('/admin/vehicles/stats')
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Dashboard</h1>
          <p className="text-sm text-white/60">Visão geral da operação</p>
        </div>
        <Link to="/admin/veiculos/novo" className="btn-primary">
          <Plus size={16} /> Novo veículo
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Car} label="Total" value={stats?.total ?? 0} color="sky" delay={0} />
        <StatCard icon={CheckCircle2} label="Disponíveis" value={stats?.available ?? 0} color="emerald" delay={0.05} />
        <StatCard icon={ShoppingCart} label="Vendidos" value={stats?.sold ?? 0} color="accent" delay={0.1} />
        <StatCard icon={Clock} label="Reservados" value={stats?.reserved ?? 0} color="amber" delay={0.15} />
        <StatCard icon={Star} label="Destaques" value={stats?.featured ?? 0} color="amber" delay={0.2} />
        <StatCard icon={MessageSquare} label="Leads" value={stats?.totalLeads ?? 0} color="sky" delay={0.25} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Últimos interessados</h2>
            <Link to="/admin/leads" className="btn-ghost text-xs">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border">
            {loading && <div className="py-8 text-center text-sm text-white/40">Carregando...</div>}
            {!loading && stats?.recentLeads.length === 0 && (
              <div className="py-8 text-center text-sm text-white/40">Nenhum lead recebido ainda.</div>
            )}
            {stats?.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold">{lead.name}</div>
                  <div className="text-xs text-white/50">
                    {lead.phone}
                    {lead.vehicle && ` · ${lead.vehicle.brand} ${lead.vehicle.model}`}
                  </div>
                  <div className="mt-1 text-[11px] text-white/40">{formatDateTime(lead.created_at)}</div>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">Atalhos rápidos</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/admin/veiculos/novo" className="rounded-xl border border-border bg-bg-700 p-4 hover:border-accent/40">
              <Plus size={20} className="text-accent" />
              <div className="mt-3 font-semibold">Cadastrar veículo</div>
              <div className="text-xs text-white/50">Adicione um novo carro</div>
            </Link>
            <Link to="/admin/veiculos" className="rounded-xl border border-border bg-bg-700 p-4 hover:border-accent/40">
              <Car size={20} className="text-accent" />
              <div className="mt-3 font-semibold">Estoque</div>
              <div className="text-xs text-white/50">Gerenciar veículos</div>
            </Link>
            <Link to="/admin/leads" className="rounded-xl border border-border bg-bg-700 p-4 hover:border-accent/40">
              <MessageSquare size={20} className="text-accent" />
              <div className="mt-3 font-semibold">Leads</div>
              <div className="text-xs text-white/50">Acompanhar interessados</div>
            </Link>
            <Link to="/admin/configuracoes" className="rounded-xl border border-border bg-bg-700 p-4 hover:border-accent/40">
              <Star size={20} className="text-accent" />
              <div className="mt-3 font-semibold">Configurações</div>
              <div className="text-xs text-white/50">Personalizar o site</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
