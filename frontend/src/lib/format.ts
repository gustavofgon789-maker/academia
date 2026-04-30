export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'Sob consulta';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Sob consulta';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}

export function formatYears(yf: number, ym: number): string {
  return yf === ym ? String(ym) : `${yf}/${ym}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    available: 'Disponível',
    sold: 'Vendido',
    reserved: 'Reservado',
    new: 'Novo',
    in_progress: 'Em atendimento',
    converted: 'Convertido',
    lost: 'Perdido',
  };
  return map[status] || status;
}
