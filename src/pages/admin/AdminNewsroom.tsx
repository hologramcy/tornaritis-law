import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff, Newspaper, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsroomPost } from '@/lib/types';
import { PageHeader, Badge, EmptyState, LoadingState, TextField, TextArea, SelectField, Toggle, PrimaryButton, SecondaryButton } from '@/components/admin/Fields';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';

const emptyForm = { slug: '', title: '', excerpt: '', body: '', category: 'Insight', author_name: '', is_published: false };
const categories = ['Insight', 'Legal update', 'Case study', 'News', 'Perspective'];

export function AdminNewsroom() {
  const [posts, setPosts] = useState<NewsroomPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsroomPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('newsroom_posts').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load articles', 'error'); }
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = posts.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (post: NewsroomPost) => {
    setEditing(post);
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, body: post.body, category: post.category, author_name: post.author_name, is_published: post.is_published });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    setSaving(true);
    const payload = { ...form, published_at: form.is_published ? new Date().toISOString() : null };
    const { error } = editing
      ? await supabase.from('newsroom_posts').update(payload).eq('id', editing.id)
      : await supabase.from('newsroom_posts').insert({ ...payload, locale: 'en' });
    if (error) { showToast('Failed to save', 'error'); setSaving(false); return; }
    showToast(editing ? 'Article updated' : 'Article created');
    setSaving(false); setModalOpen(false); fetchPosts();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('newsroom_posts').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Article deleted'); fetchPosts();
  };

  const togglePublished = async (post: NewsroomPost) => {
    const { error } = await supabase.from('newsroom_posts').update({ is_published: !post.is_published, published_at: !post.is_published ? new Date().toISOString() : post.published_at }).eq('id', post.id);
    if (error) { showToast('Failed to update', 'error'); return; }
    showToast(post.is_published ? 'Unpublished' : 'Published'); fetchPosts();
  };

  return (
    <div>
      <PageHeader
        title="Newsroom"
        description="Create and manage articles for your website's newsroom"
        actions={<PrimaryButton onClick={openNew}><Plus size={16} /> New article</PrimaryButton>}
      />

      {loading ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No articles yet" message="Write your first article to publish it in your newsroom." />
      ) : (
        <>
          <div className="mb-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5afb2]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="w-full max-w-sm rounded-lg border border-[#d9ddde] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
            <table className="cms-table">
              <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id}>
                    <td className="font-medium">{post.title}</td>
                    <td><Badge variant="info">{post.category}</Badge></td>
                    <td className="text-[#687777]">{post.author_name || '—'}</td>
                    <td><Badge variant={post.is_published ? 'success' : 'neutral'}>{post.is_published ? 'Published' : 'Draft'}</Badge></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublished(post)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]">{post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        <button onClick={() => openEdit(post)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-[#b90046]"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteId(post.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit article' : 'New article'}
        size="lg"
        footer={<><SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton><PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton></>}
      >
        <div className="space-y-4">
          <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Slug (URL)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/\s+/g, '-') })} placeholder="my-article" />
            <SelectField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories.map((c) => ({ value: c, label: c }))} />
          </div>
          <TextField label="Author" value={form.author_name} onChange={(v) => setForm({ ...form, author_name: v })} placeholder="Author name" />
          <TextArea label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} placeholder="Short summary shown in listings" />
          <TextArea label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={8} placeholder="Full article content" />
          <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Published" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        title="Delete article"
        message="Are you sure you want to permanently delete this article?"
      />
    </div>
  );
}
