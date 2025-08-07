import { create } from 'zustand';

import { FamilyGuardiansState } from './types';

export const useFamilyMembersState = create<FamilyGuardiansState>((set) => ({
  children: [],
  pets: [],
  isChildren: null,
  isPet: null,
  isCompletedFamilySection: false,
  updateChildren: (data) => set({ children: data }),
  updatePets: (data) => set({ pets: data }),
  setEntireFamily: ({
    children,
    pets,
    isChildren,
    isPet,
    isCompletedFamilySection,
  }) => set({ children, pets, isChildren, isPet, isCompletedFamilySection }),
  setIsChildren: (value) => set({ isChildren: value }),
  setIsPet: (value) => set({ isPet: value }),
  resetEntireFamily: () =>
    set({
      children: [],
      pets: [],
      isChildren: null,
      isPet: null,
      isCompletedFamilySection: false,
    }),
  setIsCompletedFamilySection: (value) =>
    set({ isCompletedFamilySection: value }),
}));
