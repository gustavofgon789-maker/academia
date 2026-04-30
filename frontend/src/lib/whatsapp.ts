import type { Vehicle } from '@/types';
import { formatCurrency } from './format';

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function vehicleInterestMessage(vehicle: Pick<Vehicle, 'brand' | 'model' | 'version' | 'year_model' | 'price' | 'promotional_price'>): string {
  const price = vehicle.promotional_price ?? vehicle.price;
  return `Olá, tenho interesse no veículo ${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year_model} anunciado por ${formatCurrency(price)}. Ele ainda está disponível?`;
}

export function defaultMessage(business: string): string {
  return `Olá ${business}, gostaria de mais informações.`;
}
