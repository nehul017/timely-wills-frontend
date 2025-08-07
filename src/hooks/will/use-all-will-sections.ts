import { useEstateState } from '@/store/will/estate';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';

const useAllWillSections = () => {
  const { isCompletedFamilySection } = useFamilyMembersState();
  const { isCompletedEstateSection } = useEstateState();
  const { isCompletedGiftsSection } = useGiftsState();
  const { isCompletedExecutorsSection } = useExecutorsState();

  return {
    isCompletedEstateSection,
    isCompletedExecutorsSection,
    isCompletedFamilySection,
    isCompletedGiftsSection,
  };
};

export default useAllWillSections;
