import { create } from 'zustand';

import { EstateState } from './types';

export const useEstateState = create<EstateState>((set) => ({
  beneficiaries: [],
  isExclusions: null,
  exclusions: [],
  beneficiary: null,
  isCompletedEstateSection: false,
  setIsCompletedEstateSection: (value) =>
    set({ isCompletedEstateSection: value }),
  addBeneficiaries: (data) =>
    set((state) => ({ beneficiaries: [...state.beneficiaries, data] })),
  updateBeneficiaries: (data) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.map((item) =>
        item.id === data.id ? data : item,
      ),
    })),
  deleteBeneficiary: (id) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.filter((item) => item.id !== id),
    })),
  setEntireBeneficiaries: (data) => set({ beneficiaries: data }),
  setBeneficiaryToUpdate: (data) => set({ beneficiary: data }),
  updateExclusions: (exclusions, isExclusions) =>
    set({ exclusions, isExclusions }),
  setEntireEstate: ({
    beneficiaries,
    exclusions,
    isExclusions,
    isCompletedEstateSection,
  }) =>
    set({ beneficiaries, isExclusions, exclusions, isCompletedEstateSection }),
  resetEntireEstate: () =>
    set({
      beneficiaries: [],
      isExclusions: null,
      exclusions: [],
      beneficiary: null,
      isCompletedEstateSection: false,
    }),
}));
