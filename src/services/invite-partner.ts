import axiosInstance from '@/axios-settings';

export interface Promocode {
  id: number;
  code: string;
  isUsed: boolean;
  isSent: boolean | null;
  isWill: boolean;
  isPOA: boolean;
}

class InviteAPI {
  async invite(data: { email: string; userId: number }) {
    const body = { email: data.email };
    try {
      await axiosInstance.post('/promocode/send-invite-mail', body);
      const result = await axiosInstance.get<Promocode[]>(
        `/promocode/get-by-user-id/${data.userId}`,
      );

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getPromocodes(userId: number) {
    try {
      const res = await axiosInstance.get<Promocode[]>(
        `/promocode/get-by-user-id/${userId}`,
      );

      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

const inviteAPI = new InviteAPI();

export default inviteAPI;
