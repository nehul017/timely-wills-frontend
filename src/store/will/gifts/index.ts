import { create } from 'zustand';

import { GiftsState } from './types';

export const useGiftsState = create<GiftsState>((set) => ({
  isGifts: null,
  selectedGiftId: '',
  beneficiaryForGift: [],
  isCompletedGiftsSection: false,
  setIsCompletedGiftsSection: (value) =>
    set({ isCompletedGiftsSection: value }),
  setIsGifts: (value) => set({ isGifts: value }),
  addBeneficiary: (data) =>
    set((state) => ({
      beneficiaryForGift: [
        ...state.beneficiaryForGift.filter(
          (item) => item.giftId !== data.giftId,
        ),
        data,
      ],
    })),
  deleteBeneficiary: (id) =>
    set((state) => ({
      beneficiaryForGift: state.beneficiaryForGift.filter(
        (item) => item.giftId !== id,
      ),
    })),
  setSelectedGiftId: (id) => set({ selectedGiftId: id }),
  setEntireBeneficiaryForGift: ({
    beneficiaryForGift,
    isGifts,
    isCompletedGiftsSection,
  }) => set({ beneficiaryForGift, isGifts, isCompletedGiftsSection }),
  resetEntireBeneficiaryForGift: () =>
    set({
      isGifts: null,
      selectedGiftId: '',
      beneficiaryForGift: [],
      isCompletedGiftsSection: false,
    }),
  removeAllGifts: () => set({ beneficiaryForGift: [] }),
}));
