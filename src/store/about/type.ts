import { AboutBody } from '@/services/about/types';
import { AboutMainFormData, RelationshipFormData } from '@/types';

export interface Partner {
  fullName?: string;
  email?: string;
}

export interface AddressPropsAbout {
  city: string;
  address_line_1: string;
  address_line_2?: string;
  state: string;
  zip_code: string;
  county: string;
}

export interface AboutState {
  id: number | null;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  birthday: string;
  address: AddressPropsAbout;
  status: string;
  partner: Partner;
  updateMainInfo: (data: AboutMainFormData) => void;
  updateBirthday: (birthday: string) => void;
  updateAddress: (data: AddressPropsAbout) => void;
  updateStatus: (data: RelationshipFormData) => void;
  setEntireAbout: (data: AboutBody & { id: number }) => void;
  resetEntireAbout: () => void;
}
