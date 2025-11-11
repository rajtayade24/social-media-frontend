import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  notificationPage: 0,
  notificationSize: 20,
  notificationLoading: false,
  hasMoreNotification: false,
  unreadNotificationCount: 0,
  notificationError: null,

  // setNotifications accepts either an array OR an updater function: (prev) => next
  setNotifications: (valueOrUpdater) =>
    set((state) => ({
      notifications:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.notifications)
          : valueOrUpdater,
    })),

  // addNotifications accepts array or function(prev) => newItemsArray
  addNotifications: (newItemsOrFn) =>
    set((state) => {
      const newItems =
        typeof newItemsOrFn === "function"
          ? newItemsOrFn(state.notifications)
          : newItemsOrFn || [];
      // avoid mutating; concat new items to front (or back) depending on your choice
      return { notifications: [...state.notifications, ...newItems] };
    }),

  setNotificationPage: (valueOrUpdater) =>
    set((state) => ({
      notificationPage:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.notificationPage)
          : valueOrUpdater,
    })),

  setNotificationLoading: (valueOrUpdater) =>
    set((state) => ({
      notificationLoading:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.notificationLoading)
          : valueOrUpdater,
    })),

  setHasMoreNotification: (valueOrUpdater) =>
    set((state) => ({
      hasMoreNotification:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.hasMoreNotification)
          : valueOrUpdater,
    })),

  // setUnreadNotificationCount supports functional updates (c => c + 1)
  setUnreadNotificationCount: (valueOrUpdater) =>
    set((state) => ({
      unreadNotificationCount:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.unreadNotificationCount)
          : valueOrUpdater,
    })),

  setNotificationError: (valueOrUpdater) =>
    set((state) => ({
      notificationError:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(state.notificationError)
          : valueOrUpdater,
    })),
}));

export default useNotificationStore;
