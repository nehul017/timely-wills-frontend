import { LivingWill } from '../living-will/types';
import { MedicalPoaGetResponse } from '../medical-poa/types';

export interface HealthCare {
  id: number;
  url: null | string;
  generatedAt: null | string;
  createdAt: string;
  updatedAt: string;
  publishedAt: null | string;
  livingWill: LivingWill;
  medicinPoa: MedicalPoaGetResponse;
}

export interface HealthCareUpdateResponse {
  data: {
    id: number;
    attributes: {
      url: string;
    };
  };
}

export interface HealthCareBody {
  livingWill: number;
  medicalPoa: number;
}
