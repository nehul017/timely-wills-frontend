import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExecutorsState } from '@/store/will/executor';

function ExecuterDialog() {
  const { primaryExecutor } = useExecutorsState();

  return (
    <Dialog defaultOpen={!primaryExecutor?.fullName}>
      <DialogOverlay />
      <DialogContent className='lg:w-[730px]'>
        <DialogTitle className='mb-8'>What is an Executor?</DialogTitle>
        <DialogDescription className='mb-6 text-[16px] tracking-tighter text-[#010D0499] lg:mb-8'>
          An executor is responsible for carrying out the instructions of your
          will after your death. This process is known as &quot;administering
          your estate.&quot; The executor’s duties include managing your
          finances, ensuring that any debts or taxes are paid, and distributing
          the remaining assets according to your will. It is a significant
          responsibility.
        </DialogDescription>

        <h3 className='mb-2 text-lg font-semibold lg:mb-[18px] lg:text-xl'>
          Choosing Your Executor
        </h3>
        <p className='text-[16px] tracking-tighter text-[#010D0499]'>
          When choosing an executor, common choices are a spouse, trusted
          friend, or a relative. The following pages will provide detailed
          information to help you make an informed decision. Please note that
          this section may take a bit longer to read through due to the
          importance of the details involved.
        </p>

        <DialogTrigger className='mt-6 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:ml-[62%] lg:mt-8 lg:w-[256px]'>
          I understand
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

export default ExecuterDialog;
