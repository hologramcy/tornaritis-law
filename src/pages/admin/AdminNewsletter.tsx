import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsletterSubscriber } from '@/lib/types';

export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    setLoading(true);
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
    setSubscribers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const remove = async (id: string) => {
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    fetchSubs();
  };

  const exportCsv = () => {
    const csv = ['email,locale,subscribed_at'];
    for (const s of subscribers) {
      csv.push(`${s.email},${s.locale},${s.created_at}`);
    }
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#687277]">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        {subscribers.length > 0 && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 border border-[#e1e5e5] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#687277] hover:text-[#b90046]"
          >
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : subscribers.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#687277]">No subscribers yet.</p>
      ) : (
        <div className="border border-[#e1e5e5] bg-white">
          <div className="divide-y divide-[#eef0f0]">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#273237]">{s.email}</p>
                  <p className="text-xs text-[#879195]">{s.locale} · {new Date(s.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <button onClick={() => remove(s.id)} className="text-[#879195] hover:text-[#b90046]">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
