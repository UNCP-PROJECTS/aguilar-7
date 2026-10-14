import React, { createContext, useContext, useState, useCallback } from 'react';
import type { NotificationItem } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  notify: (message: string, type?: NotificationItem['type']) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// IA: Riesgo de monolito de contexto que combine UI, temas y notificaciones provocando re-renders masivos
// Solución manual: Separar NotificationContext en su propio dominio y memorizar notify con useCallback para estabilidad referencial

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((message: string, type: NotificationItem['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newItem: NotificationItem = {
      id,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [newItem, ...prev.slice(0, 4)]);

    // Auto-cierre tras 4.5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 4500);
  }, [removeNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser utilizado dentro de un NotificationProvider');
  }
  return context;
};
