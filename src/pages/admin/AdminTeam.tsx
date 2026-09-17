import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/lib/types';
import { PageHeader, Badge, EmptyState, LoadingState, TextField, TextArea, NumberField, Toggle, PrimaryButton, SecondaryButton } from '@/components/admin/Fields';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';

const emptyForm = { name: '', title: '', email: '', bio: '', image_url: '', display_order: 0, is_published: false };

export function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('team_members').select('*').order('display_order');
    if (error) { showToast('Failed to load team members', 'error'); }
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, display_order: members.length + 1 }); setModalOpen(true); };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ name: m.name, title: m.title, email: m.email, bio: m.bio, image_url: m.image_url, display_order: m.display_order, is_published: m.is_published });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
    setSaving(true);
    const { error } = editing
      ? await supabase.from('team_members').update(form).eq('id', editing.id)
      : await supabase.from('team_members').insert({ ...form, locale: 'en' });
    if (error) { showToast('Failed to save', 'error'); setSaving(false); return; }
    showToast(editing ? 'Team member updated' : 'Team member added');
    setSaving(false); setModalOpen(false); fetchMembers();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Team member removed'); fetchMembers();
  };

  const togglePublished = async (m: TeamMember) => {
    const { error } = await supabase.from('team_members').update({ is_published: !m.is_published }).eq('id', m.id);
    if (error) { showToast('Failed to update', 'error'); return; }
    showToast(m.is_published ? 'Unpublished' : 'Published'); fetchMembers();
  };

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Manage lawyer and staff profiles displayed on your website"
        actions={<PrimaryButton onClick={openNew}><Plus size={16} /> Add team member</PrimaryButton>}
      />

      {loading ? (
        <LoadingState />
      ) : members.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" message="Add your first team member to display their profile on your website." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <table className="cms-table">
            <thead><tr><th></th><th>Name</th><th>Title</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.image_url
                      ? <img src={m.image_url} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                      : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9ecec] font-serif text-base text-[#a5afb2]">{m.name.charAt(0)}</div>}
                  </td>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-[#687777]">{m.title}</td>
                  <td><Badge variant={m.is_published ? 'success' : 'neutral'}>{m.is_published ? 'Published' : 'Draft'}</Badge></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePublished(m)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]">{m.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      <button onClick={() => openEdit(m)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteId(m.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500"><Trash2 size={16} /></button>
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
        title={editing ? 'Edit team member' : 'Add team member'}
        size="lg"
        footer={<><SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton><PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton></>}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <TextField label="Title / Position" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Partner, Senior Associate..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <TextField label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." hint="Direct link to a photo" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Display order" value={form.display_order} onChange={(v) => setForm({ ...form, display_order: v })} />
            <div className="pt-6"><Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Published" /></div>
          </div>
          <TextArea label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} rows={5} />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        title="Delete team member"
        message="Are you sure you want to remove this team member from your website?"
      />
    </div>
  );
}
