import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import VehicleForm from '@/components/admin/VehicleForm';
import ImageUploader from '@/components/admin/ImageUploader';
import { api } from '@/lib/api';
import type { Vehicle, VehicleImage } from '@/types';

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<Vehicle>(`/admin/vehicles/${id}`)
      .then((r) => {
        setVehicle(r.data);
        setImages(r.data.images || []);
      })
      .catch(() => navigate('/admin/veiculos'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    await api.put(`/admin/vehicles/${id}`, data);
    const refreshed = await api.get<Vehicle>(`/admin/vehicles/${id}`);
    setVehicle(refreshed.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  if (loading) {
    return (
      <div className="card p-12 text-center text-white/40">Carregando...</div>
    );
  }

  if (!vehicle) return null;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin/veiculos" className="btn-ghost mb-2 inline-flex">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Editar veículo</h1>
          <p className="text-sm text-white/60">{vehicle.title}</p>
        </div>
        <a href={`/veiculo/${vehicle.slug}`} target="_blank" rel="noreferrer" className="btn-outline">
          Ver no site <ExternalLink size={14} />
        </a>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          ✓ Alterações salvas
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-display text-lg font-bold">Fotos do veículo</h2>
        <p className="mt-1 text-sm text-white/60">
          Envie, reordene e defina a foto principal. A primeira imagem aparece em destaque nos cards.
        </p>
        <div className="mt-5">
          <ImageUploader vehicleId={vehicle.id} images={images} onChange={setImages} />
        </div>
      </div>

      <div className="mt-8">
        <VehicleForm initial={vehicle} submitLabel="Salvar alterações" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
