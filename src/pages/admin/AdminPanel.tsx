import { useState, useEffect, useCallback } from 'react';
import {
  FileText, Inbox, LayoutDashboard, LogOut, Mail, Newspaper,
  Settings as SettingsIcon, Users, Briefcase, Calendar, ExternalLink, Menu, X,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminLeads } from '@/pages/admin/AdminLeads';
import { AdminContent } from '@/pages/admin/AdminContent';
import { AdminPracticeAreas } from '@/pages/admin/AdminPracticeAreas';
import { AdminTeam } from '@/pages/admin/AdminTeam';
import { AdminNewsroom } from '@/pages/admin/AdminNewsroom';
import { AdminNewsletter } from '@/pages/admin/AdminNewsletter';
import { AdminAppointments } from '@/pages/admin/AdminAppointments';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { ToastContainer } from '@/components/admin/Toast';
import { navigateTo } from '@/lib/router';

export type AdminTab = 'dashboard' | 'leads' | 'appointments' | 'content' | 'practice' | 'team' | 'newsroom' | 'newsletter' | 'settings';

type AdminPanelProps = {
  session: Session;
  onSignOut: () => void;
};

const navItems: { key: AdminTab; label: string; icon: typeof Inbox; group: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { key: 'leads', label: 'Leads', icon: Inbox, group: 'Inbox' },
  { key: 'appointments', label: 'Appointments', icon: Calendar, group: 'Inbox' },
  { key: 'newsletter', label: 'Newsletter', icon: Mail, group: 'Inbox' },
  { key: 'content', label: 'Site Content', icon: SettingsIcon, group: 'Content' },
  { key: 'practice', label: 'Practice Areas', icon: Briefcase, group: 'Content' },
  { key: 'team', label: 'Team Members', icon: Users, group: 'Content' },
  { key: 'newsroom', label: 'Newsroom', icon: Newspaper, group: 'Content' },
  { key: 'settings', label: 'Settings', icon: FileText, group: 'System' },
];

const groups = ['Overview', 'Inbox', 'Content', 'System'];

export function AdminPanel({ session, onSignOut }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase
        .from('admin_users')
        .select('display_name, role')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data) { setIsAdmin(true); setAdminName(data.display_name); }
      setChecking(false);
    };
    checkAdmin();
  }, [session.user.id]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    onSignOut();
  }, [onSignOut]);

  const handleNavigate = (key: AdminTab) => {
    setTab(key);
    setSidebarOpen(false);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1113] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#b90046]" />
          <p className="text-sm uppercase tracking-[0.2em] text-[#df8eae]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1113] px-6 text-center text-white">
        <div className="max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#b90046]/30">
            <SettingsIcon size={28} className="text-[#b90046]" />
          </div>
          <p className="font-serif text-3xl">Access denied</p>
          <p className="mt-4 text-sm leading-6 text-white/50">Your account does not have admin access. Please contact the firm administrator.</p>
          <button onClick={handleSignOut} className="mt-8 rounded-lg border border-[#df8eae] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#f5c4d5] transition-colors hover:bg-[#df8eae] hover:text-[#0f1113]">Sign out</button>
        </div>
      </div>
    );
  }

  const sidebar = (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#e1e5e5] bg-white">
      <div className="border-b border-[#e1e5e5] px-5 py-5">
        <button onClick={() => navigateTo('/')} className="block">
          <img src="/Tornaritis-Law-Firm-Logo-Revised.png" alt="Tornaritis Law Firm" className="h-auto w-[150px]" />
        </button>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b90046]">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-1">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a5afb2]">{group}</p>
            {navItems.filter((n) => n.group === group).map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  tab === item.key ? 'bg-[#fdf0f5] text-[#b90046] shadow-sm' : 'text-[#4d585d] hover:bg-[#f7f8f8] hover:text-[#b90046]'
                }`}
              >
                <item.icon size={17} /> {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-[#e1e5e5] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b90046] text-sm font-bold text-white">{adminName.charAt(0).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#273237]">{adminName}</p>
            <p className="truncate text-xs text-[#879195]">{session.user.email}</p>
          </div>
          <button onClick={handleSignOut} className="rounded-md p-2 text-[#687277] transition-colors hover:bg-[#f7f8f8] hover:text-[#b90046]" aria-label="Sign out"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f8f8]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}</div>
        </>
      )}

      {/* Main */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e1e5e5] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-[#687277] hover:bg-[#f0f3f3] lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <h1 className="font-sans text-base font-bold text-[#273237] sm:text-lg">{navItems.find((n) => n.key === tab)?.label}</h1>
          </div>
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 rounded-lg border border-[#e1e5e5] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#687777] transition-colors hover:border-[#b90046] hover:text-[#b90046] sm:px-4"
          >
            <span className="hidden sm:inline">View site</span> <ExternalLink size={13} />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          {tab === 'dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
          {tab === 'leads' && <AdminLeads />}
          {tab === 'appointments' && <AdminAppointments />}
          {tab === 'content' && <AdminContent />}
          {tab === 'practice' && <AdminPracticeAreas />}
          {tab === 'team' && <AdminTeam />}
          {tab === 'newsroom' && <AdminNewsroom />}
          {tab === 'newsletter' && <AdminNewsletter />}
          {tab === 'settings' && <AdminSettings session={session} adminName={adminName} onSignOut={handleSignOut} />}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
