'use client';

import React, { useEffect } from 'react';

import DigitalMain from '@/components/digital-vault/DigitalMain';
import DigitalPreview from '@/components/digital-vault/DigitalPreview';
import Footer from '@/components/Footer';
import withAuth from '@/components/withAuth';
import useFetchHealthCare from '@/hooks/health-care/use-fetch-health-care';
import { useAuthStore } from '@/store/user-info';

function DigitalVaultPage() {
  const { userInfo } = useAuthStore();
  const { fetchHealthCare } = useFetchHealthCare();
  const shouldRenderDigital = !!userInfo?.products?.length;

  useEffect(() => {
    fetchHealthCare();
  }, []);

  return (
    <div className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
      {shouldRenderDigital ? (
        <>
          <DigitalMain />
          <Footer />
        </>
      ) : (
        <DigitalPreview />
      )}
    </div>
  );
}

export default withAuth(DigitalVaultPage);
