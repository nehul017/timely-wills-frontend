'use client';

import { useProgressStepStore } from '@/store/progress-steps';

import AsignGiftsForm from './AsignGiftsForm';
import LeaveGiftsForm from './LeaveGiftsForm';
import ReviewGifts from './ReviewGifts';

function GiftsSection() {
  const { subStep } = useProgressStepStore();

  return (
    <>
      {!subStep && <LeaveGiftsForm />}
      {subStep === 1 && <AsignGiftsForm />}
      {subStep === 2 && <ReviewGifts />}
    </>
  );
}

export default GiftsSection;
