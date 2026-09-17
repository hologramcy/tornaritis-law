import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
};

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete' }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-[#d9ddde] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#687277] transition hover:bg-[#f0f3f3]">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-600">{confirmLabel}</button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50"><AlertTriangle size={24} className="text-red-500" /></div>
        <div>
          <p className="text-sm leading-6 text-[#3b4246]">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
