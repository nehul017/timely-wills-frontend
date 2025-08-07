import React from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type Props = {
  document: 'Durable' | 'Medical' | 'Living Will';
  isLoading: boolean;
  handleSubmit: () => void;
};

function SubmitDialog({ document, handleSubmit, isLoading }: Props) {
  return (
    <Dialog>
      <DialogTrigger className='h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:w-[200px]'>
        Save & finish
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className='p-6 lg:w-[790px] lg:p-[30px]'>
        <DialogTitle className='mb-6 w-[231px] lg:mb-8 lg:w-[684px] lg:font-bold'>
          Review & Execution
        </DialogTitle>
        <DialogDescription className='text-[16px] font-normal text-[#010D0499]'>
          {`After reviewing your ${document} Power of Attorney, you will need to
          download and sign your document. You will be provided the exact
          instructions on how to do this in your state, and the requirements for
          the time of signing.`}
        </DialogDescription>

        <Button
          isLoading={isLoading}
          onClick={handleSubmit}
          className='mt-6 h-[52px] w-full bg-bright text-lg font-semibold text-white hover:bg-bright lg:ml-[65%] lg:mt-8 lg:w-[256px]'
        >
          I Understand
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitDialog;
