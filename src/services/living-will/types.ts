export interface Condition {
  doYouWantLifeSustainingMeasures: boolean | null;
  doYouWantArtificialNutritionAndHydration: boolean | null;
}

export interface LivingWillGetResponse {
  id: number;
  doYouConserntToEuthanasia: boolean | null;
  doYouWantDonateOrgans: null | boolean;
  OtherWishes: null | string;
  whereIWantReceveEndOfLife: null | string;
  url: null | string;
  generatedAt: null | string;
  createdAt: string;
  updatedAt: string;
  publishedAt: null | string;
  terminalCondition: null | Condition;
  permanentCondition: null | Condition;
  createdByUserId: number;
  isCompletedWishesSection: boolean | null;
}

export interface LivingWill {
  data: {
    attributes: LivingWillGetResponse;
    id: number;
  };
}

export interface LivingWillBody {
  doYouConserntToEuthanasia: boolean | null;
  doYouWantDonateOrgans: boolean | null;
  OtherWishes: string | null;
  terminalCondition: Condition | null;
  permanentCondition: Condition | null;
  whereIWantReceveEndOfLife: string | null;
  isCompletedWishesSection: boolean | null;
}
