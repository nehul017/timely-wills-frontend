import { useRouter } from 'next/navigation';
import React from 'react';

import PlanStepper from './PlanStepper';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function AgreeDialog() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger className='mt-8 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:w-[341px]'>
        I agree
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className='p-6 lg:w-[460px] lg:p-[30px]' isCloseIconHidden>
        <DialogTitle className='mb-8 text-center'>
          What happens Next?
        </DialogTitle>
        <DialogDescription className='sr-only'>
          You have to Fill out the will questionnaire
        </DialogDescription>

        <PlanStepper />

        <Button
          onClick={() => router.push('/will/checkout')}
          className='mt-8 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white'
        >
          Continue to payment
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AgreeDialog;
