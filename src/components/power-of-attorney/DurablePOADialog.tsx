import { useRouter } from 'next/navigation';
import React from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import { durableList } from '@/constant/poa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function DurablePOADialog() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/Power-of-attorney/Durable-POA');
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
          Durable (Financial) Power of Attorney
        </DialogTitle>

        <DialogDescription className='mb-6 text-[#010D0499] lg:mb-8'>
          A Durable Financial POA grants a trusted individual the authority to
          manage your financial affairs if you become unable to do so. This
          questionnaire will gather essential information needed to create your
          customized Financial POA for you.
        </DialogDescription>

        <div>
          <h3 className='mb-[18px] text-xl font-semibold'>
            Here’s an overview:
          </h3>

          <ul className='flex flex-col gap-[14px]'>
            {durableList.map(({ description, id, title }) => (
              <li className='text-[16px]' key={id}>
                <h4 className='mb-2 font-semibold'>{title}</h4>
                <p className='text-[#010D0499]'>{description}</p>
              </li>
            ))}
          </ul>

          <p className='mt-6 text-[16px] font-semibold lg:mt-8'>
            Your responses will ensure that the Financial POA accurately
            reflects your preferences and needs.
          </p>
        </div>

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

export default DurablePOADialog;
