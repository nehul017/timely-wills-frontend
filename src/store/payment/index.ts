import { create } from 'zustand';

import { Prices } from '@/constant/will';

import { Amount } from './types';

export const useAmountStore = create<Amount>((set) => ({
  willAmount: Prices.MY_PLAN,
  discount: 0,
  isSubscription: false,
  updateIsSubscription: (val) => set({ isSubscription: val }),
  setDiscount: (val) => set({ discount: val }),
  updateWillAmount: (val) => set({ willAmount: val }),
}));
