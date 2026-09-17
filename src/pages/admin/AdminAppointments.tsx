import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Appointment } from '@/lib/types';

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const fetchAppointments = async () => {
    setLoading(true);
    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setAppointments(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    await supabase.from('appointments').delete().eq('id', id);
    fetchAppointments();
  };

  const statuses = ['new', 'confirmed', 'completed', 'cancelled'] as const;

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
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[#687277]">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#687277]">No appointment requests found.</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="rounded-xl border border-[#e1e5e5] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-[#273237]">{appt.name}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        appt.status === 'new'
                          ? 'bg-[#fdf0f5] text-[#b90046]'
                          : 'bg-[#f0f3f3] text-[#687277]'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#687277]">{appt.email} · {appt.phone || 'No phone'}</p>
                  {appt.preferred_date && (
                    <p className="mt-2 text-sm font-medium text-[#b90046]">
                      Preferred: {new Date(appt.preferred_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {appt.message && <p className="mt-2 text-sm text-[#3b4246]">{appt.message}</p>}
                  <p className="mt-3 text-xs text-[#879195]">
                    {new Date(appt.created_at).toLocaleString('en-GB')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={appt.status}
                    onChange={(e) => updateStatus(appt.id, e.target.value)}
                    className="rounded-lg border border-[#d9ddde] bg-white px-3 py-2 text-xs outline-none transition focus:border-[#b90046]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteAppointment(appt.id)}
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
