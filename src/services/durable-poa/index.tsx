import axiosInstance from '@/axios-settings';

import { DurablePOA, DurablePOABody } from './types';

class DurablePOAService {
  async getDurablePOA() {
    try {
      const response = await axiosInstance.get<DurablePOA>('/my-durable-poa');

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createDurablePOA(body: Partial<DurablePOABody>) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.post<DurablePOA>(
        '/durable-poas',
        data,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateDurablePOA(id: number, body: Partial<DurablePOABody>) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.put<DurablePOA>(
        `/durable-poas/${id}`,
        data,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async generateFile(id: number) {
    try {
      const response = await axiosInstance.get<string>(
        `/durable-poas/${id}/generate-pdf`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const response = await axiosInstance.delete<DurablePOA>(
        `/durable-poas/${id}`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const durablePoaAPI = new DurablePOAService();

export default durablePoaAPI;
