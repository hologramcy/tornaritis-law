import { useEffect, useState } from 'react';
import { Calendar, FileText, Inbox, Mail, Newspaper, TrendingUp, Users, ArrowRight, Plus, Briefcase, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/admin/Fields';
import { Badge } from '@/components/admin/Fields';

type AdminTab = 'dashboard' | 'leads' | 'appointments' | 'content' | 'practice' | 'team' | 'newsroom' | 'newsletter' | 'settings';

type DashboardProps = {
  onNavigate: (tab: AdminTab) => void;
};

type Stats = { newLeads: number; totalLeads: number; appointments: number; posts: number; practiceAreas: number; teamMembers: number; subscribers: number };

type ActivityItem = { id: string; type: 'lead' | 'appointment' | 'newsletter'; name: string; detail: string; created_at: string };

export function AdminDashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({ newLeads: 0, totalLeads: 0, appointments: 0, posts: 0, practiceAreas: 0, teamMembers: 0, subscribers: 0 });
  const [recentLeads, setRecentLeads] = useState<{ id: string; name: string; email: string; status: string; created_at: string }[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [leads, appointments, posts, areas, team, subs, recent, recentAppts, recentSubs] = await Promise.all([
        supabase.from('form_submissions').select('status'),
        supabase.from('appointments').select('status').eq('status', 'new'),
        supabase.from('newsroom_posts').select('id'),
        supabase.from('practice_areas').select('id'),
        supabase.from('team_members').select('id'),
        supabase.from('newsletter_subscribers').select('id'),
        supabase.from('form_submissions').select('id, name, email, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('appointments').select('id, name, preferred_date, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('newsletter_subscribers').select('id, email, created_at').order('created_at', { ascending: false }).limit(3),
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
      setRecentLeads(recent.data ?? []);

      const items: ActivityItem[] = [
        ...(recentAppts.data ?? []).map((a) => ({ id: a.id, type: 'appointment' as const, name: a.name, detail: a.preferred_date ? `Preferred: ${new Date(a.preferred_date).toLocaleDateString('en-GB')}` : 'No date specified', created_at: a.created_at })),
        ...(recentSubs.data ?? []).map((s) => ({ id: s.id, type: 'newsletter' as const, name: s.email, detail: 'Newsletter signup', created_at: s.created_at })),
        ...(recent.data ?? []).map((l) => ({ id: l.id, type: 'lead' as const, name: l.name, detail: l.email, created_at: l.created_at })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
      setActivity(items);
    };
    fetchAll();
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

  const quickActions: { label: string; icon: typeof Plus; tab: AdminTab }[] = [
    { label: 'New article', icon: Newspaper, tab: 'newsroom' },
    { label: 'Add practice area', icon: Briefcase, tab: 'practice' },
    { label: 'Add team member', icon: Users, tab: 'team' },
    { label: 'Edit content', icon: FileText, tab: 'content' },
  ];

  const activityIcons = { lead: Inbox, appointment: Calendar, newsletter: Mail };
  const activityLabels = { lead: 'New lead', appointment: 'Appointment request', newsletter: 'Newsletter signup' };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2e35] to-[#0f1113] p-8 text-white">
        <p className="text-sm text-white/60">Welcome back to your dashboard</p>
        <h2 className="mt-2 font-serif text-3xl">Tornaritis Law Firm</h2>
        <p className="mt-2 max-w-md text-sm text-white/50">Manage your website content, review leads and appointments, and keep your newsroom up to date.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <button key={card.label} onClick={() => onNavigate(card.tab)} className="card-lift group relative overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white p-6 text-left">
            {card.highlight && card.value > 0 && <span className="absolute right-4 top-4 h-2.5 w-2.5 animate-pulse-glow rounded-full bg-[#b90046]" />}
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${card.highlight ? 'bg-[#b90046] text-white' : 'bg-[#f0f3f3] text-[#687777] group-hover:bg-[#fdf0f5] group-hover:text-[#b90046]'}`}>
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="mt-4 font-serif text-4xl text-[#273237]">{card.value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.1em] text-[#687777]">{card.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent leads table */}
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <div className="flex items-center justify-between border-b border-[#e1e5e5] px-6 py-4">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#273237]">Recent enquiries</h3>
            <button onClick={() => onNavigate('leads')} className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#b90046] transition-opacity hover:opacity-70">View all <ArrowRight size={13} /></button>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-[#687777]">No enquiries yet.</p>
          ) : (
            <div className="divide-y divide-[#eef0f0]">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#fafbfb]" onClick={() => onNavigate('leads')}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3f3] text-xs font-bold text-[#687777]">{lead.name.charAt(0).toUpperCase()}</div>
                    <div><p className="text-sm font-medium text-[#273237]">{lead.name}</p><p className="text-xs text-[#879195]">{lead.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={lead.status === 'new' ? 'danger' : 'neutral'}>{lead.status.replace('_', ' ')}</Badge>
                    <span className="text-xs text-[#879195]">{new Date(lead.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: quick actions + activity */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e1e5e5] bg-white p-5">
            <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#273237]">Quick actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => onNavigate(action.tab)} className="flex flex-col items-center gap-2 rounded-xl border border-[#e1e5e5] p-4 text-center transition-all hover:border-[#b90046]/30 hover:shadow-sm">
                  <action.icon size={20} className="text-[#b90046]" />
                  <span className="text-xs font-semibold text-[#273237]">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
            <h3 className="border-b border-[#e1e5e5] px-5 py-4 font-sans text-sm font-bold uppercase tracking-[0.12em] text-[#273237]">Recent activity</h3>
            {activity.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#687777]">No activity yet.</p>
            ) : (
              <div className="divide-y divide-[#eef0f0]">
                {activity.map((item) => {
                  const Icon = activityIcons[item.type];
                  return (
                    <div key={`${item.type}-${item.id}`} className="flex items-start gap-3 px-5 py-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f3f3]"><Icon size={15} className="text-[#687777]" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#273237]">{item.name}</p>
                        <p className="text-xs text-[#879195]">{activityLabels[item.type]} · {item.detail}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#a5afb2]"><Clock size={10} /> {new Date(item.created_at).toLocaleString('en-GB')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
