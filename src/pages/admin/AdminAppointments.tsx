import { useEffect, useState, useMemo } from 'react';
import { Search, Trash2, Mail, Phone, Calendar as CalIcon, ArrowUpDown, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Appointment } from '@/lib/types';
import { PageHeader, Badge, EmptyState, LoadingState, SelectField } from '@/components/admin/Fields';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Modal } from '@/components/admin/Modal';
import { showToast } from '@/components/admin/Toast';

const statusVariants: Record<string, 'danger' | 'info' | 'success' | 'neutral'> = {
  new: 'danger', confirmed: 'info', completed: 'success', cancelled: 'neutral',
};

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const fetchAppts = async () => {
    setLoading(true);
    let query = supabase.from('appointments').select('*').order('created_at', { ascending: sortAsc });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error } = await query;
    if (error) { showToast('Failed to load appointments', 'error'); }
    setAppointments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAppts(); }, [filter, sortAsc]);

  const filtered = useMemo(() => {
    if (!search) return appointments;
    const q = search.toLowerCase();
    return appointments.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
  }, [appointments, search]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) { showToast('Failed to update status', 'error'); return; }
    showToast('Appointment updated');
    fetchAppts();
  };

  const deleteAppt = async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) { showToast('Failed to delete appointment', 'error'); return; }
    showToast('Appointment deleted');
    fetchAppts();
  };

  return (
    <div>
      <PageHeader title="Appointments" description="Appointment requests from your contact page" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                filter === s ? 'bg-[#b90046] text-white' : 'bg-white border border-[#e1e5e5] text-[#687777] hover:border-[#b90046]/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5afb2]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-lg border border-[#d9ddde] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10 sm:w-64" />
          </div>
          <button onClick={() => setSortAsc(!sortAsc)} className="rounded-lg border border-[#e1e5e5] bg-white p-2.5 text-[#687777] transition hover:text-[#b90046]" title="Toggle sort"><ArrowUpDown size={16} /></button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState icon={CalIcon} title="No appointments found" message={search ? "Try a different search term." : "Appointment requests will appear here."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <table className="cms-table">
            <thead><tr><th>Name</th><th>Preferred date</th><th>Status</th><th>Requested</th><th></th></tr></thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id} className="cursor-pointer" onClick={() => setDetailAppt(appt)}>
                  <td className="font-medium">{appt.name}</td>
                  <td className="text-[#687777]">{appt.preferred_date ? new Date(appt.preferred_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td><Badge variant={statusVariants[appt.status]}>{appt.status}</Badge></td>
                  <td className="text-[#879195]">{new Date(appt.created_at).toLocaleDateString('en-GB')}</td>
                  <td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDeleteId(appt.id)} className="rounded-md p-1.5 text-[#a5afb2] transition hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!detailAppt}
        onClose={() => setDetailAppt(null)}
        title="Appointment details"
        size="lg"
        footer={
          detailAppt && (
            <div className="flex w-full items-center justify-between">
              <div className="w-48"><SelectField label="Status" value={detailAppt.status} onChange={(v) => { updateStatus(detailAppt.id, v); setDetailAppt({ ...detailAppt, status: v as Appointment['status'] }); }} options={statusOptions} /></div>
              <button onClick={() => setDeleteId(detailAppt.id)} className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-600"><Trash2 size={14} /> Delete</button>
            </div>
          )
        }
      >
        {detailAppt && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b90046] text-lg font-bold text-white">{detailAppt.name.charAt(0).toUpperCase()}</div>
              <div><p className="text-lg font-bold text-[#273237]">{detailAppt.name}</p><Badge variant={statusVariants[detailAppt.status]}>{detailAppt.status}</Badge></div>
            </div>
            <div className="grid gap-3 rounded-xl bg-[#f7f8f8] p-4">
              <a href={`mailto:${detailAppt.email}`} className="flex items-center gap-2 text-sm text-[#273237] hover:text-[#b90046]"><Mail size={16} className="text-[#687777]" /> {detailAppt.email}</a>
              <p className="flex items-center gap-2 text-sm text-[#273237]"><Phone size={16} className="text-[#687777]" /> {detailAppt.phone || 'No phone provided'}</p>
              {detailAppt.preferred_date && <p className="flex items-center gap-2 text-sm font-medium text-[#b90046]"><CalIcon size={16} /> {new Date(detailAppt.preferred_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              <p className="flex items-center gap-2 text-xs text-[#879195]"><Clock size={12} /> Requested {new Date(detailAppt.created_at).toLocaleString('en-GB')}</p>
            </div>
            {detailAppt.message && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">Message</p>
                <div className="rounded-xl border border-[#e1e5e5] p-4 text-sm leading-6 text-[#3b4246]">{detailAppt.message}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteAppt(deleteId); setDetailAppt(null); }}
        title="Delete appointment"
        message="Are you sure you want to permanently delete this appointment request?"
      />
    </div>
  );
}
