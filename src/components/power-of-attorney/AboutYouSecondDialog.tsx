import Link from 'next/link';
import React from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import HouseIcon from '@/assets/icons/house-icon';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function AboutYouSecondDialog() {
  return (
    <Dialog>
      <DialogTrigger className='flex items-center text-lg font-semibold text-bright'>
        Create Document
        <ArrowRightIcon fill='#25D998' className='ml-1' />
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent
        className='mt-[93px] p-6 lg:mt-[160px] lg:w-[640px] lg:p-[30px]'
        isCloseIconHidden
      >
        <div className='mb-6 flex flex-col items-center lg:mb-8 lg:flex-row'>
          <div className='order-2 mt-[18px] lg:order-1 lg:mr-[83px] lg:mt-0'>
            <DialogTitle className='mb-[10px] text-center lg:mb-2 lg:text-start'>
              Tell us about yourself!
            </DialogTitle>
            <DialogDescription className='text-center lg:text-start'>
              You first must complete the about you section
            </DialogDescription>
          </div>
          <HouseIcon className='order-1 shrink-0 lg:order-2 lg:h-[94px] lg:w-[96px]' />
        </div>

        <div className='flex items-center justify-between space-x-2'>
          <DialogTrigger className='flex h-[52px] w-full items-center justify-center rounded-lg border border-[#DEE0DF] text-sm font-semibold lg:w-[140px]'>
            <ArrowRightIcon fill='#010D04' className='mr-1 rotate-180' />
            Back
          </DialogTrigger>
          <Link className='w-full lg:w-[256px]' href='/about'>
            <DialogTrigger className='h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:w-[256px]'>
              Start
            </DialogTrigger>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AboutYouSecondDialog;
