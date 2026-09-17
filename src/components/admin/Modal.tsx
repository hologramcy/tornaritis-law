import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
};

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div
        className={`relative my-auto w-full ${size === 'lg' ? 'max-w-3xl' : 'max-w-xl'} animate-scale-in rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e1e5e5] px-6 py-4">
          <h3 className="font-sans text-lg font-bold text-[#273237]">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-[#687277] transition-colors hover:bg-[#f0f3f3] hover:text-[#273237]"><X size={20} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-[#e1e5e5] px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
