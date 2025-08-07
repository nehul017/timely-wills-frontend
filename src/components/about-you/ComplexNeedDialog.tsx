import React, { useState } from 'react';

import { needsItems, paragraphItems } from '@/constant/about';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function ComplexNeedDialog() {
  const [openFirstDialog, setOpenFirstDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenFirstDialog(false);
  };

  return (
    <Dialog onOpenChange={setOpenFirstDialog} open={openFirstDialog}>
      <DialogTrigger className='font-semibold text-[#010D04]'>
        Click here
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className='p-6 lg:w-[790px] lg:p-[30px]' isCloseIconHidden>
        <DialogTitle className='mb-[18px] text-xl font-semibold lg:text-xl lg:font-semibold'>
          While Timely meets most will-based estate planning needs for
          Americans, some situations may require specialized professional help.
          Timely may not be ideal for:
        </DialogTitle>

        <div className='mb-6 space-y-2'>
          {paragraphItems.map(({ key, value }, index) => (
            <DialogDescription
              key={key}
              className='flex space-x-1 text-[#010D0499]'
            >
              <span className='font-bold text-[#010D04]'>{`${index + 1}.`}</span>
              <span>
                <strong className='text-[#010D04]'>{key}</strong> {value}
              </span>
            </DialogDescription>
          ))}
        </div>

        <DialogTitle className='mb-[18px] text-xl font-semibold lg:text-xl lg:font-semibold'>
          Below are answers to some common questions about these complex needs:
        </DialogTitle>

        <div className='mb-6 space-y-2'>
          {needsItems.map(({ key, value }) => (
            <DialogDescription
              key={key}
              className='flex flex-col space-y-2 text-[#010D0499]'
            >
              <strong className='text-[#010D04]'>{key}</strong> {value}
            </DialogDescription>
          ))}
        </div>

        <Button
          onClick={handleOpenDialog}
          className='mt-8 h-[52px] w-full bg-bright text-lg font-semibold text-white lg:ml-[78%] lg:w-[160px]'
        >
          Ok
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ComplexNeedDialog;
