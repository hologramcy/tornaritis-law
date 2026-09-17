import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function emit() { listeners.forEach((l) => l([...currentToasts])); }

export function showToast(message: string, type: Toast['type'] = 'success') {
  const id = ++toastId;
  currentToasts = [...currentToasts, { id, message, type }];
  emit();
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { const i = listeners.indexOf(setToasts); if (i >= 0) listeners.splice(i, 1); };
  }, []);

  const remove = useCallback((id: number) => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    emit();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg animate-slide-right"
          style={{ borderColor: t.type === 'error' ? '#fca5a5' : t.type === 'info' ? '#c7ced0' : '#a7e8c0' }}
        >
          {t.type === 'error' ? <AlertCircle size={18} className="text-red-500" /> : t.type === 'info' ? <Info size={18} className="text-blue-500" /> : <CheckCircle2 size={18} className="text-green-500" />}
          <span className="text-sm font-medium text-[#273237]">{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 text-[#879195] hover:text-[#273237]"><X size={15} /></button>
        </div>
      ))}
    </div>
  );
}
