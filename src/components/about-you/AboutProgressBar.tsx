import React from 'react';

import { useProgressStepStore } from '@/store/progress-steps';

import { Progress } from '../ui/progress';

function AboutProgressBar() {
  const { aboutStep } = useProgressStepStore();
  const STEPS_QUANTITY = 3;

  return (
    <div className='border-b pb-[29px] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-[63px]'>
      <div className='mb-[5px] flex justify-between text-[16px] font-medium'>
        <p>About you</p>
        <p>{`${aboutStep + 1} of ${STEPS_QUANTITY}`}</p>
      </div>
      <Progress
        className='h-[14px] w-full lg:w-[233px]'
        value={(100 / STEPS_QUANTITY) * (aboutStep + 1)}
      />
    </div>
  );
}

export default AboutProgressBar;
