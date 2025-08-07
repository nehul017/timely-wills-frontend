export interface EstateBodyToCreate {
  fullName: string;
  address: string;
  phoneNumber: string;
  backupType: string | null;
  email: string | null;
  websiteLink: string;
  backupBeneficiaries: number[];
  will: number;
  isBackup: boolean;
  percent: number;
  personType: string;
}

export interface EstateResponse {
  data: {
    id: number;
    attributes: {
      fullName: string;
      type: 'person' | 'charity';
      address: null | string;
      phoneNumber: null | string;
      backupType: null | string;
      email: null | string;
      websiteLink: null | string;
      personType: string;
      percent: number;
      isBackup: boolean;
    };
  };
}
