import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/notificationStore';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Bell
} from 'lucide-react';
import { clsx } from 'clsx';

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotificationStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-success" size={20} />;
      case 'error': return <AlertCircle className="text-danger" size={20} />;
      case 'warning': return <AlertCircle className="text-warning" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] space-y-4 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pointer-events-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-4">
              <div className="shrink-0 pt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">{n.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="shrink-0 p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-300 hover:text-slate-500"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
