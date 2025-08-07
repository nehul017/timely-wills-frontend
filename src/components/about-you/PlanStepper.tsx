import React from 'react';

import FillOutIcon from '@/assets/icons/fill-out-icon';
import PurchaseIcon from '@/assets/icons/purchase-icon';
import SignIcon from '@/assets/icons/sign-icon';
import SuccessIcon from '@/assets/icons/success';

function PlanStepper() {
  return (
    <div className='flex flex-col'>
      <div className='flex max-h-11 items-center gap-[20px]'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bright'>
          <SuccessIcon className='shrink-0' fill='white' />
        </div>

        <p className='text-lg'>Account creation</p>
      </div>

      <div className='ml-[22px] h-8 w-[1px] bg-[#DEE0DF]' />

      <div className='flex max-h-11 items-center gap-[20px]'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#010D04]'>
          <PurchaseIcon className='shrink-0' />
        </div>

        <p className='text-lg'>Purchase your plan</p>
      </div>

      <div className='ml-[22px] h-8 w-[1px] bg-[#DEE0DF]' />

      <div className='flex max-h-11 items-center gap-[20px]'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#010D04]'>
          <FillOutIcon className='shrink-0' />
        </div>

        <p className='text-lg'>Fill out the will questionnaire</p>
      </div>

      <div className='ml-[22px] h-8 w-[1px] bg-[#DEE0DF]' />

      <div className='flex max-h-11 items-center gap-[20px]'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#010D04]'>
          <SignIcon className='shrink-0' />
        </div>

        <p className='text-lg'>Sign & notarize your documents</p>
      </div>
    </div>
  );
}

export default PlanStepper;
