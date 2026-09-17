import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogOut, User, Mail, Shield, Globe, Info } from 'lucide-react';
import { PageHeader, PrimaryButton, Badge } from '@/components/admin/Fields';
import { showToast } from '@/components/admin/Toast';

type SettingsProps = {
  session: Session;
  adminName: string;
  onSignOut: () => void;
};

const locales = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'el', label: 'Ελληνικά', flag: 'EL' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'ru', label: 'Русский', flag: 'RU' },
];

export function AdminSettings({ session, adminName, onSignOut }: SettingsProps) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    onSignOut();
  };

  return (
    <div>
      <PageHeader title="Settings" description="Account information and system configuration" />

      <div className="max-w-2xl space-y-6">
        {/* Account info */}
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <div className="border-b border-[#e1e5e5] bg-[#f7f8f8] px-5 py-3">
            <h3 className="font-sans text-sm font-bold text-[#273237]">Account</h3>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b90046] text-lg font-bold text-white">{adminName.charAt(0).toUpperCase()}</div>
              <div>
                <p className="flex items-center gap-2 font-medium text-[#273237]"><User size={16} className="text-[#687777]" /> {adminName}</p>
                <p className="flex items-center gap-2 text-sm text-[#687777]"><Mail size={14} /> {session.user.email}</p>
              </div>
              <div className="ml-auto"><Badge variant="danger"><Shield size={11} /> Administrator</Badge></div>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <div className="border-b border-[#e1e5e5] bg-[#f7f8f8] px-5 py-3">
            <h3 className="flex items-center gap-2 font-sans text-sm font-bold text-[#273237]"><Globe size={15} /> Active Languages</h3>
          </div>
          <div className="p-5">
            <p className="mb-4 text-sm text-[#687777]">Your website supports the following languages. Manage translations under Site Content.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {locales.map((l) => (
                <div key={l.code} className="flex items-center gap-3 rounded-xl border border-[#e1e5e5] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f3f3] text-xs font-bold text-[#687777]">{l.flag}</span>
                  <div><p className="text-sm font-medium text-[#273237]">{l.label}</p><Badge variant="success">Active</Badge></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="overflow-hidden rounded-2xl border border-[#e1e5e5] bg-white">
          <div className="border-b border-[#e1e5e5] bg-[#f7f8f8] px-5 py-3">
            <h3 className="flex items-center gap-2 font-sans text-sm font-bold text-[#273237]"><Info size={15} /> System</h3>
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#687777]">Platform</span><span className="font-medium text-[#273237]">Bolt CMS</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#687777]">Database</span><span className="font-medium text-[#273237]">Supabase (PostgreSQL)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#687777]">Storage</span><span className="font-medium text-[#273237]">Supabase Storage</span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-white">
          <div className="border-b border-red-200 bg-red-50 px-5 py-3">
            <h3 className="font-sans text-sm font-bold text-red-700">Session</h3>
          </div>
          <div className="flex items-center justify-between p-5">
            <p className="text-sm text-[#687777]">Sign out of your admin account on this device.</p>
            <PrimaryButton onClick={handleSignOut} disabled={signingOut}><LogOut size={15} /> {signingOut ? 'Signing out...' : 'Sign out'}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
