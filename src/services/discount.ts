import axiosInstance from '@/axios-settings';

export interface Discount {
  discount: number;
}

class PromocodeAPI {
  async getDiscount(code: string) {
    try {
      const res = await axiosInstance.get<Discount>(
        `/promocode/get-discount-by-code/${code}`,
      );

      return res.data.discount / 100;
    } catch (error) {
      throw error;
    }
  }
}

const promocodeAPI = new PromocodeAPI();

export default promocodeAPI;
