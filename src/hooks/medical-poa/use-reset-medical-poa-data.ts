import {
  useMedicalPOAAgentPowersStore,
  useMedicalPOAAgentStore,
  useMedicalPOAGuardianStore,
  useMedicalPOAPrimaryPhysicianStore,
  useSigningMedicalState,
} from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';

const useResetMedicalPoaData = () => {
  const { resetMedicalAgent } = useMedicalPOAAgentStore();
  const { resetAgentPowers } = useMedicalPOAAgentPowersStore();
  const { resetGuardianState } = useMedicalPOAGuardianStore();
  const { resetPrimaryPhysicianState } = useMedicalPOAPrimaryPhysicianStore();
  const { resetSigning } = useSigningMedicalState();
  const { resetMedicalStep } = useProgressStepStore();

  const resetAllMedicalPoaSectionData = () => {
    resetMedicalAgent();
    resetAgentPowers();
    resetGuardianState();
    resetPrimaryPhysicianState();
    resetSigning();
    resetMedicalStep();
  };

  return { resetAllMedicalPoaSectionData };
};

export default useResetMedicalPoaData;
