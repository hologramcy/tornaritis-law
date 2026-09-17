import type { ReactNode } from 'react';

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  const styles = {
    neutral: 'bg-[#f0f3f3] text-[#687277]',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-[#fdf0f5] text-[#b90046]',
    info: 'bg-blue-50 text-blue-600',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${styles[variant]}`}>{children}</span>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#b90046]' : 'bg-[#d9ddde]'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
      {label && <span className="text-sm text-[#3b4246]">{label}</span>}
    </label>
  );
}

export function TextField({ label, hint, value, onChange, type = 'text', placeholder, required }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">{label}{required && <span className="text-[#b90046]"> *</span>}</span>
      {hint && <span className="block text-xs text-[#879195]">{hint}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 4, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#b90046] focus:ring-2 focus:ring-[#b90046]/10"
      />
    </label>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-sans text-2xl font-bold text-[#273237]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[#687277]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';
export function EmptyState({ icon: Icon, title, message }: { icon: LucideIcon; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9ddde] bg-white py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f3]"><Icon size={28} className="text-[#a5afb2]" /></div>
      <h3 className="font-sans text-base font-bold text-[#273237]">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-[#687277]">{message}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-white">
          <div className="skeleton h-full w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, type = 'button' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn-shine flex items-center gap-2 rounded-lg bg-[#b90046] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-[#d9ddde] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#687277] transition hover:border-[#b90046] hover:text-[#b90046]"
    >
      {children}
    </button>
  );
}
