import { create } from 'zustand';

import { HealthCareState } from './types';

export const useHealthCareStore = create<HealthCareState>((set) => ({
  id: null,
  url: null,
  setHealthCare: ({ id, url }) => set({ id, url }),
  resetHealthCare: () => set({ id: null, url: null }),
}));
