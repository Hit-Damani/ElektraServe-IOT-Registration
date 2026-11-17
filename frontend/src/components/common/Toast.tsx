import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-rose-50 border-rose-300 text-rose-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-2 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 rounded p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
