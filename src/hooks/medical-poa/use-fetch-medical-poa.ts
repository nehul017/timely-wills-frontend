import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

import medicalPoaAPI from '@/services/medical-poa';
import {
  AlternativeAgentFromApi,
  MedicalPoaGetResponse,
} from '@/services/medical-poa/types';
import {
  useMedicalPOAAgentPowersStore,
  useMedicalPOAAgentStore,
  useMedicalPOAGuardianStore,
  useMedicalPOAPrimaryPhysicianStore,
  useSigningMedicalState,
} from '@/store/medical-poa';
import { getValueDecision } from '@/utils';

const useFetchMedicalPOA = () => {
  const { updateAgentPowers } = useMedicalPOAAgentPowersStore();
  const { updateMedicalAgent, updateUrl } = useMedicalPOAAgentStore();
  const { updateGuardianState } = useMedicalPOAGuardianStore();
  const { updatePrimaryPhysicianState } = useMedicalPOAPrimaryPhysicianStore();
  const { setSigning } = useSigningMedicalState();

  const getAgent = useCallback((agent: AlternativeAgentFromApi | null) => {
    return {
      address: {
        address_line_1: agent?.address.address_line_1 || '',
        address_line_2: agent?.address.address_line_2 || '',
        city: agent?.address.city || '',
        state: agent?.address.state || '',
        zip_code: agent?.address.zip_code || '',
      },
      fullName: agent?.fullName || '',
      phoneNumber: agent?.phoneNumber || '',
      email: agent?.email || '',
    };
  }, []);

  const getCertainDate = useCallback((date: string | null) => {
    if (!date) return undefined;

    const newDate = dayjs(date, 'YYYY-MM-DD').format('YYYY-MMMM-DD');
    const [year, month, day] = newDate.split('-');

    return { day, month, year };
  }, []);

  const setEntireMedicalPOA = useCallback((data: MedicalPoaGetResponse) => {
    const {
      id,
      agent,
      alternativeAgent,
      secondAlternativeAgent,
      is2ndAlternateAgent,
      isAlternateAgent,
      dateOfActivation,
      isAgentCanHaveAccessToYourProtectedHealthInformation,
      limitations,
      whenAgentCanMakeDecisions,
      guardian,
      isGuardian,
      isPhysician,
      physician,
      url,
      isNotarization,
      isWitnesses,
      isCompletedAgentPowersSection,
      isCompletedAgentSection,
      isCompletedGuardianSection,
      isCompletedPrimaryPhysicianSection,
      isCompletedSigningSection,
      isHealthCare,
    } = data;

    updateMedicalAgent({
      id,
      designetedAgent: {
        ...getAgent(agent),
        personType: agent?.personType || '',
      },
      alternatedAgent: getAgent(alternativeAgent),
      secondAlternatedAgent: getAgent(secondAlternativeAgent),
      is2ndAlternateAgent,
      isAlternateAgent,
      isCompletedAgentSection,
      isHealthCare,
    });
    updateAgentPowers({
      isCompletedAgentPowersSection,
      hipaaAuthorization: isAgentCanHaveAccessToYourProtectedHealthInformation,
      limitations,
      makeDecision: getValueDecision(whenAgentCanMakeDecisions),
      isLimitations: !!limitations,
      certainDate: getCertainDate(dateOfActivation),
    });
    updateGuardianState({
      isCompletedGuardianSection,
      isAgentGuardian:
        isGuardian === null
          ? undefined
          : agent?.fullName === guardian?.fullName,
      isGuardian,
      guardian: {
        address: {
          address_line_1: guardian?.address.address_line_1 || '',
          address_line_2: guardian?.address.address_line_2 || '',
          city: guardian?.address.city || '',
          state: guardian?.address.state || '',
          zip_code: guardian?.address.zip_code || '',
        },
        fullName: guardian?.fullName || '',
        phoneNumber: guardian?.phoneNumber || '',
        email: guardian?.email || '',
      },
    });
    updatePrimaryPhysicianState({
      isCompletedPrimaryPhysicianSection,
      isPhysician,
      physician: {
        address: {
          address_line_1: physician?.address.address_line_1 || '',
          address_line_2: physician?.address.address_line_2 || '',
          city: physician?.address.city || '',
          state: physician?.address.state || '',
          zip_code: physician?.address.zip_code || '',
        },
        fullName: physician?.fullName || '',
        phoneNumber: physician?.phoneNumber || '',
        email: physician?.email || '',
      },
    });
    updateUrl(url);
    setSigning({ isNotarization, isWitnesses, isCompletedSigningSection });
  }, []);

  const fetchMedicalPOA = useCallback(async () => {
    const response = await medicalPoaAPI.getMedicalPOA();

    if (response) {
      setEntireMedicalPOA(response);
    }
  }, []);

  return useMemo(() => ({ fetchMedicalPOA }), []);
};

export default useFetchMedicalPOA;
