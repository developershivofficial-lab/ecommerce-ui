import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-yellow-200 shadow-xl shadow-amber-500/10 text-zinc-800"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-zinc-600" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-zinc-900">{toast.title}</p>
              {toast.message && (
                <p className="text-zinc-600 text-xs mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
