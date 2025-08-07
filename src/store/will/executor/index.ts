import { create } from 'zustand';

import { ExecutorsState } from './types';

export const useExecutorsState = create<ExecutorsState>((set) => ({
  primaryExecutor: null,
  backupExecutor: null,
  compensation: null,
  specialWishes: '',
  isWishes: null,
  isNotarization: null,
  isSelfProvingAffidavit: null,
  isCompletedExecutorsSection: false,
  setIsCompletedExecutorsSection: (value) =>
    set({ isCompletedExecutorsSection: value }),
  setPrimaryExecutor: (data) => set({ primaryExecutor: data }),
  setBackupExecutor: (data) => set({ backupExecutor: data }),
  setCompensation: (data) => set({ compensation: data }),
  setWishesData: ({
    specialWishes,
    isWishes,
    isNotarization,
    isSelfProvingAffidavit,
  }) =>
    set({ isWishes, specialWishes, isNotarization, isSelfProvingAffidavit }),
  setEntireExecutorsState: ({
    backupExecutor,
    compensation,
    isWishes,
    primaryExecutor,
    specialWishes,
    isNotarization,
    isSelfProvingAffidavit,
    isCompletedExecutorsSection,
  }) =>
    set({
      primaryExecutor,
      backupExecutor,
      isWishes,
      compensation,
      specialWishes: specialWishes || '',
      isNotarization,
      isSelfProvingAffidavit,
      isCompletedExecutorsSection,
    }),
  resetEntireExecutorsState: () =>
    set({
      primaryExecutor: null,
      backupExecutor: null,
      compensation: null,
      specialWishes: '',
      isWishes: null,
      isNotarization: null,
      isSelfProvingAffidavit: null,
      isCompletedExecutorsSection: false,
    }),
}));
