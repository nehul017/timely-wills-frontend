import { useCallback, useState } from 'react';

import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';

const useFetchUserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useAuthStore();

  const fetchUserInfo = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await userAPI.getUserInfo();

      if (response) {
        setUserInfo(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchUserInfo, isLoading };
};

export default useFetchUserInfo;
