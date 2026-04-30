import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import PublicLayout from '@/components/public/PublicLayout';
import Home from '@/pages/public/Home';
import Estoque from '@/pages/public/Estoque';
import VeiculoDetalhes from '@/pages/public/VeiculoDetalhes';
import Sobre from '@/pages/public/Sobre';
import Contato from '@/pages/public/Contato';
import Financiamento from '@/pages/public/Financiamento';

import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import VehiclesList from '@/pages/admin/VehiclesList';
import VehicleNew from '@/pages/admin/VehicleNew';
import VehicleEdit from '@/pages/admin/VehicleEdit';
import Leads from '@/pages/admin/Leads';
import Settings from '@/pages/admin/Settings';

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="veiculo/:slug" element={<VeiculoDetalhes />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="contato" element={<Contato />} />
          <Route path="financiamento" element={<Financiamento />} />
        </Route>

        <Route path="admin/login" element={<Login />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="veiculos" element={<VehiclesList />} />
          <Route path="veiculos/novo" element={<VehicleNew />} />
          <Route path="veiculos/:id/editar" element={<VehicleEdit />} />
          <Route path="leads" element={<Leads />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
