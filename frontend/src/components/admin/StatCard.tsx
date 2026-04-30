import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = 'accent',
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  color?: 'accent' | 'emerald' | 'amber' | 'sky';
  delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, delay, ease: 'easeOut' });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, count, rounded, delay]);

  const colorMap = {
    accent: 'bg-accent/10 text-accent',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    sky: 'bg-sky-500/10 text-sky-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 font-display text-3xl font-black">{display}</div>
    </motion.div>
  );
}
