import { AddressProps } from '@/types';

export interface About {
  id: number;
  firstName: string | null;
  midleName: string | null;
  lastName: string | null;
  state: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  partnerStatus: string | null;
  partnerEmail: null | string;
  partnerName: null | string;
  // partnerAddress?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: null | string;
  county: null | string;
  address: null | AddressProps;
}

export interface AboutBody {
  county: null | string;
  firstName: string | null;
  midleName: string | null;
  lastName: string | null;
  state: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: AddressProps | null;
  partnerStatus: string | null;
  partnerEmail: string | null;
  partnerName: string | null;
}
