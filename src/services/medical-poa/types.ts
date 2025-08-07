import { AddressProps } from '@/types';

export interface AgentFromApi {
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: AddressProps;
  personType: string | null;
}

export interface AlternativeAgent extends Omit<AgentFromApi, 'personType'> {}

export interface AlternativeAgentFromApi
  extends Omit<AgentFromApi, 'personType'> {}

export interface MedicalPoaGetResponse {
  id: number;
  isAgentCanHaveAccessToYourProtectedHealthInformation: boolean | null;
  limitations: string | null;
  whenAgentCanMakeDecisions: string | null;
  dateOfActivation: null | string;
  url: null | string;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: null | string;
  agent: AgentFromApi | null;
  alternativeAgent: null | AlternativeAgentFromApi;
  secondAlternativeAgent: null | AlternativeAgentFromApi;
  physician: AlternativeAgent | null;
  guardian: AlternativeAgent | null;
  isPhysician: boolean | null;
  isGuardian: boolean | null;
  isAlternateAgent: boolean | null;
  is2ndAlternateAgent: boolean | null;
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedAgentSection: boolean;
  isCompletedAgentPowersSection: boolean;
  isCompletedGuardianSection: boolean;
  isCompletedWishesSection: boolean;
  isCompletedPrimaryPhysicianSection: boolean;
  isCompletedSigningSection: boolean;
  isHealthCare: null | boolean;
}

export interface MedicalPoa {
  data: {
    attributes: MedicalPoaGetResponse;
    id: number;
  };
}

export interface MedicalPOABody {
  agent: AgentFromApi | null;
  secondAlternativeAgent: AlternativeAgentFromApi | null;
  alternativeAgent: AlternativeAgentFromApi | null;
  guardian: AlternativeAgent | null;
  physician: AlternativeAgent | null;
  isAgentCanHaveAccessToYourProtectedHealthInformation: boolean | null;
  limitations: string | null;
  whenAgentCanMakeDecisions: string | null;
  dateOfActivation: string | null;
  isPhysician: boolean | null;
  isGuardian: boolean | null;
  isAlternateAgent: boolean | null;
  is2ndAlternateAgent: boolean | null;
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedAgentSection: boolean;
  isCompletedAgentPowersSection: boolean;
  isCompletedGuardianSection: boolean;
  isCompletedWishesSection: boolean;
  isCompletedPrimaryPhysicianSection: boolean;
  isCompletedSigningSection: boolean;
  isHealthCare: null | boolean;
}
