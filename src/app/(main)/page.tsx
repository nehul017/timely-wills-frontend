'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import WillMain from '@/components/will/WillMain';
import WillMainSkeleton from '@/components/will/WillMainSkeleton';
import withAuth from '@/components/withAuth';
import useFetchUserInfo from '@/hooks/user-info/use-fetch-user-info';
import { useAuthStore } from '@/store/user-info';

function Home() {
  const { fetchUserInfo, isLoading } = useFetchUserInfo();
  const { userInfo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.subscription?.isExpired) {
      router.push('/renew');
    }
  }, [userInfo]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return isLoading ? <WillMainSkeleton /> : <WillMain />;
}

export default withAuth(Home);
