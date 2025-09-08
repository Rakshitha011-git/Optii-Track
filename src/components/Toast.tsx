import React, { useState, useEffect } from 'react';
import { X, Pill, Calendar } from 'lucide-react'; // Changed Eye to Pill for better context
import { useNotifications } from '../hooks/useNotifications';

const Toast: React.FC = () => {
  const { notifications, clearNotifications } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      setVisibleNotifications(notifications);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisibleNotifications([]);
        clearNotifications();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, clearNotifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      {visibleNotifications.map((notification, index) => (
        <div
          key={index}
          // Glassmorphism card with glowing edge based on notification type
          className={`relative overflow-hidden backdrop-blur-lg bg-slate-800/50 border rounded-2xl shadow-lg shadow-black/30 p-4 max-w-sm w-full animate-slide-in transition-all duration-300 ${
            notification.type === 'medication' 
              ? 'border-cyan-400/50' 
              : 'border-emerald-400/50'
          }`}
        >
          <div className="flex items-start">
            {/* Glowing Icon Container */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              notification.type === 'medication' 
                ? 'bg-cyan-500/20 shadow-cyan-500/30' 
                : 'bg-emerald-500/20 shadow-emerald-500/30'
            }`}>
              {notification.type === 'medication' ? (
                <Pill className="w-5 h-5 text-cyan-300" />
              ) : (
                <Calendar className="w-5 h-5 text-emerald-300" />
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-slate-100">
                {notification.title}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {notification.message}
              </p>
            </div>
            
            {/* Themed Close Button */}
            <button
              onClick={() => {
                setVisibleNotifications([]);
                clearNotifications();
              }}
              className="ml-3 flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors duration-200"
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtle glowing bar at the bottom for extra flair */}
          <div className={`absolute bottom-0 left-0 h-1 w-full opacity-50 ${
              notification.type === 'medication' 
              ? 'bg-cyan-400' 
              : 'bg-emerald-400'
          }`} style={{ filter: 'blur(5px)'}}></div>
        </div>
      ))}
    </div>
  );
};

export default Toast;