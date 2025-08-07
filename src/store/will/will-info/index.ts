import { create } from 'zustand';

import { WillInfoState } from './types';

export const useWillInfoState = create<WillInfoState>((set) => ({
  willId: 0,
  willUrl: null,
  setWillId: (id) => set({ willId: id }),
  setWillUrl: (url) => set({ willUrl: url }),
  setEntireWillInfo: (willId, willUrl) => set({ willId, willUrl }),
  resetEntireWillInfo: () => set({ willId: 0, willUrl: null }),
}));
