import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/toastSlice.js';
import { CheckCircle2, XCircle, Info, AlertOctagon, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-sage shrink-0 stroke-[2.5]" />,
  error:   <XCircle className="w-5 h-5 text-clay shrink-0 stroke-[2.5]" />,
  info:    <Info className="w-5 h-5 text-accent shrink-0 stroke-[2.5]" />,
  warning: <AlertOctagon className="w-5 h-5 text-accent shrink-0 stroke-[2.5]" />,
};

const BORDER = {
  success: 'border-sage/40 hover:border-sage/60',
  error:   'border-clay/40 hover:border-clay/60',
  info:    'border-accent/40 hover:border-accent/60',
  warning: 'border-accent/40 hover:border-accent/60',
};

const Toast = ({ toast }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-md border ${
        BORDER[toast.type] || BORDER.info
      } shadow-[0_12px_40px_rgba(27,39,39,0.08)] text-[11px] font-extrabold uppercase tracking-widest text-primary animate-[slideInRight_0.35s_cubic-bezier(0.16,1,0.3,1)] max-w-sm w-full transition-all duration-300 relative overflow-hidden`}
    >
      {/* Visual left accent bar matching brand style */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          toast.type === 'success' ? 'bg-sage' : toast.type === 'error' ? 'bg-clay' : 'bg-accent'
        }`}
      />
      
      {ICONS[toast.type] || ICONS.info}
      <span className="flex-1 leading-relaxed pl-1">{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 rounded-lg text-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector((state) => state.toast.toasts);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end font-outfit">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
