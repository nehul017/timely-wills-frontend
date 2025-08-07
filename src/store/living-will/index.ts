import { create } from 'zustand';

import { LivingWillWishesForm } from '@/types';

import { LivingWillState, SpecificWishes } from './types';

export const useLivingWillWishesStore = create<LivingWillState>((set) => ({
  url: null,
  livingWillId: 0,
  wishes: {
    isAuthorizePainAlleviationTreatment: null,
    isPermanentArtificialNutritionHydration: null,
    isPermanentLifeSustainingMeasures: null,
    isTerminalArtificialNutritionHydration: null,
    isTerminalLifeSustainingMeasures: null,
  },

  specificWishes: {
    isOrganDonation: null,
    endOfLifeCareLocation: '',
    additionalWishes: null,
    isAdditionalWishes: undefined,
  },

  updateSpecificWishes: (data: SpecificWishes) =>
    set((state) => ({
      specificWishes: {
        ...state.specificWishes,
        ...data,
      },
    })),

  updateWishes: (data: LivingWillWishesForm) =>
    set((state) => ({
      wishes: {
        ...state.wishes,
        ...data,
      },
    })),

  setLivingWillId: (id) => set({ livingWillId: id }),

  setEntireLivingWill: (data) =>
    set({
      url: data.url,
      livingWillId: data.id,
      wishes: {
        isAuthorizePainAlleviationTreatment: data.doYouConserntToEuthanasia,
        isPermanentArtificialNutritionHydration:
          data.permanentCondition?.doYouWantArtificialNutritionAndHydration ??
          null,
        isPermanentLifeSustainingMeasures:
          data.permanentCondition?.doYouWantLifeSustainingMeasures ?? null,
        isTerminalArtificialNutritionHydration:
          data.terminalCondition?.doYouWantArtificialNutritionAndHydration ??
          null,
        isTerminalLifeSustainingMeasures:
          data.terminalCondition?.doYouWantLifeSustainingMeasures ?? null,
      },
      specificWishes: {
        isOrganDonation: data.doYouWantDonateOrgans,
        endOfLifeCareLocation: data.whereIWantReceveEndOfLife || '',
        additionalWishes: data.OtherWishes,
        isAdditionalWishes: !!data.OtherWishes,
      },
    }),
  updateUrl: (url) => set({ url }),
  resetEntireLivingWill: () =>
    set({
      url: null,
      livingWillId: 0,
      wishes: {
        isAuthorizePainAlleviationTreatment: null,
        isPermanentArtificialNutritionHydration: null,
        isPermanentLifeSustainingMeasures: null,
        isTerminalArtificialNutritionHydration: null,
        isTerminalLifeSustainingMeasures: null,
      },

      specificWishes: {
        isOrganDonation: null,
        endOfLifeCareLocation: '',
        additionalWishes: null,
        isAdditionalWishes: undefined,
      },
    }),
}));
