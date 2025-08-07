import React from 'react';

import CloseIcon from '@/assets/icons/close-icon';
import SuccessIcon from '@/assets/icons/success';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  estateDialogListItems1,
  estateDialogListItems2,
} from '@/constant/will';
import { useEstateState } from '@/store/will/estate';

function EstateDialog() {
  const { beneficiaries } = useEstateState();

  return (
    <Dialog defaultOpen={!beneficiaries.length}>
      <DialogOverlay />
      <DialogContent className='lg:w-[730px]'>
        <DialogTitle className='mb-8'>Your Estate</DialogTitle>
        <DialogDescription className='mb-6 text-[16px] tracking-tighter text-[#010D0499] lg:mb-8'>
          Your estate encompasses everything you own, excluding any specific
          gifts you have designated to individuals. This remaining portion is
          known as your residuary estate. In this section, you can distribute
          your residuary estate among people and charities. You’ll be able to
          add specific gifts in the next section.
        </DialogDescription>

        <h3 className='mb-2 text-lg font-semibold lg:mb-[18px] lg:text-xl'>
          What Your Residuary Estate Includes:
        </h3>
        <ul className='mb-6 space-y-2 text-[16px] tracking-tighter text-[#010D0499] lg:mb-8'>
          {estateDialogListItems1.map((item) => (
            <li className='flex lg:items-center' key={item}>
              <SuccessIcon className='mr-[6px] shrink-0' />
              {item}
            </li>
          ))}
        </ul>

        <h3 className='mb-2 text-lg font-semibold lg:mb-[18px] lg:text-xl'>
          What Your Residuary Estate Does Not Include:
        </h3>
        <ul className='space-y-2 text-[16px] tracking-tighter text-[#010D0499]'>
          {estateDialogListItems2.map((item) => (
            <li className='flex lg:items-center' key={item}>
              <CloseIcon
                className='mr-[6px] h-[22px] w-[22px] shrink-0'
                fill='#E51A29'
              />
              {item}
            </li>
          ))}
        </ul>

        <DialogTrigger className='mt-6 h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:ml-[62%] lg:mt-8 lg:w-[256px]'>
          I understand
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

export default EstateDialog;
