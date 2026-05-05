import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now();
    const newNotif = { ...notification, id, read: false };
    
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 20) // Keep last 20
    }));

    // If it's a toast type, we can handle it separately if we want, 
    // but for now let's just use the notifications list.
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }
}));
