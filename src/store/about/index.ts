import dayjs from 'dayjs';
import { create } from 'zustand';

import { AboutMainFormData, RelationshipFormData } from '@/types';

import { AboutState } from './type';

export const useAboutStore = create<AboutState>((set) => ({
  id: null,
  firstName: '',
  lastName: '',
  middleName: '',
  phoneNumber: '',
  state: '',
  birthday: '',
  address: {
    county: '',
    city: '',
    address_line_1: '',
    address_line_2: '',
    state: '',
    zip_code: '',
  },
  partner: {
    fullName: '',
    email: '',
  },
  status: '',
  updateMainInfo: (data: Partial<AboutMainFormData>) =>
    set({
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      phoneNumber: data.phoneNumber,
    }),
  updateBirthday: (birthday) => set({ birthday }),
  updateAddress: (data) =>
    set({
      address: { ...data },
      state: data.state,
    }),
  updateStatus: (data: RelationshipFormData) =>
    set({
      partner: { ...data.partner },
      status: data.status,
    }),
  setEntireAbout: (data) =>
    set({
      id: data.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      middleName: data.midleName || '',
      phoneNumber: data.phoneNumber || '',
      state: data.state || '',
      address: {
        county: data.county || '',
        city: data.address?.city || '',
        address_line_1: data.address?.address_line_1 || '',
        address_line_2: data.address?.address_line_2 || '',
        state: data.address?.state || '',
        zip_code: data.address?.zip_code || '',
      },
      birthday: data.dateOfBirth
        ? dayjs(data.dateOfBirth).format('MM/DD/YYYY')
        : '',
      partner: {
        fullName: data.partnerName || '',
        email: data.partnerEmail || '',
      },
      status:
        data.partnerStatus?.replace(
          data.partnerStatus[0],
          data.partnerStatus[0].toUpperCase(),
        ) || '',
    }),
  resetEntireAbout: () =>
    set({
      id: null,
      firstName: '',
      lastName: '',
      middleName: '',
      phoneNumber: '',
      state: '',
      birthday: '',
      address: {
        county: '',
        city: '',
        address_line_1: '',
        address_line_2: '',
        state: '',
        zip_code: '',
      },
      partner: {
        fullName: '',
        email: '',
      },
      status: '',
    }),
}));
