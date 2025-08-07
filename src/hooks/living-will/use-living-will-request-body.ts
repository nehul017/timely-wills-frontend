import { LivingWillBody } from '@/services/living-will/types';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useMedicalPOAAgentPowersStore } from '@/store/medical-poa';

const useLivingWillRequestBody = () => {
  const { specificWishes, wishes, livingWillId } = useLivingWillWishesStore();
  const { isCompletedWishesSection } = useMedicalPOAAgentPowersStore();
  const { additionalWishes, endOfLifeCareLocation, isOrganDonation } =
    specificWishes;
  const {
    isAuthorizePainAlleviationTreatment,
    isPermanentArtificialNutritionHydration,
    isPermanentLifeSustainingMeasures,
    isTerminalArtificialNutritionHydration,
    isTerminalLifeSustainingMeasures,
  } = wishes;

  const livingWillBody: LivingWillBody = {
    isCompletedWishesSection,
    OtherWishes: additionalWishes,
    whereIWantReceveEndOfLife: endOfLifeCareLocation,
    doYouWantDonateOrgans: isOrganDonation,
    doYouConserntToEuthanasia: isAuthorizePainAlleviationTreatment,
    permanentCondition: {
      doYouWantArtificialNutritionAndHydration:
        isPermanentArtificialNutritionHydration as boolean,
      doYouWantLifeSustainingMeasures:
        isPermanentLifeSustainingMeasures as boolean,
    },
    terminalCondition: {
      doYouWantArtificialNutritionAndHydration:
        isTerminalArtificialNutritionHydration as boolean,
      doYouWantLifeSustainingMeasures:
        isTerminalLifeSustainingMeasures as boolean,
    },
  };

  return { livingWillBody, livingWillId };
};

export default useLivingWillRequestBody;
