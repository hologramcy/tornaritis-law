import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, ShieldCheck } from 'lucide-react';

type AuthPanelProps = {
  onSignedIn: () => void;
};

export function AdminAuthPanel({ onSignedIn }: AuthPanelProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootstrapMsg, setBootstrapMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBootstrapMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        if (data.user) {
          const { data: result } = await supabase.rpc('bootstrap_first_admin', {
            p_display_name: displayName || 'Administrator',
          });
          if (result === true) {
            setBootstrapMsg('Admin account created. You now have full access.');
          } else {
            setBootstrapMsg('Account created. An admin will grant you access.');
          }
        }
        onSignedIn();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onSignedIn();
      }
    } catch {
      setError('Could not sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1113] px-6">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#b90046]/10" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-[#b90046]/10" />
      <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full border border-white/5" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <img
            src="/Tornaritis-Law-Firm-Logo-Revised.png"
            alt="Tornaritis Law Firm"
            className="mx-auto h-auto w-[200px] brightness-0 invert"
          />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#b90046]/20 bg-[#b90046]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#df8eae]">
            <ShieldCheck size={14} /> Admin Dashboard
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-6 flex gap-1 rounded-lg bg-[#f0f3f3] p-1">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                mode === 'signin' ? 'bg-white text-[#b90046] shadow-sm' : 'text-[#687277]'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                mode === 'signup' ? 'bg-white text-[#b90046] shadow-sm' : 'text-[#687777]'
              }`}
            >
              Create account
            </button>
          </div>

          {bootstrapMsg && (
            <div className="mb-5 rounded-xl border border-[#b90046] bg-[#fdf0f5] px-4 py-3 text-sm text-[#930038] animate-scale-in">
              {bootstrapMsg}
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
                Display name
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
                />
              </label>
            )}
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              Password
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-lg bg-[#b90046] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 disabled:opacity-50"
            >
              <LogIn size={16} />
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="mt-5 rounded-lg bg-[#f7f8f8] px-4 py-3 text-xs leading-5 text-[#879195]">
              The first account created becomes the firm administrator with full access. Subsequent accounts require
              an admin to grant access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
