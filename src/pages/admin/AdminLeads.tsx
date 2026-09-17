import { useEffect, useState, useMemo } from 'react';
import { Search, Trash2, Mail, Phone, Inbox, ArrowUpDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { FormSubmission } from '@/lib/types';
import { PageHeader, Badge, EmptyState, LoadingState, SelectField } from '@/components/admin/Fields';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Modal } from '@/components/admin/Modal';
import { showToast } from '@/components/admin/Toast';

const statusVariants: Record<string, 'danger' | 'info' | 'success' | 'neutral'> = {
  new: 'danger', in_progress: 'info', resolved: 'success', archived: 'neutral',
};

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
];

export function AdminLeads() {
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailLead, setDetailLead] = useState<FormSubmission | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from('form_submissions').select('*').order('created_at', { ascending: sortAsc });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error } = await query;
    if (error) { showToast('Failed to load leads', 'error'); }
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [filter, sortAsc]);

  const filtered = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.message.toLowerCase().includes(q));
  }, [leads, search]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('form_submissions').update({ status }).eq('id', id);
    if (error) { showToast('Failed to update status', 'error'); return; }
    showToast('Status updated');
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('form_submissions').delete().eq('id', id);
    if (error) { showToast('Failed to delete lead', 'error'); return; }
    showToast('Lead deleted');
    fetchLeads();
  };

  return (
    <div>
      <PageHeader title="Leads" description="Contact form submissions from your website" />

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'in_progress', 'resolved', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                filter === s ? 'bg-[#b90046] text-white' : 'bg-white border border-[#e1e5e5] text-[#687777] hover:border-[#b90046]/30'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5afb2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full rounded-lg border border-[#d9ddde] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10 sm:w-64"
            />
          </div>
          <button onClick={() => setSortAsc(!sortAsc)} className="rounded-lg border border-[#e1e5e5] bg-white p-2.5 text-[#687777] transition hover:text-[#b90046]" title="Toggle sort order">
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No leads found" message={search ? "Try a different search term." : "Contact form submissions will appear here."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Name</th><th>Contact</th><th>Type</th><th>Status</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="cursor-pointer" onClick={() => setDetailLead(lead)}>
                  <td className="font-medium">{lead.name}</td>
                  <td className="text-[#687777]">{lead.email}</td>
                  <td><Badge variant={lead.form_type === 'appointment' ? 'info' : 'neutral'}>{lead.form_type}</Badge></td>
                  <td><Badge variant={statusVariants[lead.status]}>{lead.status.replace('_', ' ')}</Badge></td>
                  <td className="text-[#879195]">{new Date(lead.created_at).toLocaleDateString('en-GB')}</td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDeleteId(lead.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!detailLead}
        onClose={() => setDetailLead(null)}
        title="Lead details"
        size="lg"
        footer={
          detailLead && (
            <div className="flex w-full items-center justify-between">
              <div className="w-48">
                <SelectField label="Status" value={detailLead.status} onChange={(v) => { updateStatus(detailLead.id, v); setDetailLead({ ...detailLead, status: v as FormSubmission['status'] }); }} options={statusOptions} />
              </div>
              <button onClick={() => setDeleteId(detailLead.id)} className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-600">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )
        }
      >
        {detailLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b90046] text-lg font-bold text-white">{detailLead.name.charAt(0).toUpperCase()}</div>
              <div><p className="text-lg font-bold text-[#273237]">{detailLead.name}</p><Badge variant={statusVariants[detailLead.status]}>{detailLead.status.replace('_', ' ')}</Badge></div>
            </div>
            <div className="grid gap-3 rounded-xl bg-[#f7f8f8] p-4">
              <a href={`mailto:${detailLead.email}`} className="flex items-center gap-2 text-sm text-[#273237] hover:text-[#b90046]"><Mail size={16} className="text-[#687777]" /> {detailLead.email}</a>
              <p className="flex items-center gap-2 text-sm text-[#273237]"><Phone size={16} className="text-[#687777]" /> {detailLead.phone || 'No phone provided'}</p>
              <p className="text-xs text-[#879195]">Submitted {new Date(detailLead.created_at).toLocaleString('en-GB')}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Message</p>
              <div className="rounded-xl border border-[#e1e5e5] p-4 text-sm leading-6 text-[#3b4246]">{detailLead.message}</div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteLead(deleteId); setDetailLead(null); }}
        title="Delete lead"
        message="Are you sure you want to permanently delete this lead? This action cannot be undone."
      />
    </div>
  );
}
