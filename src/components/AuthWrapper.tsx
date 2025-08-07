'use client';

import { ReactNode, useEffect } from 'react';

import { useSessionTimeout } from '@/hooks/use-session-timeout';
import useFetchUserInfo from '@/hooks/user-info/use-fetch-user-info';
import { getSessionData, isSessionExpired } from '@/utils/session';

type Props = {
  children: ReactNode;
};

function AuthWrapper({ children }: Props) {
  const { fetchUserInfo } = useFetchUserInfo();

  // Initialize session timeout monitoring
  useSessionTimeout({
    checkInterval: 60000, // Check every minute
  });

  useEffect(() => {
    const sessionData = getSessionData();

    if (sessionData && !isSessionExpired()) {
      fetchUserInfo();
    }
  }, [fetchUserInfo]);

  return children;
}

export default AuthWrapper;
