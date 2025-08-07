import { create } from 'zustand';

import { AuthState } from './types';

export const useAuthStore = create<AuthState>((set) => ({
  userInfo: null,
  setUserInfo: (data) => set({ userInfo: data }),
  removeUserInfo: () => set({ userInfo: null }),
}));
