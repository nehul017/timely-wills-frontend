import axiosInstance from '@/axios-settings';

import { MedicalPOABody, MedicalPoa, MedicalPoaGetResponse } from './types';

class MedicalPOAService {
  async getMedicalPOA() {
    try {
      const response =
        await axiosInstance.get<MedicalPoaGetResponse>('/my-medical-poa');

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createtMedicalPOA(body: Partial<MedicalPOABody>) {
    const bodyData = { data: { ...body } };
    try {
      const res = await axiosInstance.post<MedicalPoaGetResponse>(
        '/medical-poas',
        bodyData,
      );

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMedicalPOA(id: number, body: Partial<MedicalPOABody>) {
    const bodyData = { data: { ...body } };
    try {
      const {
        data: { data },
      } = await axiosInstance.put<MedicalPoa>(`/medical-poas/${id}`, bodyData);

      const medical: MedicalPoaGetResponse = {
        ...data.attributes,
        id: data.id,
      };

      return medical;
    } catch (error) {
      throw error;
    }
  }

  async generateFile(id: number) {
    try {
      const response = await axiosInstance.get<string>(
        `/medical-poas/${id}/generate-pdf`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const response = await axiosInstance.delete<MedicalPoa>(
        `/medical-poas/${id}`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const medicalPoaAPI = new MedicalPOAService();

export default medicalPoaAPI;
