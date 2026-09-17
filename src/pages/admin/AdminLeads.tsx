import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { FormSubmission } from '@/lib/types';

export function AdminLeads() {
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'archived'>('all');

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from('form_submissions').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('form_submissions').update({ status }).eq('id', id);
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    await supabase.from('form_submissions').delete().eq('id', id);
    fetchLeads();
  };

  const statuses = ['new', 'in_progress', 'resolved', 'archived'] as const;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {(['all', ...statuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
              filter === s ? 'bg-[#b90046] text-white' : 'bg-white text-[#687277] border border-[#e1e5e5]'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#687277]">No enquiries found.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-[#e1e5e5] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-[#273237]">{lead.name}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        lead.status === 'new'
                          ? 'bg-[#fdf0f5] text-[#b90046]'
                          : 'bg-[#f0f3f3] text-[#687277]'
                      }`}
                    >
                      {lead.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-[#879195]">{lead.form_type}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#687277]">{lead.email} · {lead.phone || 'No phone'}</p>
                  <p className="mt-3 text-sm text-[#3b4246]">{lead.message}</p>
                  <p className="mt-3 text-xs text-[#879195]">
                    {new Date(lead.created_at).toLocaleString('en-GB')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="rounded-lg border border-[#d9ddde] bg-white px-3 py-2 text-xs outline-none transition focus:border-[#b90046]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-xs font-bold uppercase tracking-[0.1em] text-[#879195] hover:text-[#b90046]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
