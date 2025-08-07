import { LivingWillGetResponse } from '@/services/living-will/types';
import { LivingWillWishesForm } from '@/types';

export interface Wishes {
  isTerminalLifeSustainingMeasures: null | boolean;
  isTerminalArtificialNutritionHydration: null | boolean;
  isPermanentLifeSustainingMeasures: null | boolean;
  isPermanentArtificialNutritionHydration: null | boolean;
  isAuthorizePainAlleviationTreatment: null | boolean;
}

export interface SpecificWishes {
  isOrganDonation: boolean | null;
  endOfLifeCareLocation: string;
  additionalWishes: string | null;
  isAdditionalWishes?: boolean;
}

export interface LivingWillState {
  url: string | null;
  livingWillId: number;
  wishes: Wishes;
  specificWishes: SpecificWishes;
  updateWishes: (data: LivingWillWishesForm) => void;
  updateSpecificWishes: (data: SpecificWishes) => void;
  setEntireLivingWill: (data: LivingWillGetResponse) => void;
  setLivingWillId: (data: number) => void;
  resetEntireLivingWill: () => void;
  updateUrl: (url: string | null) => void;
}
