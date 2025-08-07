import { Beneficiary, Exclusion } from '@/store/will/estate/types';
import { Executor } from '@/store/will/executor/types';
import { Guardian } from '@/store/will/family-and-guardians/types';
import { BeneficiaryForGift } from '@/store/will/gifts/types';

export interface FamilyMember {
  fullName: string;
  birthday: string | null;
  type: 'child' | 'pet';
  petType: string | null;
  guardian: Guardian[] | [];
}

export interface WillAttributes {
  url: null | string;
  isExclusions: boolean | null;
  isGifts: boolean | null;
  compensation: string | null;
  isWishes: boolean | null;
  wishes: boolean | null;
  exclusions: Exclusion;
  family: FamilyMember[];
}

export interface BackupResponse {
  id: number;
  fullName: string;
  type: 'charity' | 'person';
  address: string;
  phoneNumber: string;
  backupType: null;
  email: string | null;
  websiteLink: string;
  personType: string;
  percent: number;
  isBackup: boolean;
}

export interface BeneficiaryResponse
  extends Omit<Beneficiary, 'backupBeneficiaries'> {
  backupBeneficiaries: BackupResponse[];
}

export interface WillResponse {
  id: number;
  url: null | string;
  isExclusions: boolean | null;
  isGifts: boolean | null;
  compensation: boolean | null;
  isWishes: boolean | null;
  wishes: string | null;
  exclusions: Exclusion[];
  family: FamilyMember[];
  primaryExecutor: Executor;
  backupExecutor: Executor;
  isChildren: boolean | null;
  isPet: boolean | null;
  beneficiaries: BeneficiaryResponse[];
  beneficiaryForGift: BeneficiaryForGift[];
  isNotarization: boolean | null;
  isSelfProvingAffidavit: boolean | null;
  isCompletedFamilySection: boolean | null;
  isCompletedEstateSection: boolean | null;
  isCompletedGiftsSection: boolean | null;
  isCompletedExecutorsSection: boolean | null;
}

export interface WillRequestBody {
  family: FamilyMember[];
  primaryExecutor: Executor | null;
  backupExecutor: Executor | null;
  beneficiaryForGift: Omit<BeneficiaryForGift, 'id'>[];
  isGifts: boolean | null;
  isExclusions: boolean | null;
  exclusions: Exclusion[];
  isWishes: boolean | null;
  wishes: string | null;
  compensation: boolean | null;
  isChildren: boolean | null;
  isPet: boolean | null;
  isNotarization: boolean | null;
  isSelfProvingAffidavit: boolean | null;
  isCompletedFamilySection: boolean | null;
  isCompletedEstateSection: boolean | null;
  isCompletedGiftsSection: boolean | null;
  isCompletedExecutorsSection: boolean | null;
}
