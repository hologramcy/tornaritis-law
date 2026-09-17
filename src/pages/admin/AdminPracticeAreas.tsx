import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PracticeArea } from '@/lib/types';

const emptyForm = {
  slug: '',
  title: '',
  summary: '',
  body: '',
  display_order: 0,
  is_published: false,
};

export function AdminPracticeAreas() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PracticeArea | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    const { data } = await supabase.from('practice_areas').select('*').order('display_order');
    setAreas(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const startEdit = (area: PracticeArea) => {
    setEditing(area);
    setForm({
      slug: area.slug,
      title: area.title,
      summary: area.summary,
      body: area.body,
      display_order: area.display_order,
      is_published: area.is_published,
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, display_order: areas.length + 1 });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('practice_areas').update(form).eq('id', editing.id);
    } else {
      await supabase.from('practice_areas').insert({ ...form, locale: 'en' });
    }
    setSaving(false);
    setShowForm(false);
    fetchAreas();
  };

  const remove = async (id: string) => {
    await supabase.from('practice_areas').delete().eq('id', id);
    fetchAreas();
  };

  const togglePublished = async (area: PracticeArea) => {
    await supabase.from('practice_areas').update({ is_published: !area.is_published }).eq('id', area.id);
    fetchAreas();
  };

  return (
    <div>
      <button
        onClick={startNew}
        className="mb-6 flex items-center gap-2 bg-[#b90046] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20"
      >
        <Plus size={16} /> New practice area
      </button>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-[#e1e5e5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#273237]">{editing ? 'Edit practice area' : 'New practice area'}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-[#687277]" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Slug (URL)
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Display order
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="flex items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Published
            </label>
          </div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Summary
            <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Body (full description)
            <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </label>
          <button onClick={save} disabled={saving} className="mt-4 bg-[#b90046] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : (
        <div className="space-y-3">
          {areas.map((area) => (
            <div key={area.id} className="flex items-center justify-between border border-[#e1e5e5] bg-white p-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#b90046]">{String(area.display_order).padStart(2, '0')}</span>
                  <p className="font-medium text-[#273237]">{area.title}</p>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${area.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {area.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#687277]">/{area.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublished(area)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">
                  {area.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => startEdit(area)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">Edit</button>
                <button onClick={() => remove(area.id)} className="text-[#879195] hover:text-[#b90046]"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
