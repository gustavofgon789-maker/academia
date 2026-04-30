import { motion } from 'framer-motion';
import { ArrowRight, Award, Car, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imageUrl } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl, defaultMessage } from '@/lib/whatsapp';

const DEFAULT_WHATSAPP = '5517988194375';
const LOCAL_CAR_IMAGE = '/hero-carro-gel-veiculos.png.png';

const STATS = [
  { icon: Award, value: '+10', label: 'Anos no mercado' },
  { icon: Car, value: '+500', label: 'Carros vendidos' },
  { icon: ShieldCheck, value: '100%', label: 'Procedência' },
];

export default function Hero() {
  const { settings } = useSettings();

  const business = settings?.business_name?.trim() || 'Gel Veículos';
  const title = settings?.hero_title?.trim() || 'Seu próximo carro está aqui';
  const subtitle =
    settings?.hero_subtitle?.trim() ||
    'Na Gel Veículos você encontra os melhores veículos seminovos com procedência garantida, facilidade no financiamento e atendimento personalizado.';
  const waPhone = settings?.whatsapp?.trim() || DEFAULT_WHATSAPP;
  const wa = buildWhatsAppUrl(waPhone, defaultMessage(business));
  const carImg = settings?.hero_image_url ? imageUrl(settings.hero_image_url) : LOCAL_CAR_IMAGE;

  return (
    <section className="relative isolate overflow-hidden bg-[#050505]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 14% 28%, rgba(127,17,17,0.34) 0%, transparent 34%), radial-gradient(circle at 73% 36%, rgba(239,43,45,0.22) 0%, transparent 28%), linear-gradient(110deg, #050505 0%, #080808 44%, #130505 71%, #050505 100%)',
        }}
      />
      <div className="pointer-events-none absolute left-[-8%] top-[12%] h-[260px] w-[260px] rounded-full bg-[#7f1111]/24 blur-[120px] sm:h-[340px] sm:w-[340px]" />
      <div className="pointer-events-none absolute right-[-12%] top-[4%] h-[360px] w-[360px] rounded-full bg-[#ff2d2d]/14 blur-[150px] sm:h-[520px] sm:w-[520px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-[#050505] via-[#050505]/72 to-transparent" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[720px] items-center py-12 sm:min-h-[760px] sm:py-14 lg:min-h-[780px] lg:py-16 xl:min-h-[800px]">
          <div className="relative z-20 max-w-[670px] lg:max-w-[52%] xl:max-w-[50%]">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ef2b2d]/30 bg-[#2a0b0b]/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff6a47] shadow-[0_10px_30px_rgba(127,17,17,0.16)]"
            >
              <span aria-hidden="true">&#11088;</span>
              <span>Concessionária Premium</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.58, ease: 'easeOut' }}
              className="mt-6 max-w-[660px] font-display text-[clamp(3rem,6.3vw,5.75rem)] font-black leading-[0.9] tracking-[-0.062em] text-white"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.52, ease: 'easeOut' }}
              className="mt-8 max-w-[590px] text-[clamp(1rem,1.32vw,1.18rem)] leading-[1.85] text-[#c7c7c7]"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.48, ease: 'easeOut' }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/estoque"
                className="group inline-flex min-h-[58px] min-w-[220px] items-center justify-center gap-3 rounded-[18px] bg-[#ef2b2d] px-7 py-4 text-[15px] font-bold text-white shadow-[0_20px_44px_rgba(239,43,45,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff2d2d] active:translate-y-0"
              >
                <span>Ver estoque</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[58px] min-w-[240px] items-center justify-center gap-3 rounded-[18px] border border-white/14 bg-white/[0.02] px-7 py-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm transition-all duration-300 hover:border-white/24 hover:bg-white/[0.05]"
              >
                <MessageCircle size={18} />
                <span>Falar no WhatsApp</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.5, ease: 'easeOut' }}
              className="mt-12 max-w-[620px] border-t border-white/10 pt-7"
            >
              <div className="grid gap-5 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-6">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ef2b2d]/24 bg-[#170707] text-[#ef2b2d] shadow-[0_10px_24px_rgba(127,17,17,0.16)]">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-[clamp(1.95rem,2.45vw,2.55rem)] font-black leading-none tracking-[-0.05em] text-[#ef2b2d]">
                        {value}
                      </div>
                      <div className="mt-1 text-[13px] leading-tight text-[#c7c7c7]">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.66, ease: 'easeOut' }}
            className="relative mt-10 min-h-[360px] sm:min-h-[470px] lg:absolute lg:inset-y-0 lg:right-[-7%] lg:mt-0 lg:w-[58%] lg:min-h-0 xl:right-[-8%] xl:w-[60%]"
          >
            <div className="pointer-events-none absolute left-[4%] top-[22%] h-[180px] w-[180px] rounded-full bg-[#7f1111]/28 blur-[86px] sm:h-[240px] sm:w-[240px] lg:h-[280px] lg:w-[280px]" />
            <div className="pointer-events-none absolute right-[6%] top-[18%] h-[250px] w-[250px] rounded-full bg-[#ff2d2d]/30 blur-[110px] sm:h-[340px] sm:w-[340px] lg:h-[440px] lg:w-[440px]" />
            <div className="pointer-events-none absolute inset-x-[16%] bottom-[8%] h-[18%] rounded-full bg-[#ff2d2d]/14 blur-[58px]" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-[18%] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_28%,transparent_72%)] blur-[18px]" />

            <div className="pointer-events-none absolute right-[10%] top-[20%] hidden h-[2px] w-[68%] origin-right -rotate-[4deg] rounded-full bg-gradient-to-r from-[#ff6666] via-[#ff2d2d] to-transparent shadow-[0_0_30px_rgba(255,45,45,0.92)] lg:block" />
            <div className="pointer-events-none absolute right-[2%] top-[23%] hidden h-[46%] w-[30%] border-l border-t border-[#661515]/80 bg-gradient-to-b from-[#631212]/18 via-transparent to-transparent lg:block" />
            <div className="pointer-events-none absolute right-[2%] top-[23%] hidden h-[2px] w-[30%] bg-gradient-to-r from-[#ff7676]/18 to-[#ff2d2d]/78 shadow-[0_0_22px_rgba(255,45,45,0.64)] lg:block" />

            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[34%] bg-gradient-to-r from-[#050505] via-[#050505]/92 to-transparent lg:w-[26%]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14%] bg-gradient-to-b from-[#050505] via-[#050505]/56 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[24%] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%] bg-gradient-to-l from-[#050505] via-[#050505]/32 to-transparent" />

              <img
                src={carImg}
                alt="Carro premium Gel Veículos"
                className="absolute bottom-[-10%] right-[-16%] h-[106%] max-w-none select-none sm:bottom-[-12%] sm:right-[-10%] sm:h-[112%] lg:bottom-[-6%] lg:right-[-14%] lg:h-[124%] xl:right-[-11%] xl:h-[128%]"
                style={{
                  filter:
                    'saturate(0.92) brightness(0.93) contrast(1.08) drop-shadow(0 34px 78px rgba(0,0,0,0.56)) drop-shadow(0 0 72px rgba(239,43,45,0.18))',
                  maskImage:
                    'radial-gradient(ellipse 82% 78% at 64% 58%, black 54%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.7) 82%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 82% 78% at 64% 58%, black 54%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.7) 82%, transparent 100%)',
                }}
                draggable={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
