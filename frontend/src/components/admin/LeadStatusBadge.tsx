import type { LeadStatus } from '@/types';

const MAP: Record<LeadStatus, { label: string; cls: string }> = {
  new: { label: 'Novo', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  in_progress: { label: 'Em atendimento', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  converted: { label: 'Convertido', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  lost: { label: 'Perdido', cls: 'bg-red-500/15 text-red-300 border-red-500/30' },
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const item = MAP[status] || MAP.new;
  return (
    <span className={`badge border ${item.cls}`}>{item.label}</span>
  );
}
