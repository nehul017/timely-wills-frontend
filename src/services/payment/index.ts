import axiosInstance from '@/axios-settings';

import { PaymentBody } from './types';

class PaymentAPI {
  async post(body: PaymentBody) {
    try {
      const res = await axiosInstance.post(
        '/payment/create_checkout_session',
        body,
      );

      return res.data.clientSecret;
    } catch (error) {
      throw error;
    }
  }
}

const paymentApi = new PaymentAPI();

export default paymentApi;
