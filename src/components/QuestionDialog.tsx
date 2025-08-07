import React, { ReactNode } from 'react';

import WarningIcon from '@/assets/icons/warning-icon';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type Props = {
  question: string;
  children: ReactNode;
};

function QuestionDialog({ children, question }: Props) {
  return (
    <div className='absolute right-[-20px] top-0'>
      <Dialog>
        <DialogTrigger className='block'>
          <WarningIcon className='h-4 w-4' fill='#8D9395' />
        </DialogTrigger>
        <DialogOverlay />
        <DialogContent className='p-6 lg:w-[790px] lg:p-[30px]'>
          <DialogTitle className='mb-6 w-[231px] leading-7 lg:mb-8 lg:w-[684px] lg:font-bold lg:leading-10'>
            {question}
          </DialogTitle>
          <DialogDescription className='text-[16px] font-normal text-[#010D0499]'>
            {children}
          </DialogDescription>

          <DialogTrigger className='mt-6 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:ml-[78%] lg:mt-8 lg:w-[160px]'>
            Ok
          </DialogTrigger>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QuestionDialog;
