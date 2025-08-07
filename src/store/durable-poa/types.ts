import { Agent, FormDataAgentPowers, FormDataDurablePOA } from '@/types';

export interface AgentPowers {
  generalOverallAuthority: string;
  isMaintenance: boolean | null;
  isManageAccounts: boolean | null;
  isManageProperty: boolean | null;
  isManageRealEstate: boolean | null;
  isManageInsuranceAndAnnuityTransactions: boolean | null;
  isManageRetirementAccounts: boolean | null;
  isManageGovernmentalBenefits: boolean | null;
  isManageTaxMatters: boolean | null;
  isManageEstateTrust: boolean | null;
  isMakeGifts: boolean | null;
  isManageSecurities: boolean | null;
  isManageClaimsLitigations: boolean | null;
  restrictions: string | null;
  isGuardian: boolean | null;
  isOver18?: boolean;
  isRestrictions: boolean | null;
  guardian: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    postalAddress?: string;
  };
}

export interface Signing {
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
}

export interface DurablePOAAgentState {
  url: string | null;
  id: number | null;
  isUnderstand: boolean;
  designetedAgent: Agent & { personType: string };
  alternatedAgent: Agent;
  becomeEffectivePOA: string;
  isAlternateAgent: boolean | null;
  isCompletedAgentSection: boolean;
  setIsCompletedAgentSection: (value: boolean) => void;
  updateDurableAgents: (data: FormDataDurablePOA & { id: number }) => void;
  updateUrl: (url: string | null) => void;
  resetDurableAgentState: () => void;
}

export interface DurablePOAAgentPowersState {
  powers: AgentPowers;
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedAgentPowersSection: boolean;
  isCompletedSigningSection: boolean;
  setIsCompletedAgentPowersSection: (value: boolean) => void;
  setIsCompletedSigningSection: (value: boolean) => void;
  setAllCompletedValues: (data: { signing: boolean; powers: boolean }) => void;
  updatePowersState: (data: FormDataAgentPowers) => void;
  resetPowersState: () => void;
  updateSigning: (data: Signing) => void;
}
