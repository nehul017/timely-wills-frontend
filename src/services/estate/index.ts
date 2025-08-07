import axiosInstance from '@/axios-settings';
import { Beneficiary } from '@/store/will/estate/types';

import { EstateBodyToCreate, EstateResponse } from './types';

class EstateService {
  async create(body: Partial<EstateBodyToCreate>) {
    const data = { data: { ...body } };
    try {
      const {
        data: {
          data: { attributes, id },
        },
      } = await axiosInstance.post<EstateResponse>('/beneficiaries', data);

      const res: Beneficiary = {
        ...attributes,
        id,
        address: attributes.address || '',
        email: attributes.email || '',
        websiteLink: attributes.websiteLink || '',
        phoneNumber: attributes.phoneNumber || '',
        backupType: attributes.backupType || '',
        personType: attributes.personType || '',
        backupBeneficiaries: [],
      };

      return res;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, body: Partial<EstateBodyToCreate>) {
    const data = { data: { ...body } };
    try {
      const {
        data: {
          data: { attributes, id: resId },
        },
      } = await axiosInstance.put<EstateResponse>(`/beneficiaries/${id}`, data);

      const res: Beneficiary = {
        ...attributes,
        id: resId,
        address: attributes.address || '',
        email: attributes.email || '',
        websiteLink: attributes.websiteLink || '',
        phoneNumber: attributes.phoneNumber || '',
        backupType: attributes.backupType || '',
        personType: attributes.personType || '',
        backupBeneficiaries: [],
      };

      return res;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const response = await axiosInstance.delete(`/beneficiaries/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const estateAPI = new EstateService();

export default estateAPI;
