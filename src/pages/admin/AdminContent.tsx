import { useEffect, useState } from 'react';
import { Save, Globe, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteContent } from '@/lib/types';
import { PageHeader, TextField, TextArea, PrimaryButton } from '@/components/admin/Fields';
import { showToast } from '@/components/admin/Toast';

const contentGroups = [
  {
    group: 'Homepage',
    items: [
      { key: 'hero_title', label: 'Hero title', multiline: false },
      { key: 'hero_subtitle', label: 'Hero subtitle', multiline: true },
      { key: 'hero_badge', label: 'Hero badge text', multiline: false },
    ],
  },
  {
    group: 'About Page',
    items: [
      { key: 'about_intro', label: 'About page intro', multiline: true },
      { key: 'about_founder_title', label: 'Founder name', multiline: false },
      { key: 'about_founder_body', label: 'Founder description', multiline: true },
      { key: 'about_quote', label: 'About page quote', multiline: true },
    ],
  },
  {
    group: 'Contact Page',
    items: [
      { key: 'contact_intro', label: 'Contact page intro', multiline: true },
      { key: 'office_address', label: 'Office address', multiline: true },
      { key: 'office_email', label: 'Office email', multiline: false },
      { key: 'office_phone', label: 'Office phone', multiline: false },
    ],
  },
  {
    group: 'Footer',
    items: [
      { key: 'footer_tagline', label: 'Footer tagline', multiline: true },
    ],
  },
];

const locales = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'el', label: 'Ελληνικά', flag: 'EL' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'ru', label: 'Русский', flag: 'RU' },
];

export function AdminContent() {
  const [locale, setLocale] = useState('en');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_content').select('*').eq('locale', locale);
    if (error) { showToast('Failed to load content', 'error'); }
    const map: Record<string, string> = {};
    for (const item of (data ?? []) as SiteContent[]) map[item.content_key] = item.content_value;
    setContents(map);
    setDirty(false);
    setLoading(false);
  };

  useEffect(() => { fetchContents(); }, [locale]);

  const update = (key: string, value: string) => { setContents({ ...contents, [key]: value }); setDirty(true); };

  const saveAll = async () => {
    setSavingAll(true);
    const entries = Object.entries(contents).map(([key, value]) => ({ content_key: key, locale, content_value: value }));
    let hasError = false;
    for (const entry of entries) {
      const { error } = await supabase.from('site_content').upsert(entry, { onConflict: 'content_key,locale' });
      if (error) hasError = true;
    }
    if (hasError) { showToast('Some fields failed to save', 'error'); }
    else { showToast('All changes saved'); setDirty(false); }
    setSavingAll(false);
  };

  return (
    <div>
      <PageHeader
        title="Site Content"
        description="Edit all text content across your website. Switch languages to manage translations."
        actions={
          <PrimaryButton onClick={saveAll} disabled={!dirty || savingAll}>
            {savingAll ? 'Saving...' : <><Save size={15} /> Save all changes</>}
          </PrimaryButton>
        }
      />

      {/* Language selector */}
      <div className="mb-6 flex items-center gap-2">
        <Globe size={18} className="text-[#687777]" />
        {locales.map((l) => (
          <button
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
              locale === l.code ? 'bg-[#b90046] text-white' : 'bg-white border border-[#e1e5e5] text-[#687777] hover:border-[#b90046]/30'
            }`}
          >
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px]">{l.flag}</span>
            {l.label}
          </button>
        ))}
        {dirty && <span className="ml-2 text-xs font-medium text-amber-600">Unsaved changes</span>}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-6">
          {contentGroups.map((group) => (
            <div key={group.group} className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
              <div className="border-b border-[#e1e5e5] bg-[#f7f8f8] px-5 py-3">
                <h3 className="font-sans text-sm font-bold text-[#273237]">{group.group}</h3>
              </div>
              <div className="space-y-4 p-5">
                {group.items.map((item) => (
                  <div key={item.key}>
                    {item.multiline ? (
                      <TextArea label={item.label} value={contents[item.key] ?? ''} onChange={(v) => update(item.key, v)} rows={3} />
                    ) : (
                      <TextField label={item.label} value={contents[item.key] ?? ''} onChange={(v) => update(item.key, v)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
