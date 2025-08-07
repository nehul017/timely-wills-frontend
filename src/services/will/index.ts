import axiosInstance from '@/axios-settings';

import { WillRequestBody, WillResponse } from './types';

class WilllAPI {
  async getWill() {
    try {
      const res = await axiosInstance.get<WillResponse>('/my-will');

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async createWill(body: Partial<WillRequestBody>) {
    const data = { data: { ...body } };

    try {
      const res = await axiosInstance.post<WillResponse>('/wills', data);

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateWill(id: number, body: Partial<WillRequestBody>) {
    const data = { data: { ...body } };

    try {
      const res = await axiosInstance.put<WillResponse>(`/wills/${id}`, data);

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async removeWill(willId: number) {
    try {
      await axiosInstance.delete(`wills/${willId}`);
    } catch (error) {
      throw error;
    }
  }

  async generateFile(willId: number) {
    try {
      const res = await axiosInstance.get<string>(
        `wills/${willId}/generate-pdf`,
      );

      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

const willAPI = new WilllAPI();

export default willAPI;
