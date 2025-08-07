import axiosInstance from '@/axios-settings';

import { LivingWill, LivingWillGetResponse, LivingWillBody } from './types';

class LivingWillService {
  async getLivingWill() {
    try {
      const response =
        await axiosInstance.get<LivingWillGetResponse>('/my-living-will');

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createLivingWill(body: Partial<LivingWillBody>) {
    const bodyData = { data: { ...body } };
    try {
      const res = await axiosInstance.post<LivingWillGetResponse>(
        '/living-wills',
        bodyData,
      );

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateLivingWill(id: number, body: Partial<LivingWillBody>) {
    const bodyData = { data: { ...body } };
    try {
      const {
        data: { data },
      } = await axiosInstance.put<LivingWill>(`/living-wills/${id}`, bodyData);

      const livingWill: LivingWillGetResponse = {
        ...data.attributes,
        id: data.id,
      };

      return livingWill;
    } catch (error) {
      throw error;
    }
  }

  async generateFile(id: number) {
    try {
      const response = await axiosInstance.get<string>(
        `/living-wills/${id}/generate-pdf`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const response = await axiosInstance.delete<LivingWill>(
        `/living-wills/${id}`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const livingWillAPI = new LivingWillService();

export default livingWillAPI;
