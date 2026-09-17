import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsroomPost } from '@/lib/types';

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  category: 'Insight',
  author_name: '',
  is_published: false,
};

const categories = ['Insight', 'Legal update', 'Case study', 'News', 'Perspective'];

export function AdminNewsroom() {
  const [posts, setPosts] = useState<NewsroomPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NewsroomPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('newsroom_posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const startEdit = (post: NewsroomPost) => {
    setEditing(post);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      author_name: post.author_name,
      is_published: post.is_published,
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from('newsroom_posts').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('newsroom_posts').insert({ ...payload, locale: 'en' });
    }
    setSaving(false);
    setShowForm(false);
    fetchPosts();
  };

  const remove = async (id: string) => {
    await supabase.from('newsroom_posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublished = async (post: NewsroomPost) => {
    await supabase
      .from('newsroom_posts')
      .update({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : post.published_at,
      })
      .eq('id', post.id);
    fetchPosts();
  };

  return (
    <div>
      <button
        onClick={startNew}
        className="mb-6 flex items-center gap-2 bg-[#b90046] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20"
      >
        <Plus size={16} /> New article
      </button>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-[#e1e5e5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#273237]">{editing ? 'Edit article' : 'New article'}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-[#687277]" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Slug (URL)
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Author
              <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
            </label>
          </div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Excerpt
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Body
            <textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </label>
          <label className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <button onClick={save} disabled={saving} className="mt-4 bg-[#b90046] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#687277]">No articles yet. Create one to get started.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between border border-[#e1e5e5] bg-white p-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-[#273237]">{post.title}</p>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${post.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#687277]">{post.category} · /{post.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublished(post)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => startEdit(post)} className="text-xs font-bold uppercase tracking-[0.1em] text-[#687277] hover:text-[#b90046]">Edit</button>
                <button onClick={() => remove(post.id)} className="text-[#879195] hover:text-[#b90046]"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
