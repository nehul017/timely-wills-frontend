import { FamilyMember, WillRequestBody } from '@/services/will/types';
import { useEstateState } from '@/store/will/estate';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';
import { useWillInfoState } from '@/store/will/will-info';

const useWillRequestBody = () => {
  const { children, isChildren, isPet, pets, isCompletedFamilySection } =
    useFamilyMembersState();
  const { willId } = useWillInfoState();
  const { beneficiaryForGift, isGifts, isCompletedGiftsSection } =
    useGiftsState();
  const {
    backupExecutor,
    compensation,
    isWishes,
    primaryExecutor,
    specialWishes,
    isNotarization,
    isSelfProvingAffidavit,
    isCompletedExecutorsSection,
  } = useExecutorsState();
  const { isExclusions, exclusions, isCompletedEstateSection } =
    useEstateState();

  const preparedPets: FamilyMember[] = pets.map((pet, i) => ({
    ...pet,
    guardian: pets[i]?.guardian ? [pets[i].guardian] : [],
    birthday: null,
  }));

  const preparedKids: FamilyMember[] = children.map((child, i) => ({
    ...child,
    guardian: children[i]?.guardian ? [children[i].guardian] : [],
    type: 'child',
    petType: null,
  }));

  const preparedGifts = beneficiaryForGift.map(({ id, ...rest }) => ({
    ...rest,
    address: rest.address || null,
    giftDescription: rest.giftDescription || null,
    money: rest.money || null,
    email: rest.email || null,
  }));

  const willRequestBody: WillRequestBody = {
    family: [...preparedKids, ...preparedPets],
    isChildren,
    isPet,
    isCompletedFamilySection,
    beneficiaryForGift: preparedGifts,
    isGifts,
    backupExecutor,
    compensation,
    isWishes,
    primaryExecutor,
    wishes: specialWishes,
    isExclusions,
    exclusions,
    isNotarization,
    isSelfProvingAffidavit,
    isCompletedEstateSection,
    isCompletedGiftsSection,
    isCompletedExecutorsSection,
  };

  return { willRequestBody, willId };
};

export default useWillRequestBody;
