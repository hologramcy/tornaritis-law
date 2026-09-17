import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PracticeArea } from '@/lib/types';
import { PageHeader, Badge, EmptyState, LoadingState, TextField, TextArea, NumberField, Toggle, PrimaryButton, SecondaryButton } from '@/components/admin/Fields';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';

const emptyForm = { slug: '', title: '', summary: '', body: '', display_order: 0, is_published: false };

export function AdminPracticeAreas() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PracticeArea | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAreas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('practice_areas').select('*').order('display_order');
    if (error) { showToast('Failed to load practice areas', 'error'); }
    setAreas(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAreas(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, display_order: areas.length + 1 }); setModalOpen(true); };
  const openEdit = (area: PracticeArea) => {
    setEditing(area);
    setForm({ slug: area.slug, title: area.title, summary: area.summary, body: area.body, display_order: area.display_order, is_published: area.is_published });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    setSaving(true);
    const { error } = editing
      ? await supabase.from('practice_areas').update(form).eq('id', editing.id)
      : await supabase.from('practice_areas').insert({ ...form, locale: 'en' });
    if (error) { showToast('Failed to save', 'error'); setSaving(false); return; }
    showToast(editing ? 'Practice area updated' : 'Practice area created');
    setSaving(false); setModalOpen(false); fetchAreas();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('practice_areas').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Practice area deleted'); fetchAreas();
  };

  const togglePublished = async (area: PracticeArea) => {
    const { error } = await supabase.from('practice_areas').update({ is_published: !area.is_published }).eq('id', area.id);
    if (error) { showToast('Failed to update', 'error'); return; }
    showToast(area.is_published ? 'Unpublished' : 'Published'); fetchAreas();
  };

  return (
    <div>
      <PageHeader
        title="Practice Areas"
        description="Manage the practice areas displayed on your website"
        actions={<PrimaryButton onClick={openNew}><Plus size={16} /> New practice area</PrimaryButton>}
      />

      {loading ? (
        <LoadingState />
      ) : areas.length === 0 ? (
        <EmptyState icon={Briefcase} title="No practice areas yet" message="Create your first practice area to display it on your website." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <table className="cms-table">
            <thead><tr><th>Order</th><th>Title</th><th>Slug</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  <td className="font-serif text-lg text-[#b90046]">{String(area.display_order).padStart(2, '0')}</td>
                  <td className="font-medium">{area.title}</td>
                  <td className="text-[#879195]">/{area.slug}</td>
                  <td><Badge variant={area.is_published ? 'success' : 'neutral'}>{area.is_published ? 'Published' : 'Draft'}</Badge></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePublished(area)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]" title={area.is_published ? 'Unpublish' : 'Publish'}>{area.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      <button onClick={() => openEdit(area)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteId(area.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit practice area' : 'New practice area'}
        size="lg"
        footer={
          <>
            <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <TextField label="Slug (URL)" hint="Auto-generated from title" value={form.slug} onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/\s+/g, '-') })} placeholder="corporate-commercial" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Display order" value={form.display_order} onChange={(v) => setForm({ ...form, display_order: v })} />
            <div className="pt-6"><Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Published" /></div>
          </div>
          <TextArea label="Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} rows={2} placeholder="Short description shown in cards and listings" />
          <TextArea label="Full description" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={6} placeholder="Full page content" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        title="Delete practice area"
        message="Are you sure you want to delete this practice area? This will remove it from your website."
      />
    </div>
  );
}
