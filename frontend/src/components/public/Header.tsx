import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import clsx from 'clsx';
import { Link, NavLink } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl, defaultMessage } from '@/lib/whatsapp';

const NAV = [
  { to: '/', label: 'Início', end: true },
  { to: '/estoque', label: 'Estoque' },
  { to: '/financiamento', label: 'Financiamento' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
];

const DEFAULT_PHONE = '(17) 98819-4375';
const DEFAULT_WHATSAPP = '5517988194375';
const LOGO_SRC = '/logo-gel-veiculos.png.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  const business = settings?.business_name?.trim() || 'Gel Veículos';
  const phone = settings?.phone?.trim() || DEFAULT_PHONE;
  const phoneDigits = phone.replace(/\D/g, '');
  const waPhone = settings?.whatsapp?.trim() || DEFAULT_WHATSAPP;
  const wa = buildWhatsAppUrl(waPhone, defaultMessage(business));

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050505]/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[78px] max-w-[1380px] items-center justify-between gap-4 px-4 sm:h-[84px] sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center">
          <div className="relative h-[34px] w-[148px] overflow-hidden sm:h-[38px] sm:w-[176px] lg:h-[44px] lg:w-[228px] xl:w-[236px]">
            <img
              src={LOGO_SRC}
              alt={business}
              className="pointer-events-none absolute left-[-6%] top-1/2 h-[152%] w-[120%] max-w-none -translate-y-1/2 object-contain select-none"
              style={{ mixBlendMode: 'screen', filter: 'brightness(1.05) contrast(1.06)' }}
              draggable={false}
            />
          </div>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'rounded-[19px] px-[18px] py-[13px] text-[15px] font-semibold tracking-[-0.01em] transition-all duration-300',
                  isActive
                    ? 'bg-[#161616] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_30px_rgba(0,0,0,0.28)]'
                    : 'text-white/74 hover:bg-white/[0.04] hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden min-w-[332px] items-center justify-end gap-4 lg:flex xl:min-w-[368px]">
          <a
            href={`tel:${phoneDigits}`}
            className="group flex items-center gap-3 rounded-full px-1 py-2 text-sm font-semibold text-white/84 transition-colors hover:text-white"
          >
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/88 transition-colors group-hover:border-[#ef2b2d]/35 group-hover:text-[#ef2b2d]">
              <Phone size={16} />
            </span>
            <span>{phone}</span>
          </a>

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[158px] items-center justify-center rounded-[18px] bg-[#ef2b2d] px-7 py-[14px] text-[15px] font-bold text-white shadow-[0_18px_38px_rgba(239,43,45,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff2d2d] active:translate-y-0"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 text-white/80 transition-all duration-300 hover:border-white/16 hover:bg-white/[0.06] hover:text-white lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            />

            <motion.div
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/8 bg-[#080808] px-5 pb-6 pt-5 shadow-[-24px_0_60px_rgba(0,0,0,0.45)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="relative h-[36px] w-[156px] overflow-hidden">
                  <img
                    src={LOGO_SRC}
                    alt={business}
                    className="pointer-events-none absolute left-[-6%] top-1/2 h-[152%] w-[120%] max-w-none -translate-y-1/2 object-contain select-none"
                    style={{ mixBlendMode: 'screen', filter: 'brightness(1.05) contrast(1.06)' }}
                    draggable={false}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 text-white/75 transition-colors hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-2">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'rounded-[18px] px-4 py-3.5 text-base font-semibold transition-all duration-300',
                        isActive
                          ? 'bg-[#161616] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                          : 'text-white/68 hover:bg-white/[0.04] hover:text-white',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto rounded-[28px] border border-white/8 bg-white/[0.02] p-4">
                <a
                  href={`tel:${phoneDigits}`}
                  className="flex items-center gap-3 text-sm font-semibold text-white/86"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#ef2b2d]">
                    <Phone size={17} />
                  </span>
                  <span>{phone}</span>
                </a>

                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-[18px] bg-[#ef2b2d] px-5 py-3.5 text-sm font-bold text-white shadow-[0_18px_38px_rgba(239,43,45,0.22)] transition-colors duration-300 hover:bg-[#ff2d2d]"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
