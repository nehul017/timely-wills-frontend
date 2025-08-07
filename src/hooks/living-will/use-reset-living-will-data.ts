import { useLivingWillWishesStore } from '@/store/living-will';
import { useProgressStepStore } from '@/store/progress-steps';

const useResetLivingWillData = () => {
  const { resetEntireLivingWill } = useLivingWillWishesStore();
  const { setCurrentWishesStep } = useProgressStepStore();

  const resetAllLivingWillSectionData = () => {
    resetEntireLivingWill();
    setCurrentWishesStep(0);
  };

  return { resetAllLivingWillSectionData };
};

export default useResetLivingWillData;
