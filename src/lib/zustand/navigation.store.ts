import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationStoreState {
  isSidebarOpen: boolean;
  activeMenu: string;
}

interface NavigationStoreActions {
  toggleSidebar: () => void;
  setActiveMenu: (menu: string) => void;
}

interface NavigationStore extends NavigationStoreState, NavigationStoreActions {}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({
          ...state,
          isSidebarOpen: !state.isSidebarOpen,
        })),
      activeMenu: '/dashboard/home',
      setActiveMenu: (menu) =>
        set((state) => ({
          ...state,
          activeMenu: menu,
        })),
    }),
    {
      name: 'navigation',
    },
  ),
);
