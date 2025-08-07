import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';
import { useWillInfoState } from '@/store/will/will-info';

const useResetWillData = () => {
  const { resetEntireFamily } = useFamilyMembersState();
  const { resetEntireEstate } = useEstateState();
  const { resetEntireBeneficiaryForGift } = useGiftsState();
  const { resetEntireExecutorsState } = useExecutorsState();
  const { resetEntireWillInfo } = useWillInfoState();
  const { setWillMainStep, setSubStep } = useProgressStepStore();
  const resetWillSteps = () => {
    setSubStep(0);
    setWillMainStep(0);
  };

  const resetAllWillSectionData = () => {
    resetEntireFamily();
    resetEntireEstate();
    resetEntireBeneficiaryForGift();
    resetEntireExecutorsState();
    resetEntireWillInfo();
    resetWillSteps();
  };

  return { resetAllWillSectionData };
};

export default useResetWillData;
