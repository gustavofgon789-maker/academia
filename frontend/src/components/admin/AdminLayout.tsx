import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Car, MessageSquare, Settings as SettingsIcon,
  LogOut, Plus, Menu, X, ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/veiculos', icon: Car, label: 'Veículos' },
  { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
  { to: '/admin/configuracoes', icon: SettingsIcon, label: 'Configurações' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = (
    <>
      <div className="flex flex-col items-start gap-2 px-2 py-1">
        <img src="/logo-gel-veiculos.png.png" alt="Gel Veículos" className="h-9 w-auto object-contain" />
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Painel Administrativo</div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-white shadow-glow'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <item.icon size={18} /> {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/admin/veiculos/novo"
        onClick={() => setMobileOpen(false)}
        className="btn-primary mt-6 w-full"
      >
        <Plus size={16} /> Novo veículo
      </NavLink>

      <a href="/" target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full">
        <ExternalLink size={16} /> Ver site público
      </a>

      <div className="mt-auto border-t border-border pt-4">
        <div className="text-xs text-white/50">{user?.email}</div>
        <button onClick={handleLogout} className="btn-ghost mt-2 w-full justify-start">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-bg-900">
      <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-1 border-r border-border bg-bg-950 p-4 lg:flex">
        {SidebarContent}
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg-950/80 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-border-light p-2"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>
          <span className="font-display text-sm font-extrabold">Admin</span>
        </div>
        <button onClick={handleLogout} className="btn-ghost">
          <LogOut size={16} />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 border-r border-border bg-bg-950 p-4"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 rounded-lg border border-border p-1.5"
              >
                <X size={16} />
              </button>
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-14 lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
