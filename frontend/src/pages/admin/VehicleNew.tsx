import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import VehicleForm from '@/components/admin/VehicleForm';
import { api } from '@/lib/api';

export default function VehicleNew() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    const { data: created } = await api.post('/admin/vehicles', data);
    navigate(`/admin/veiculos/${created.id}/editar`);
  };

  return (
    <div>
      <div className="mb-5">
        <Link to="/admin/veiculos" className="btn-ghost mb-2 inline-flex">
          <ChevronLeft size={16} /> Voltar
        </Link>
        <h1 className="font-display text-2xl font-extrabold md:text-3xl">Novo veículo</h1>
        <p className="text-sm text-white/60">Cadastre os dados primeiro. As fotos podem ser enviadas após salvar.</p>
      </div>

      <VehicleForm submitLabel="Cadastrar e adicionar fotos" onSubmit={handleSubmit} />
    </div>
  );
}
