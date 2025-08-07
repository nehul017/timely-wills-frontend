import axiosInstance from '@/axios-settings';

import { HealthCare, HealthCareBody, HealthCareUpdateResponse } from './types';
import { LivingWillGetResponse } from '../living-will/types';

class HealthCareService {
  async getHealthCare() {
    try {
      const response = await axiosInstance.get<HealthCare>(
        '/health-care-directives/my-health-care-directive',
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createHealthCare(body: HealthCareBody) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.post<HealthCare>(
        '/health-care-directives',
        data,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateHealthCare(id: number, body: HealthCareBody) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.put<HealthCareUpdateResponse>(
        `/health-care-directives/${id}`,
        data,
      );

      const result = {
        id: response.data.data.id,
        url: response.data.data.attributes.url,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async generateFile(id: number) {
    try {
      const response = await axiosInstance.get<string>(
        `/health-care-directives/${id}/generate-pdf`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const [livingData] = await Promise.all([
        axiosInstance.get<LivingWillGetResponse>('/my-living-will'),
      ]);

      await Promise.all([
        axiosInstance.delete<HealthCare>(`/health-care-directives/${id}`),
        axiosInstance.delete<LivingWillGetResponse>(
          `/living-wills/${livingData.data.id}`,
        ),
      ]);
    } catch (error) {
      throw error;
    }
  }
}

const healthCareAPI = new HealthCareService();

export default healthCareAPI;
