import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto p-3 rounded border shadow-md flex items-start justify-between gap-2 text-xs transition-all ${
            n.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-900'
              : n.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : n.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div>
            <p className="font-semibold">{n.message}</p>
            <span className="text-[10px] text-slate-500 block mt-0.5">{n.timestamp}</span>
          </div>
          <button
            type="button"
            onClick={() => removeNotification(n.id)}
            className="text-slate-500 hover:text-slate-800 cursor-pointer p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
