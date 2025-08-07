import { DurablePOABody } from '@/services/durable-poa/types';
import {
  useDurablePOAAgentPowersStore,
  useDurablePOAdesignatedAgentStore,
} from '@/store/durable-poa';
import { prepareAgentForRequest } from '@/utils';

const useDurableRequestBody = () => {
  const {
    alternatedAgent,
    isAlternateAgent,
    designetedAgent,
    becomeEffectivePOA,
    id,
    isCompletedAgentSection,
  } = useDurablePOAdesignatedAgentStore();
  const {
    powers,
    isNotarization,
    isWitnesses,
    isCompletedAgentPowersSection,
    isCompletedSigningSection,
  } = useDurablePOAAgentPowersStore();
  const {
    generalOverallAuthority,
    isMaintenance,
    isMakeGifts,
    isManageAccounts,
    isManageClaimsLitigations,
    isManageInsuranceAndAnnuityTransactions,
    isManageEstateTrust,
    isManageGovernmentalBenefits,
    isManageProperty,
    isManageRealEstate,
    isManageRetirementAccounts,
    isManageSecurities,
    isManageTaxMatters,
    guardian,
    restrictions,
    isGuardian,
    isRestrictions,
  } = powers;
  const durableBody: DurablePOABody = {
    isCompletedAgentPowersSection,
    isCompletedAgentSection,
    isCompletedSigningSection,
    isGuardian,
    isAgentRestrictions: isRestrictions,
    generalOverallAuthority:
      generalOverallAuthority === 'Yes' ? generalOverallAuthority : 'no',
    isAlternativeAgent: isAlternateAgent ?? null,
    agent: {
      address: { ...designetedAgent.address },
      fullName: designetedAgent.fullName,
      phoneNumber: designetedAgent.phoneNumber,
      email: designetedAgent.email || null,
      personType: designetedAgent.personType,
    },
    whenPoaBecomeEffective: becomeEffectivePOA,
    alternativeAgent: prepareAgentForRequest(alternatedAgent),
    guardian: guardian?.fullName
      ? {
          fullName: guardian.fullName || null,
          email: guardian.email || null,
          phoneNumber: guardian.phoneNumber || null,
          postalAddress: guardian.postalAddress || null,
        }
      : null,
    isCanMaintenance: isMaintenance,
    isCanMakeGiftsUsingYourProperty: isMakeGifts,
    isCanManageClaimsAndLitigations: isManageClaimsLitigations,
    isCanManageInsuranceAndAnnuityTransactions:
      isManageInsuranceAndAnnuityTransactions,
    isCanManageFiinance: isManageAccounts,
    isCanManageGovermentBenefits: isManageGovernmentalBenefits,
    isCanManageInterestInEstateOrTrust: isManageEstateTrust,
    isCanManageRealEstate: isManageRealEstate,
    isCanManageRetuirementAccounts: isManageRetirementAccounts,
    isCanManageSecurityTransactions: isManageSecurities,
    isCanManageTangiblePersonalProperty: isManageProperty,
    isCanManageTax: isManageTaxMatters,
    restrictions,
    isNotarization,
    isWitnesses,
  };

  return { durableBody, durableId: id };
};

export default useDurableRequestBody;
