export interface Beneficiary {
  id: number;
  fullName: string;
  email: string;
  address: string;
  personType: string;
  phoneNumber: string;
  websiteLink: string;
  backupType: string | null;
  percent: number;
  type: 'charity' | 'person';
  isBackup: boolean;
  backupBeneficiaries: Backup[];
}

export interface Backup
  extends Omit<Beneficiary, 'backupBeneficiaries' | 'backupType'> {
  backupType: null;
}

export interface Exclusion {
  fullName: string;
  whyIsExcluded: string;
}

export interface EstateData {
  beneficiaries: Beneficiary[];
  isExclusions: null | boolean;
  exclusions: Exclusion[];
  isCompletedEstateSection: boolean | null;
}

export interface EstateState {
  isExclusions: null | boolean;
  beneficiaries: Beneficiary[];
  beneficiary: Beneficiary | null;
  exclusions: Exclusion[];
  isCompletedEstateSection: boolean | null;
  addBeneficiaries: (data: Beneficiary) => void;
  updateBeneficiaries: (data: Beneficiary) => void;
  deleteBeneficiary: (id: number | string) => void;
  setEntireBeneficiaries: (data: Beneficiary[]) => void;
  setBeneficiaryToUpdate: (data: Beneficiary | null) => void;
  updateExclusions: (
    exclusions: Exclusion[],
    isExclusions: boolean | null,
  ) => void;
  setEntireEstate: (data: EstateData) => void;
  setIsCompletedEstateSection: (value: boolean) => void;
  resetEntireEstate: () => void;
}
