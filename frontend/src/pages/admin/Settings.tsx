import { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import type { SiteSettings } from '@/types';

const initialState = {
  business_name: '',
  whatsapp: '',
  phone: '',
  address: '',
  opening_hours: '',
  hero_title: '',
  hero_subtitle: '',
  hero_image_url: '',
  logo_url: '',
  instagram_url: '',
  facebook_url: '',
  primary_color: '#dc2626',
};

export default function Settings() {
  const { refresh } = useSettings();
  const [data, setData] = useState<typeof initialState>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<SiteSettings>('/admin/site-settings')
      .then((r) => {
        setData({
          business_name: r.data.business_name || '',
          whatsapp: r.data.whatsapp || '',
          phone: r.data.phone || '',
          address: r.data.address || '',
          opening_hours: r.data.opening_hours || '',
          hero_title: r.data.hero_title || '',
          hero_subtitle: r.data.hero_subtitle || '',
          hero_image_url: r.data.hero_image_url || '',
          logo_url: r.data.logo_url || '',
          instagram_url: r.data.instagram_url || '',
          facebook_url: r.data.facebook_url || '',
          primary_color: r.data.primary_color || '#dc2626',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof typeof initialState>(k: K, v: string) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/site-settings', data);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card p-12 text-center text-white/40">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Configurações do site</h1>
          <p className="text-sm text-white/60">Personalize as informações exibidas no site público.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>

      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          <CheckCircle2 size={16} /> Configurações salvas
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">Identidade</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Nome da empresa</label>
              <input className="input" value={data.business_name} onChange={(e) => set('business_name', e.target.value)} />
            </div>
            <div>
              <label className="label">URL do logo</label>
              <input className="input" value={data.logo_url} onChange={(e) => set('logo_url', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="label">Cor principal</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-bg-800"
                  value={data.primary_color}
                  onChange={(e) => set('primary_color', e.target.value)}
                />
                <input className="input flex-1" value={data.primary_color} onChange={(e) => set('primary_color', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">Contato</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">WhatsApp principal (com DDI)</label>
              <input className="input" value={data.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="5511999999999" />
            </div>
            <div>
              <label className="label">Telefone exibido</label>
              <input className="input" value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="label">Endereço</label>
              <input className="input" value={data.address} onChange={(e) => set('address', e.target.value)} />
            </div>
            <div>
              <label className="label">Horário de atendimento</label>
              <textarea
                rows={3}
                className="input"
                value={data.opening_hours}
                onChange={(e) => set('opening_hours', e.target.value)}
                placeholder="Segunda a Sexta: 8h às 18h\nSábado: 8h às 13h"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Hero da home</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Título principal</label>
              <input className="input" value={data.hero_title} onChange={(e) => set('hero_title', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Subtítulo</label>
              <textarea rows={3} className="input" value={data.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">URL da imagem do banner</label>
              <input className="input" value={data.hero_image_url} onChange={(e) => set('hero_image_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Redes sociais</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Instagram</label>
              <input className="input" value={data.instagram_url} onChange={(e) => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input className="input" value={data.facebook_url} onChange={(e) => set('facebook_url', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  );
}
