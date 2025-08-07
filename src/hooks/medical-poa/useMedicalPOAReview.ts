import {
  useMedicalPOAAgentPowersStore,
  useMedicalPOAAgentStore,
  useMedicalPOAGuardianStore,
  useMedicalPOAPrimaryPhysicianStore,
} from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';

const useMedicalPOAReview = () => {
  const {
    hipaaAuthorization,
    limitations,
    makeDecision,
    certainDate,
    isLimitations,
  } = useMedicalPOAAgentPowersStore();
  const { guardian } = useMedicalPOAGuardianStore();
  const { physician } = useMedicalPOAPrimaryPhysicianStore();
  const { alternatedAgent, designetedAgent, secondAlternatedAgent } =
    useMedicalPOAAgentStore();
  const {
    medicalStep,
    decreaseMedicalStep,
    increaseMedicalStep,
    resetMedicalStep,
    setMedicalStep,
    setCurrentWishesStep,
  } = useProgressStepStore();

  const powersOptions = [
    {
      id: 1,
      question: 'When should your agent be able to make decisions for you?',
      answer: certainDate?.day
        ? Object.values(certainDate).join(', ')
        : makeDecision,
    },
    {
      id: 2,
      question:
        'Do you authorize your healthcare providers to share your protected health information and medical records with your agent? (HIPAA Authorization)',
      answer: hipaaAuthorization ? 'Yes' : 'No',
    },
    {
      id: 3,
      question: 'Will there be ANY limitations to the agent’s powers?',
      answer: isLimitations ? limitations : 'No',
    },
  ];

  return {
    powersOptions,
    guardian,
    physician,
    alternatedAgent,
    designetedAgent,
    secondAlternatedAgent,
    medicalStep,
    decreaseMedicalStep,
    increaseMedicalStep,
    resetMedicalStep,
    setMedicalStep,
    setCurrentWishesStep,
  };
};

export default useMedicalPOAReview;
