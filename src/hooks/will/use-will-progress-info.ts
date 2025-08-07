import { useEstateState } from '@/store/will/estate';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';

const useWillProgressInfo = () => {
  const { isChildren, isPet } = useFamilyMembersState();
  const { isGifts, beneficiaryForGift } = useGiftsState();
  const { beneficiaries } = useEstateState();
  const { isWishes, primaryExecutor, compensation, specialWishes } =
    useExecutorsState();

  const booleanArray = [
    isChildren !== null,
    isPet !== null,
    (isGifts && !!beneficiaryForGift.length) || isGifts !== null,
    (isWishes && !!specialWishes) || isWishes !== null,
    primaryExecutor !== null,
    compensation !== null,
    !!beneficiaries.length,
  ];

  const totalSections = booleanArray.length;
  const completedSections = booleanArray.filter((item) => item).length;

  const progress = completedSections
    ? Math.floor((completedSections / totalSections) * 100)
    : 0;

  return { booleanArray, progress };
};

export default useWillProgressInfo;
