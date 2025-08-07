import axiosInstance from '@/axios-settings';

import { About, AboutBody } from './types';

class AboutService {
  async getAbout() {
    try {
      const response = await axiosInstance.get<About>('/my-about');

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createAbout(body: AboutBody) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.post('/abouts', data);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAbout(id: number, body: AboutBody) {
    const data = { data: { ...body } };
    try {
      const response = await axiosInstance.put(`/abouts/${id}`, data);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const aboutAPI = new AboutService();

export default aboutAPI;
