export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
  created_at: string;
}

export type VehicleStatus = 'available' | 'sold' | 'reserved';

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  year_fabrication: number;
  year_model: number;
  price: string | number;
  promotional_price: string | number | null;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  body_type: string;
  doors: number;
  plate_final: string;
  status: VehicleStatus;
  is_featured: boolean;
  is_promotion: boolean;
  is_active: boolean;
  description: string | null;
  options: string[] | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  images: VehicleImage[];
  _count?: { leads: number };
}

export type LeadStatus = 'new' | 'in_progress' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicle_id: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  vehicle?: {
    id: string;
    title: string;
    brand: string;
    model: string;
    slug: string;
  } | null;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string | null;
  whatsapp: string;
  phone: string;
  address: string | null;
  opening_hours: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  primary_color: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  featured: number;
  totalLeads: number;
  recentLeads: Lead[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  pagination: Pagination;
}

export interface LeadListResponse {
  leads: Lead[];
  pagination: Pagination;
}
