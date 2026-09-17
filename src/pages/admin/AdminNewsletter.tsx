import { useEffect, useState, useMemo } from 'react';
import { Download, Trash2, Mail, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsletterSubscriber } from '@/lib/types';
import { PageHeader, EmptyState, LoadingState, SecondaryButton } from '@/components/admin/Fields';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';

export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSubs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load subscribers', 'error'); }
    setSubscribers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, []);

  const filtered = useMemo(() => {
    if (!search) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  const remove = async (id: string) => {
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) { showToast('Failed to remove subscriber', 'error'); return; }
    showToast('Subscriber removed'); fetchSubs();
  };

  const exportCsv = () => {
    const csv = ['email,locale,subscribed_at'];
    for (const s of subscribers) csv.push(`${s.email},${s.locale},${s.created_at}`);
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported');
  };

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description={`${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}`}
        actions={subscribers.length > 0 && <SecondaryButton onClick={exportCsv}><Download size={14} /> Export CSV</SecondaryButton>}
      />

      {loading ? (
        <LoadingState />
      ) : subscribers.length === 0 ? (
        <EmptyState icon={Mail} title="No subscribers yet" message="Newsletter signups from your website footer will appear here." />
      ) : (
        <>
          <div className="mb-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5afb2]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers..." className="w-full max-w-sm rounded-lg border border-[#d9ddde] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
            <table className="cms-table">
              <thead><tr><th>Email</th><th>Language</th><th>Subscribed</th><th></th></tr></thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium">{s.email}</td>
                    <td className="text-[#687777] uppercase">{s.locale}</td>
                    <td className="text-[#879195]">{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                    <td><button onClick={() => setDeleteId(s.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove(deleteId); }}
        title="Remove subscriber"
        message="Are you sure you want to remove this subscriber from your mailing list?"
        confirmLabel="Remove"
      />
    </div>
  );
}
