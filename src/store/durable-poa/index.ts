import { create } from 'zustand';

import { AddressProps, FormDataAgentPowers } from '@/types';
import { getInitAgent } from '@/utils';

import { DurablePOAAgentPowersState, DurablePOAAgentState } from './types';

export const useDurablePOAdesignatedAgentStore = create<DurablePOAAgentState>(
  (set) => ({
    url: null,
    id: null,
    isUnderstand: false,
    alternatedAgent: getInitAgent(),
    designetedAgent: { ...getInitAgent(), personType: '' },
    becomeEffectivePOA: '',
    isAlternateAgent: null,
    isCompletedAgentSection: false,
    setIsCompletedAgentSection: (value) =>
      set({ isCompletedAgentSection: value }),
    updateDurableAgents: (data) =>
      set({
        id: data.id,
        alternatedAgent: {
          address: data.alternatedAgent?.address.address_line_1
            ? (data.alternatedAgent.address as AddressProps)
            : {
                address_line_1: '',
                address_line_2: '',
                city: '',
                state: '',
                zip_code: '',
              },
          fullName: data.alternatedAgent?.fullName || '',
          phoneNumber: data.alternatedAgent?.phoneNumber || '',
          email: data.alternatedAgent?.email || '',
        },
        designetedAgent: {
          address: data.designetedAgent.address,
          fullName: data.designetedAgent.fullName || '',
          phoneNumber: data.designetedAgent.phoneNumber || '',
          email: data.designetedAgent.email || '',
          personType: data.designetedAgent.personType || '',
        },
        becomeEffectivePOA: data.becomeEffectivePOA,
        isAlternateAgent: data.isAlternateAgent,
      }),
    updateUrl: (url) => set({ url }),
    resetDurableAgentState: () =>
      set({
        url: null,
        id: null,
        alternatedAgent: getInitAgent(),
        designetedAgent: { ...getInitAgent(), personType: '' },
        becomeEffectivePOA: '',
        isAlternateAgent: null,
        isCompletedAgentSection: false,
        isUnderstand: false,
      }),
  }),
);

export const useDurablePOAAgentPowersStore = create<DurablePOAAgentPowersState>(
  (set) => ({
    powers: {
      generalOverallAuthority: '',
      isMaintenance: null,
      isManageAccounts: null,
      isManageProperty: null,
      isManageRealEstate: null,
      isManageInsuranceAndAnnuityTransactions: null,
      isManageRetirementAccounts: null,
      isManageGovernmentalBenefits: null,
      isManageTaxMatters: null,
      isManageEstateTrust: null,
      isMakeGifts: null,
      isManageSecurities: null,
      isManageClaimsLitigations: null,
      restrictions: null,
      isGuardian: null,
      isOver18: false,
      isRestrictions: null,
      guardian: {
        fullName: '',
        email: '',
        phoneNumber: '',
        postalAddress: '',
      },
    },
    isNotarization: null,
    isWitnesses: null,
    isCompletedAgentPowersSection: false,
    isCompletedSigningSection: false,
    setAllCompletedValues: ({ powers, signing }) =>
      set({
        isCompletedAgentPowersSection: powers,
        isCompletedSigningSection: signing,
      }),
    setIsCompletedSigningSection: (value) =>
      set({ isCompletedSigningSection: value }),
    setIsCompletedAgentPowersSection: (value) =>
      set({ isCompletedAgentPowersSection: value }),
    updatePowersState: (data: Partial<FormDataAgentPowers>) =>
      set((state) => ({
        powers: {
          ...state.powers,
          ...data,
        },
      })),
    updateSigning: ({ isNotarization, isWitnesses }) =>
      set({ isNotarization, isWitnesses }),
    resetPowersState: () =>
      set({
        powers: {
          generalOverallAuthority: '',
          isMaintenance: null,
          isManageAccounts: null,
          isManageProperty: null,
          isManageRealEstate: null,
          isManageInsuranceAndAnnuityTransactions: null,
          isManageRetirementAccounts: null,
          isManageGovernmentalBenefits: null,
          isManageTaxMatters: null,
          isManageEstateTrust: null,
          isMakeGifts: null,
          isManageSecurities: null,
          isManageClaimsLitigations: null,
          restrictions: '',
          isGuardian: null,
          isOver18: false,
          isRestrictions: null,
          guardian: {
            fullName: '',
            email: '',
            phoneNumber: '',
            postalAddress: '',
          },
        },
        isNotarization: null,
        isWitnesses: null,
        isCompletedAgentPowersSection: false,
        isCompletedSigningSection: false,
      }),
  }),
);
