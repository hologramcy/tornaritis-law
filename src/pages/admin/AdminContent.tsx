import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteContent } from '@/lib/types';

const contentKeys = [
  { key: 'hero_title', label: 'Hero title', multiline: false },
  { key: 'hero_subtitle', label: 'Hero subtitle', multiline: true },
  { key: 'hero_badge', label: 'Hero badge text', multiline: false },
  { key: 'about_intro', label: 'About page intro', multiline: true },
  { key: 'about_founder_title', label: 'About founder name', multiline: false },
  { key: 'about_founder_body', label: 'About founder text', multiline: true },
  { key: 'about_quote', label: 'About quote', multiline: true },
  { key: 'contact_intro', label: 'Contact page intro', multiline: true },
  { key: 'office_address', label: 'Office address', multiline: true },
  { key: 'office_email', label: 'Office email', multiline: false },
  { key: 'office_phone', label: 'Office phone', multiline: false },
  { key: 'footer_tagline', label: 'Footer tagline', multiline: true },
];

const locales = [
  { code: 'en', label: 'English' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
];

export function AdminContent() {
  const [locale, setLocale] = useState('en');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const fetchContents = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_content').select('*').eq('locale', locale);
    const map: Record<string, string> = {};
    for (const item of (data ?? []) as SiteContent[]) {
      map[item.content_key] = item.content_value;
    }
    setContents(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, [locale]);

  const save = async (key: string) => {
    setSaving(key);
    setSavedKey(null);
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { content_key: key, locale, content_value: contents[key] ?? '' },
        { onConflict: 'content_key,locale' }
      );
    if (!error) setSavedKey(key);
    setSaving(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#687277]">Language:</span>
        {locales.map((l) => (
          <button
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
              locale === l.code ? 'bg-[#b90046] text-white' : 'bg-white text-[#687277] border border-[#e1e5e5]'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : (
        <div className="space-y-5">
          {contentKeys.map((item) => (
            <div key={item.key} className="rounded-xl border border-[#e1e5e5] bg-white p-5">
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
                {item.label}
                <span className="ml-2 font-normal text-[#a5afb2]">({item.key})</span>
              </label>
              {item.multiline ? (
                <textarea
                  rows={3}
                  value={contents[item.key] ?? ''}
                  onChange={(e) => setContents({ ...contents, [item.key]: e.target.value })}
                  className="mt-3 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
                />
              ) : (
                <input
                  value={contents[item.key] ?? ''}
                  onChange={(e) => setContents({ ...contents, [item.key]: e.target.value })}
                  className="mt-3 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
                />
              )}
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => save(item.key)}
                  disabled={saving === item.key}
                  className="bg-[#b90046] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#930038] disabled:opacity-50"
                >
                  {saving === item.key ? 'Saving...' : 'Save'}
                </button>
                {savedKey === item.key && (
                  <span className="text-xs text-green-600">Saved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
