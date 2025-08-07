import { AddressProps } from '@/types';

interface Guardian {
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  postalAddress: string | null;
}

interface Agent {
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: AddressProps;
  personType: string | null;
}

interface AlternativeAgent extends Omit<Agent, 'personType'> {}

export interface DurablePOA {
  id: number;
  whenPoaBecomeEffective: string | null;
  isAlternativeAgent: boolean | null;
  generalOverallAuthority: string | null;
  isCanMaintenance: boolean | null;
  isCanManageFiinance: boolean | null;
  isCanManageTangiblePersonalProperty: boolean | null;
  isCanManageRealEstate: boolean | null;
  isCanManageInsuranceAndAnnuityTransactions: boolean | null;
  isCanManageRetuirementAccounts: boolean | null;
  isCanManageGovermentBenefits: boolean | null;
  isCanManageTax: boolean | null;
  isCanManageInterestInEstateOrTrust: boolean | null;
  isCanMakeGiftsUsingYourProperty: boolean | null;
  isCanManageSecurityTransactions: boolean | null;
  isCanManageClaimsAndLitigations: boolean | null;
  restrictions: string | null;
  url: null | string;
  generatedAt: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: null | string;
  agent: Agent | null;
  alternativeAgent: AlternativeAgent | null;
  guardian: Guardian | null;
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedAgentSection: boolean;
  isCompletedAgentPowersSection: boolean;
  isCompletedSigningSection: boolean;
  isAgentRestrictions: null | boolean;
  isGuardian: boolean | null;
}

export interface DurablePOABody {
  isAlternativeAgent: boolean | null;
  generalOverallAuthority: string;
  agent: Agent | null;
  alternativeAgent: AlternativeAgent | null;
  guardian: Guardian | null;
  isCanMaintenance: boolean | null;
  isCanManageFiinance: boolean | null;
  isCanManageTangiblePersonalProperty: boolean | null;
  isCanManageRealEstate: boolean | null;
  isCanManageInsuranceAndAnnuityTransactions: boolean | null;
  isCanManageRetuirementAccounts: boolean | null;
  isCanManageGovermentBenefits: boolean | null;
  isCanManageTax: boolean | null;
  isCanManageInterestInEstateOrTrust: boolean | null;
  isCanMakeGiftsUsingYourProperty: boolean | null;
  isCanManageSecurityTransactions: boolean | null;
  isCanManageClaimsAndLitigations: boolean | null;
  restrictions: string | null;
  whenPoaBecomeEffective: string | null;
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedAgentSection: boolean;
  isCompletedAgentPowersSection: boolean;
  isCompletedSigningSection: boolean;
  isAgentRestrictions: null | boolean;
  isGuardian: boolean | null;
}
