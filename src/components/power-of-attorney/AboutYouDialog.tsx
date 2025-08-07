import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import CrossIcon from '@/assets/icons/cross-icon';
import HouseIcon from '@/assets/icons/house-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import aboutAPI from '@/services/about';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function AboutYouDialog() {
  const [isCompletedAbout, setIsCompletedAbout] = useState(false);

  useEffect(() => {
    aboutAPI
      .getAbout()
      .then(({ firstName }) => setIsCompletedAbout(!!firstName))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Dialog>
      <DialogTrigger className='flex h-[52px] w-full items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white lg:w-[269px]'>
        {isCompletedAbout ? (
          <>
            <PencillFillIcon className='mr-1 h-[22px] w-[22px]' fill='white' />
            Edit Your Information
          </>
        ) : (
          <>
            <CrossIcon className='mr-1 h-[22px] w-[22px]' fill='white' />
            Tell us about yourself
          </>
        )}
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent
        className='mt-[93px] p-6 lg:mt-[160px] lg:p-[30px]'
        isCloseIconHidden
      >
        <HouseIcon className='mx-auto mb-[18px] lg:mb-6 lg:h-[94px] lg:w-[96px]' />
        <DialogTitle className='mb-[10px] text-center lg:mb-2'>
          Tell us about yourself!
        </DialogTitle>
        <DialogDescription className='mb-6 text-center lg:mb-8'>
          Please complete the about you section
        </DialogDescription>

        <Link href='/about'>
          <DialogTrigger className='h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white'>
            Start
          </DialogTrigger>
        </Link>
        <DialogTrigger className='mt-3 w-full text-sm font-semibold'>
          Not now
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

export default AboutYouDialog;
