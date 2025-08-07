import dayjs from 'dayjs';

import { MedicalPOABody } from '@/services/medical-poa/types';
import {
  useMedicalPOAAgentPowersStore,
  useMedicalPOAGuardianStore,
  useMedicalPOAAgentStore,
  useMedicalPOAPrimaryPhysicianStore,
  useSigningMedicalState,
} from '@/store/medical-poa';
import { Agent } from '@/types';
import {
  prepareAgentForRequest,
  getKeyDecision,
  prepareGuardianForRequest,
} from '@/utils';

const useMedicalRequestBody = () => {
  const {
    hipaaAuthorization,
    limitations,
    makeDecision,
    certainDate,
    isCompletedAgentPowersSection,
    isCompletedWishesSection,
  } = useMedicalPOAAgentPowersStore();
  const { guardian, isGuardian, isCompletedGuardianSection } =
    useMedicalPOAGuardianStore();
  const { isNotarization, isWitnesses, isCompletedSigningSection } =
    useSigningMedicalState();
  const {
    alternatedAgent,
    designetedAgent,
    secondAlternatedAgent,
    is2ndAlternateAgent,
    isAlternateAgent,
    id,
    isCompletedAgentSection,
    isHealthCare,
  } = useMedicalPOAAgentStore();
  const { physician, isPhysician, isCompletedPrimaryPhysicianSection } =
    useMedicalPOAPrimaryPhysicianStore();
  const medicalBody: MedicalPOABody = {
    isHealthCare,
    isCompletedWishesSection,
    isCompletedAgentPowersSection,
    isCompletedAgentSection,
    isCompletedGuardianSection,
    isCompletedPrimaryPhysicianSection,
    isCompletedSigningSection,
    isNotarization,
    isWitnesses,
    agent: {
      address: { ...designetedAgent.address },
      fullName: designetedAgent.fullName,
      phoneNumber: designetedAgent.phoneNumber,
      email: designetedAgent.email || null,
      personType: designetedAgent.personType || '',
    },
    alternativeAgent: {
      address: {
        address_line_1: alternatedAgent.address.address_line_1,
        address_line_2: alternatedAgent.address.address_line_2,
        city: alternatedAgent.address.city,
        zip_code: alternatedAgent.address.zip_code,
        state: alternatedAgent.address.state,
      },
      email: alternatedAgent.email || null,
      fullName: alternatedAgent.fullName,
      phoneNumber: alternatedAgent.phoneNumber,
    },
    secondAlternativeAgent: prepareAgentForRequest(
      secondAlternatedAgent as Agent,
    ),
    is2ndAlternateAgent,
    isAlternateAgent,
    isAgentCanHaveAccessToYourProtectedHealthInformation: hipaaAuthorization,
    whenAgentCanMakeDecisions: getKeyDecision(makeDecision),
    dateOfActivation: certainDate?.day
      ? dayjs(Object.values(certainDate).join('-'), 'YYYY-MMMM-DD').format(
          'YYYY-MM-DD',
        )
      : null,
    limitations,
    guardian: prepareGuardianForRequest(guardian as Agent),
    isGuardian,
    isPhysician,
    physician: prepareGuardianForRequest(physician as Agent),
  };

  return { medicalBody, medicalId: id };
};

export default useMedicalRequestBody;
