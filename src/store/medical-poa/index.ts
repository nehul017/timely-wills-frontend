import { create } from 'zustand';

import { AddressProps, Agent } from '@/types';
import { getInitAgent } from '@/utils';

import {
  MedicalPOAAgentPowersState,
  MedicalPOAAgentState,
  MedicalPOAGuardianState,
  MedicalPrimaryPhysicianState,
  SigningMedicalState,
} from './types';

export const useMedicalPOAAgentStore = create<MedicalPOAAgentState>((set) => ({
  url: null,
  id: null,
  designetedAgent: { ...getInitAgent(), personType: '' },
  alternatedAgent: getInitAgent(),
  secondAlternatedAgent: getInitAgent(),
  is2ndAlternateAgent: null,
  isAlternateAgent: null,
  isCompletedAgentSection: false,
  isHealthCare: null,
  setIsCompletedAgentSection: (value) =>
    set({ isCompletedAgentSection: value }),
  updateMedicalAgent: (data) =>
    set({
      id: data.id,
      designetedAgent: data.designetedAgent,
      alternatedAgent: data.alternatedAgent as Agent,
      secondAlternatedAgent: data.secondAlternatedAgent as Agent,
      isAlternateAgent: data.isAlternateAgent,
      is2ndAlternateAgent: data.is2ndAlternateAgent,
      isCompletedAgentSection: data.isCompletedAgentSection,
      isHealthCare: data.isHealthCare,
    }),
  updateUrl: (url) => set({ url }),
  resetMedicalAgent: () =>
    set({
      url: null,
      id: null,
      designetedAgent: { ...getInitAgent(), personType: '' },
      alternatedAgent: getInitAgent(),
      secondAlternatedAgent: getInitAgent(),
      is2ndAlternateAgent: null,
      isAlternateAgent: null,
      isCompletedAgentSection: false,
      isHealthCare: null,
    }),
}));

export const useMedicalPOAAgentPowersStore = create<MedicalPOAAgentPowersState>(
  (set) => ({
    hipaaAuthorization: null,
    limitations: '',
    makeDecision: '',
    isCompletedAgentPowersSection: false,
    isCompletedWishesSection: false,
    setIsCompletedWishesSection: (value) =>
      set({ isCompletedWishesSection: value }),
    setIsCompletedAgentPowersSection: (value) =>
      set({ isCompletedAgentPowersSection: value }),
    updateAgentPowers: (data) =>
      set({
        hipaaAuthorization: data.hipaaAuthorization,
        isLimitations: data.isLimitations,
        limitations: data.limitations,
        makeDecision: data.makeDecision,
        certainDate: { ...data.certainDate },
        isCompletedAgentPowersSection: data.isCompletedAgentPowersSection,
      }),
    resetAgentPowers: () =>
      set({
        hipaaAuthorization: null,
        limitations: '',
        makeDecision: '',
        isCompletedAgentPowersSection: false,
        isCompletedWishesSection: false,
        isLimitations: undefined,
      }),
  }),
);

export const useMedicalPOAGuardianStore = create<MedicalPOAGuardianState>(
  (set) => ({
    isGuardian: null,
    isCompletedGuardianSection: false,
    setIsCompletedGuardianSection: (value) =>
      set({ isCompletedGuardianSection: value }),
    updateGuardianState: (data) =>
      set({
        guardian: data.guardian as Agent,
        isAgentGuardian: data.isAgentGuardian,
        isGuardian: data.isGuardian,
        isCompletedGuardianSection: data.isCompletedGuardianSection,
      }),
    resetGuardianState: () =>
      set({
        isGuardian: null,
        isCompletedGuardianSection: false,
      }),
  }),
);

export const useMedicalPOAPrimaryPhysicianStore =
  create<MedicalPrimaryPhysicianState>((set) => ({
    physician: getInitAgent(),
    isPhysician: null,
    isCompletedPrimaryPhysicianSection: false,
    setIsCompletedPrimaryPhysicianSection: (value) =>
      set({ isCompletedPrimaryPhysicianSection: value }),
    updatePrimaryPhysicianState: (data) =>
      set({
        isPhysician: data.isPhysician,
        isCompletedPrimaryPhysicianSection:
          data.isCompletedPrimaryPhysicianSection,
        physician: {
          address: { ...data.physician?.address } as AddressProps,
          fullName: data.physician?.fullName as string,
          phoneNumber: data.physician?.phoneNumber as string,
          email: data.physician?.email as string,
        },
      }),
    resetPrimaryPhysicianState: () =>
      set({
        physician: getInitAgent(),
        isPhysician: null,
        isCompletedPrimaryPhysicianSection: false,
      }),
  }));

export const useSigningMedicalState = create<SigningMedicalState>((set) => ({
  isNotarization: null,
  isWitnesses: null,
  isCompletedSigningSection: false,
  setIsCompletedSigningSection: (value) =>
    set({ isCompletedSigningSection: value }),
  resetSigning: () =>
    set({
      isNotarization: null,
      isWitnesses: null,
      isCompletedSigningSection: false,
    }),
  setSigning: ({ isNotarization, isWitnesses, isCompletedSigningSection }) =>
    set({ isNotarization, isWitnesses, isCompletedSigningSection }),
}));
