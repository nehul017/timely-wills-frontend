import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  getSessionData,
  isSessionExpired,
  clearSession,
  updateLastActivity,
} from '@/utils/session';

const getToken = (): string | null => {
  // Check if session is expired before returning token
  if (isSessionExpired()) {
    clearSession();
    return null;
  }

  const sessionData = getSessionData();
  return sessionData?.token || null;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      // Update last activity on API requests
      updateLastActivity();

      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Update activity on successful responses
    updateLastActivity();
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('API error:', error);

    // Handle 401 Unauthorized - likely expired session
    if (error.response?.status === 401) {
      clearSession();
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = getToken();

    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      };
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    console.error('API error:', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
