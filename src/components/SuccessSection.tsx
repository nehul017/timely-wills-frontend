'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import BigCheckIcon from '@/assets/icons/big-check-icon';
import useFetchAbout from '@/hooks/about/use-fetch-about';
import { useAboutStore } from '@/store/about';
import { useProgressStepStore } from '@/store/progress-steps';
import AboutYouSecondDialog from '@/components/power-of-attorney/AboutYouSecondDialog';

type Props = {
  path: '/will' | '/Power-of-attorney';
};

function SuccessSection({ path }: Props) {
  const isWill = path === '/will';
  const { fetchAbout } = useFetchAbout();
  const { firstName } = useAboutStore();
  const { setCurrentAboutStep } = useProgressStepStore();
  const router = useRouter();

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleCreateDocument = () => {
    setCurrentAboutStep(0);
    router.push(path);
  };

  const renderCreateDocumentButton = () => {
    if (firstName) {
      return (
        <button
          onClick={handleCreateDocument}
          className='flex h-[42px] w-[302px] items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white'
        >
          Create Document
        </button>
      );
    }
    return <AboutYouSecondDialog />;
  };

  return (
    <section className='success flex flex-col items-center justify-center space-y-9 px-6 xl:px-0'>
      <BigCheckIcon className='mb-[15px]' />
      <h1 className='max-w-[700px] text-center text-3xl font-bold leading-[50px] lg:text-[35px]'>
        {isWill
          ? 'Success! You’ve paid for your Last Will and Testament.'
          : "Success! You've paid for your Power of Attorneys."}
      </h1>
      {renderCreateDocumentButton()}
    </section>
  );
}

export default SuccessSection;
