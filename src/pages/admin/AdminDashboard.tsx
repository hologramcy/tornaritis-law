import { useEffect, useState } from 'react';
import { Calendar, FileText, Inbox, Mail, Newspaper, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AdminTab = 'dashboard' | 'leads' | 'appointments' | 'content' | 'practice' | 'team' | 'newsroom' | 'newsletter' | 'settings';

type DashboardProps = {
  onNavigate: (tab: AdminTab) => void;
};

type Stats = {
  newLeads: number;
  totalLeads: number;
  appointments: number;
  posts: number;
  practiceAreas: number;
  teamMembers: number;
  subscribers: number;
};

export function AdminDashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    newLeads: 0,
    totalLeads: 0,
    appointments: 0,
    posts: 0,
    practiceAreas: 0,
    teamMembers: 0,
    subscribers: 0,
  });
  const [recentLeads, setRecentLeads] = useState<{ id: string; name: string; email: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [leads, appointments, posts, areas, team, subs] = await Promise.all([
        supabase.from('form_submissions').select('status'),
        supabase.from('appointments').select('status').eq('status', 'new'),
        supabase.from('newsroom_posts').select('id'),
        supabase.from('practice_areas').select('id'),
        supabase.from('team_members').select('id'),
        supabase.from('newsletter_subscribers').select('id'),
      ]);

      const leadList = leads.data ?? [];
      setStats({
        newLeads: leadList.filter((l) => l.status === 'new').length,
        totalLeads: leadList.length,
        appointments: appointments.data?.length ?? 0,
        posts: posts.data?.length ?? 0,
        practiceAreas: areas.data?.length ?? 0,
        teamMembers: team.data?.length ?? 0,
        subscribers: subs.data?.length ?? 0,
      });

      const { data: recent } = await supabase
        .from('form_submissions')
        .select('id, name, email, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentLeads(recent ?? []);
    };
    fetchStats();
  }, []);

  const cards: { label: string; value: number; icon: typeof Inbox; tab: AdminTab; highlight?: boolean }[] = [
    { label: 'New leads', value: stats.newLeads, icon: Inbox, tab: 'leads', highlight: true },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, tab: 'appointments', highlight: true },
    { label: 'Total enquiries', value: stats.totalLeads, icon: TrendingUp, tab: 'leads' },
    { label: 'Newsroom posts', value: stats.posts, icon: Newspaper, tab: 'newsroom' },
    { label: 'Practice areas', value: stats.practiceAreas, icon: FileText, tab: 'practice' },
    { label: 'Team members', value: stats.teamMembers, icon: Users, tab: 'team' },
    { label: 'Newsletter subs', value: stats.subscribers, icon: Mail, tab: 'newsletter' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#1a2e35] to-[#0f1113] p-8 text-white">
        <p className="text-sm text-white/60">Welcome back to your dashboard</p>
        <h2 className="mt-2 font-serif text-3xl">Tornaritis Law Firm</h2>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Manage your website content, review leads and appointments, and keep your newsroom up to date — all in one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.tab)}
            className="card-lift group relative overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white p-6 text-left"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {card.highlight && card.value > 0 && (
              <span className="absolute right-4 top-4 h-2.5 w-2.5 animate-pulse-glow rounded-full bg-[#b90046]" />
            )}
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              card.highlight ? 'bg-[#b90046] text-white' : 'bg-[#f0f3f3] text-[#687277] group-hover:bg-[#fdf0f5] group-hover:text-[#b90046]'
            }`}>
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="mt-4 font-serif text-4xl text-[#273237]">{card.value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.1em] text-[#687277]">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Recent leads */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
        <div className="flex items-center justify-between border-b border-[#e1e5e5] px-6 py-4">
          <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#273237]">Recent enquiries</h2>
          <button
            onClick={() => onNavigate('leads')}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#b90046] transition-opacity hover:opacity-70"
          >
            View all <ArrowRight size={13} />
          </button>
        </div>
        {recentLeads.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[#687277]">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-[#eef0f0]">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#fafbfb]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3f3] text-xs font-bold text-[#687277]">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#273237]">{lead.name}</p>
                    <p className="text-xs text-[#879195]">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                      lead.status === 'new'
                        ? 'bg-[#fdf0f5] text-[#b90046]'
                        : 'bg-[#f0f3f3] text-[#687277]'
                    }`}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#879195]">
                    {new Date(lead.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
