import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/lib/types';

const emptyForm = {
  name: '',
  title: '',
  email: '',
  bio: '',
  image_url: '',
  display_order: 0,
  is_published: false,
};

export function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from('team_members').select('*').order('display_order');
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const startEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      title: m.title,
      email: m.email,
      bio: m.bio,
      image_url: m.image_url,
      display_order: m.display_order,
      is_published: m.is_published,
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, display_order: members.length + 1 });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('team_members').update(form).eq('id', editing.id);
    } else {
      await supabase.from('team_members').insert({ ...form, locale: 'en' });
    }
    setSaving(false);
    setShowForm(false);
    fetchMembers();
  };

  const remove = async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id);
    fetchMembers();
  };

  const togglePublished = async (m: TeamMember) => {
    await supabase.from('team_members').update({ is_published: !m.is_published }).eq('id', m.id);
    fetchMembers();
  };

  return (
    <div>
      <button
        onClick={startNew}
        className="mb-6 flex items-center gap-2 bg-[#b90046] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20"
      >
        <Plus size={16} /> New team member
      </button>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-[#e1e5e5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#273237]">{editing ? 'Edit team member' : 'New team member'}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-[#687277]" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Title / Position
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Email
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Image URL
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Display order
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="flex items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Published
            </label>
          </div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Bio
            <textarea rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
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
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between border border-[#e1e5e5] bg-white p-4">
              <div className="flex items-center gap-4">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9ecec] font-serif text-lg text-[#a5afb2]">{m.name.charAt(0)}</div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-[#273237]">{m.name}</p>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${m.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {m.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-[#687277]">{m.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublished(m)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">
                  {m.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => startEdit(m)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">Edit</button>
                <button onClick={() => remove(m.id)} className="text-[#879195] hover:text-[#b90046]"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
