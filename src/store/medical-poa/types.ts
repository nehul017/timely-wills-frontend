import {
  Agent,
  MedicalPOAAgentForm,
  MedicalPOAAgentPowers,
  MedicalPOAGuardianForm,
  MedicalPrimaryPhysicianForm,
} from '@/types';

import { Signing } from '../durable-poa/types';

export interface MedicalPOAAgentState {
  url: string | null;
  id: number | null;
  designetedAgent: Agent & { personType: string };
  alternatedAgent: Agent;
  secondAlternatedAgent: Agent;
  isAlternateAgent: boolean | null;
  is2ndAlternateAgent: boolean | null;
  isCompletedAgentSection: boolean;
  isHealthCare: null | boolean;
  setIsCompletedAgentSection: (value: boolean) => void;
  updateMedicalAgent: (
    data: MedicalPOAAgentForm & {
      id: number;
      isCompletedAgentSection: boolean;
      isHealthCare: boolean | null;
    },
  ) => void;
  resetMedicalAgent: () => void;
  updateUrl: (url: string | null) => void;
}

export interface MedicalPOAAgentPowersState {
  makeDecision?: string;
  isCompletedAgentPowersSection: boolean;
  isCompletedWishesSection: boolean;
  hipaaAuthorization: boolean | null;
  isLimitations?: boolean;
  limitations: string | null;
  certainDate?: {
    month?: string;
    day?: string;
    year?: string;
  };
  setIsCompletedAgentPowersSection: (value: boolean) => void;
  setIsCompletedWishesSection: (value: boolean) => void;
  updateAgentPowers: (
    data: MedicalPOAAgentPowers & {
      isCompletedAgentPowersSection: boolean;
    },
  ) => void;
  resetAgentPowers: () => void;
}

export interface MedicalPOAGuardianState {
  isGuardian: boolean | null;
  isAgentGuardian?: boolean;
  guardian?: Agent;
  isCompletedGuardianSection: boolean;
  setIsCompletedGuardianSection: (value: boolean) => void;
  updateGuardianState: (
    data: MedicalPOAGuardianForm & {
      isCompletedGuardianSection: boolean;
    },
  ) => void;
  resetGuardianState: () => void;
}

export interface MedicalPrimaryPhysicianState {
  isPhysician: boolean | null;
  physician: Agent;
  isCompletedPrimaryPhysicianSection: boolean;
  setIsCompletedPrimaryPhysicianSection: (value: boolean) => void;
  updatePrimaryPhysicianState: (
    data: MedicalPrimaryPhysicianForm & {
      isCompletedPrimaryPhysicianSection: boolean;
    },
  ) => void;
  resetPrimaryPhysicianState: () => void;
}

export interface SigningMedicalState {
  isNotarization: boolean | null;
  isWitnesses: boolean | null;
  isCompletedSigningSection: boolean;
  setIsCompletedSigningSection: (value: boolean) => void;
  setSigning: (
    data: Signing & {
      isCompletedSigningSection: boolean;
    },
  ) => void;
  resetSigning: () => void;
}
