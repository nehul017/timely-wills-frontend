import { useRouter } from 'next/navigation';
import React from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import { healthCareList } from '@/constant/poa';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function HealthCareDialog() {
  const { isHealthCare } = useMedicalPOAAgentStore();
  const router = useRouter();

  const handleClick = () => {
    const initPath = '/Power-of-attorney/Health-Care-Directives';
    router.push(
      isHealthCare === null
        ? initPath
        : `${initPath}/${isHealthCare ? 'Medical-POA-and-Living-Will' : 'Medical-POA'}`,
    );
  };

  return (
    <Dialog>
      <DialogTrigger className='flex items-center text-lg font-semibold text-bright'>
        Create Document
        <ArrowRightIcon fill='#25D998' className='ml-1' />
      </DialogTrigger>

      <DialogOverlay />

      <DialogContent className='p-6 lg:w-[790px] lg:p-[30px]'>
        <DialogTitle className='mb-6 w-[231px] lg:mb-8 lg:w-full lg:font-bold'>
          Health Care Directives
        </DialogTitle>

        <DialogDescription className='mb-6 text-[#010D0499] lg:mb-8'>
          This document helps you outline your healthcare wishes and appoint
          someone to make decisions on your behalf if you are unable to do so.
          You will be creating a Medical Power of Attorney, with the option to
          add on the Living Will as well.
        </DialogDescription>

        <ul className='flex flex-col gap-[14px]'>
          {healthCareList.map(({ description, id, title }) => (
            <li className='text-[16px]' key={id}>
              <h4 className='mb-2 font-semibold'>{title}</h4>
              <p className='text-[#010D0499]'>{description}</p>
            </li>
          ))}
        </ul>

        <DialogTrigger
          onClick={handleClick}
          className='mt-6 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:ml-[65%] lg:mt-8 lg:w-[256px]'
        >
          I understand
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

export default HealthCareDialog;
