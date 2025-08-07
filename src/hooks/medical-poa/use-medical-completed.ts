import {
  useMedicalPOAAgentPowersStore,
  useMedicalPOAAgentStore,
  useMedicalPOAGuardianStore,
  useMedicalPOAPrimaryPhysicianStore,
  useSigningMedicalState,
} from '@/store/medical-poa';

const useMedicalCompleted = () => {
  const { isCompletedAgentSection } = useMedicalPOAAgentStore();
  const { isCompletedAgentPowersSection, isCompletedWishesSection } =
    useMedicalPOAAgentPowersStore();
  const { isCompletedGuardianSection } = useMedicalPOAGuardianStore();
  const { isCompletedPrimaryPhysicianSection } =
    useMedicalPOAPrimaryPhysicianStore();
  const { isCompletedSigningSection } = useSigningMedicalState();

  return {
    isCompletedAgentSection,
    isCompletedAgentPowersSection,
    isCompletedGuardianSection,
    isCompletedPrimaryPhysicianSection,
    isCompletedSigningSection,
    isCompletedWishesSection,
  };
};

export default useMedicalCompleted;
