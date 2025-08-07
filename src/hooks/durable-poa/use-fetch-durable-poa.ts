import { useCallback, useMemo } from 'react';

import durablePoaAPI from '@/services/durable-poa';
import { DurablePOA } from '@/services/durable-poa/types';
import {
  useDurablePOAAgentPowersStore,
  useDurablePOAdesignatedAgentStore,
} from '@/store/durable-poa';

const useFetchDurablePOA = () => {
  const { updatePowersState, updateSigning, setAllCompletedValues } =
    useDurablePOAAgentPowersStore();
  const { updateDurableAgents, updateUrl, setIsCompletedAgentSection } =
    useDurablePOAdesignatedAgentStore();
  const updateDurablePOA = useCallback((data: DurablePOA) => {
    const {
      url,
      generalOverallAuthority,
      createdAt,
      agent,
      alternativeAgent,
      guardian,
      id,
      isCanMaintenance,
      isCanMakeGiftsUsingYourProperty,
      isCanManageClaimsAndLitigations,
      isCanManageInsuranceAndAnnuityTransactions,
      isCanManageFiinance,
      isCanManageGovermentBenefits,
      isCanManageInterestInEstateOrTrust,
      isCanManageRealEstate,
      isCanManageRetuirementAccounts,
      isCanManageSecurityTransactions,
      isCanManageTangiblePersonalProperty,
      isCanManageTax,
      isAlternativeAgent,
      restrictions,
      whenPoaBecomeEffective,
      isNotarization,
      isWitnesses,
      isAgentRestrictions,
      isCompletedAgentPowersSection,
      isCompletedAgentSection,
      isCompletedSigningSection,
      isGuardian,
    } = data;

    setIsCompletedAgentSection(isCompletedAgentSection);
    setAllCompletedValues({
      powers: isCompletedAgentPowersSection,
      signing: isCompletedSigningSection,
    });
    updateSigning({ isNotarization, isWitnesses });
    updatePowersState({
      generalOverallAuthority: generalOverallAuthority
        ? generalOverallAuthority === 'Yes'
          ? generalOverallAuthority
          : 'No, I choose only specific powers'
        : '',
      isMaintenance: isCanMaintenance,
      isMakeGifts: isCanMakeGiftsUsingYourProperty,
      isManageAccounts: isCanManageFiinance,
      isManageClaimsLitigations: isCanManageClaimsAndLitigations,
      isManageInsuranceAndAnnuityTransactions:
        isCanManageInsuranceAndAnnuityTransactions,
      isManageEstateTrust: isCanManageInterestInEstateOrTrust,
      isManageGovernmentalBenefits: isCanManageGovermentBenefits,
      isManageProperty: isCanManageTangiblePersonalProperty,
      isManageRealEstate: isCanManageRealEstate,
      isManageRetirementAccounts: isCanManageRetuirementAccounts,
      isManageSecurities: isCanManageSecurityTransactions,
      isManageTaxMatters: isCanManageTax,
      isRestrictions: isAgentRestrictions,
      restrictions,
      guardian: {
        email: guardian?.email || '',
        fullName: guardian?.fullName || '',
        phoneNumber: guardian?.phoneNumber || '',
        postalAddress: guardian?.postalAddress || '',
      },
      isGuardian,
      isOver18: !createdAt ? undefined : !!guardian?.fullName,
    });
    updateDurableAgents({
      id,
      isUnderstand: !!agent?.fullName,
      becomeEffectivePOA: whenPoaBecomeEffective || '',
      designetedAgent: {
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
        personType: agent?.personType || '',
      },
      alternatedAgent: {
        address: {
          address_line_1: alternativeAgent?.address.address_line_1 || '',
          address_line_2: alternativeAgent?.address.address_line_2 || '',
          city: alternativeAgent?.address.city || '',
          state: alternativeAgent?.address.state || '',
          zip_code: alternativeAgent?.address.zip_code || '',
        },
        fullName: alternativeAgent?.fullName || '',
        phoneNumber: alternativeAgent?.phoneNumber || '',
        email: alternativeAgent?.email || '',
      },
      isAlternateAgent: isAlternativeAgent,
    });
    updateUrl(url);
  }, []);

  const fetchDurable = useCallback(async () => {
    const response = await durablePoaAPI.getDurablePOA();

    if (response) {
      updateDurablePOA(response);
    }
  }, []);

  return useMemo(() => ({ fetchDurable }), []);
};

export default useFetchDurablePOA;
