import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) navigate('/admin/dashboard');
  }, [token, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,38,38,0.18),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-glow">
            <ShieldCheck size={28} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-white/60">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-7">
          <div>
            <label className="label">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                autoComplete="email"
                className="input pl-10"
                placeholder="admin@gelveiculos.com"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                autoComplete="current-password"
                className="input pl-10"
                placeholder="••••••••"
                {...register('password')}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
            {isSubmitting ? 'Entrando...' : 'Entrar no painel'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/40">
          Acesso restrito · {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}
