'use client';

import { useEffect } from 'react';

import Stepper from '@/components/Stepper';
import { livingWillSteps } from '@/constant/poa';
import useFetchLivingWill from '@/hooks/living-will/use-fetch-living-will';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useProgressStepStore } from '@/store/progress-steps';

import LivingWillReview from './LivingWillReview';
import SpecificWishes from './SpecificWishes';
import WishesForm from './WishesForm';
import DownloadDocument from '../DownloadDocument';

function LivingWillSection() {
  const { livingWillStep } = useProgressStepStore();
  const { fetchLivingWill } = useFetchLivingWill();
  const { url } = useLivingWillWishesStore();

  useEffect(() => {
    fetchLivingWill();
  }, []);

  return (
    <>
      <Stepper steps={livingWillSteps} />
      {!livingWillStep && <WishesForm />}
      {livingWillStep === 1 && <SpecificWishes />}
      {livingWillStep === 2 && <LivingWillReview />}
      {livingWillStep === 3 && (
        <DownloadDocument editStep={2} title='Living Will' url={url || ''} />
      )}
    </>
  );
}

export default LivingWillSection;
