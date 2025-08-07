import axiosInstance from '@/axios-settings';
import { UserData, UserInfo } from '@/store/user-info/types';
import { storeSession, clearSession } from '@/utils/session';

import {
  LoginData,
  RegisterData,
  ResetPasswordBody,
  UpdatePasswordBody,
  UpdatePasswordRes,
} from './types';

class UserAPI {
  async login(data: LoginData) {
    try {
      const response = await axiosInstance.post<UserData>('/auth/local', data);

      storeSession(response.data.jwt);

      return response.data;
    } catch (error) {
      clearSession();
      throw error;
    }
  }

  async signUp(data: RegisterData) {
    try {
      const response = await axiosInstance.post<UserData>(
        '/auth/local/register',
        data,
      );

      localStorage.setItem('jwt', response.data.jwt);

      return response.data;
    } catch (error) {
      localStorage.removeItem('jwt');
      throw error;
    }
  }

  async getUserInfo() {
    try {
      const { data } = await axiosInstance.get<UserInfo>('/users/me');

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateEmail(id: number, email: string) {
    try {
      const response = await axiosInstance.put<UserInfo & { role: any }>(
        `/users/${id}`,
        {
          email,
        },
      );

      const { role, ...rest } = response.data;

      return rest;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(body: UpdatePasswordBody) {
    try {
      const response = await axiosInstance.post<UpdatePasswordRes>(
        '/auth/change-password',
        body,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(body: ResetPasswordBody) {
    try {
      const response = await axiosInstance.post<UpdatePasswordRes>(
        '/auth/reset-password',
        body,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(email: string) {
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const response = await axiosInstance.delete<UserInfo>(`/users/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendDeleteRequest() {
    try {
      await axiosInstance.post('/auth/send-delete-request');
    } catch (error) {
      throw error;
    }
  }
}

const userAPI = new UserAPI();

export default userAPI;
