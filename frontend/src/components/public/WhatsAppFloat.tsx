import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppUrl, defaultMessage } from '@/lib/whatsapp';

const DEFAULT_WHATSAPP = '5517988194375';

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  const business = settings?.business_name || 'Gel Veículos';
  const whatsapp = settings?.whatsapp || DEFAULT_WHATSAPP;
  const url = buildWhatsAppUrl(whatsapp, defaultMessage(business));

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-[#25d366] text-white shadow-[0_20px_48px_rgba(20,83,45,0.44)] lg:h-[68px] lg:w-[68px]"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
      aria-label="Falar no WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-25 blur-md" />
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-20" />
      <svg viewBox="0 0 24 24" className="relative z-10 h-7 w-7 lg:h-8 lg:w-8" fill="currentColor">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.299-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </motion.a>
  );
}
