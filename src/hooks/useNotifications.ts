import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { API_URL } from '../apiConfig'; // Adjust the path if necessary

export interface Notification {
  type: 'medication' | 'appointment';
  title: string;
  message: string;
  timestamp: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { session } = useAuth();

  const checkNotifications = async () => {
    if (!session) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (session) {
      // Check immediately
      checkNotifications();
      
      // Check every minute
      const interval = setInterval(checkNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotifications,
  };
};