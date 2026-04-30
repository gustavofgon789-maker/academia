import { Link } from 'react-router-dom';
import { Clock, Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const business = settings?.business_name || 'Gel Veículos';

  return (
    <footer className="border-t border-white/8 bg-[#060606]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/84">
            {business}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Veículos seminovos com procedência garantida, atendimento personalizado e as melhores condições do mercado.
          </p>
          <div className="mt-4 flex gap-2">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 p-2 transition-colors hover:bg-white/5"
              >
                <Instagram size={18} />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 p-2 transition-colors hover:bg-white/5"
              >
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Navegação</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="text-white/70 hover:text-white">Início</Link></li>
            <li><Link to="/estoque" className="text-white/70 hover:text-white">Estoque</Link></li>
            <li><Link to="/financiamento" className="text-white/70 hover:text-white">Financiamento</Link></li>
            <li><Link to="/sobre" className="text-white/70 hover:text-white">Sobre</Link></li>
            <li><Link to="/contato" className="text-white/70 hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Contato</div>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {settings?.phone && (
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 text-accent" /> {settings.phone}
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-accent" /> {settings.address}
              </li>
            )}
            {settings?.opening_hours && (
              <li className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 text-accent" />
                <span className="whitespace-pre-line">{settings.opening_hours}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Atendimento</div>
          <p className="mt-4 text-sm text-white/60">
            Tem dúvidas? Fale com a gente direto pelo WhatsApp e tenha uma resposta rápida.
          </p>
          <Link to="/contato" className="btn-outline mt-4 w-full">Fale conosco</Link>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} {business} · Todos os direitos reservados</span>
          <span>Desenvolvido com excelência</span>
        </div>
      </div>
    </footer>
  );
}
