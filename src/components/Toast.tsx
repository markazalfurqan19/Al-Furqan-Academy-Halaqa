import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#D4AF37] flex items-center gap-3 text-xs font-bold max-w-md">
        <CheckCircle2 className="w-4 h-4 text-[#E9C46A] shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
