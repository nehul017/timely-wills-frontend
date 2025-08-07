'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import POACheckout from '@/components/power-of-attorney/POACheckout';
import POAMain from '@/components/power-of-attorney/POAMain';
import PoaMainSkeleton from '@/components/power-of-attorney/PoaMainSkeleton';
import withAuth from '@/components/withAuth';
import useFetchUserInfo from '@/hooks/user-info/use-fetch-user-info';
import { useAuthStore } from '@/store/user-info';

function POAPage() {
  const { fetchUserInfo, isLoading } = useFetchUserInfo();
  const { userInfo } = useAuthStore();
  const router = useRouter();
  const shouldRenderPOA = userInfo?.products?.some(
    (product) => product.product_type === 'WILL',
  );

  useEffect(() => {
    if (userInfo?.subscription?.isExpired) {
      router.push('/renew');
    }
  }, [userInfo]);

  useEffect(() => {
    if (!shouldRenderPOA) {
      fetchUserInfo();
    }
  }, []);

  if (isLoading) {
    return <PoaMainSkeleton />;
  }

  return !shouldRenderPOA ? <POACheckout /> : <POAMain />;
}

export default withAuth(POAPage);
