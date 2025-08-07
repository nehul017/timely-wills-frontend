import React, { ReactNode } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';

import { Button } from './ui/button';

type Props = {
  isHiddenSubmitButton?: boolean;
  isLoading?: boolean;
  isNextLoading?: boolean;
  handleNext: () => void;
  handleBack: () => void;
  children: ReactNode;
  typeNextBtn?: 'button' | 'submit' | 'reset';
};

function FormWrapper({
  children,
  handleBack,
  handleNext,
  isLoading,
  isNextLoading,
  isHiddenSubmitButton,
  typeNextBtn,
}: Props) {
  return (
    <>
      {children}
      <div className='mt-8 flex justify-between gap-2 lg:mt-9'>
        <Button
          type='button'
          onClick={handleBack}
          variant='outline'
          className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
        >
          <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
          Back
        </Button>

        <Button
          isLoading={isNextLoading}
          onClick={handleNext}
          type={typeNextBtn}
          className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
        >
          Next
        </Button>
      </div>

      {!isHiddenSubmitButton && (
        <Button
          isLoading={isLoading}
          className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
          type='submit'
          variant='outline'
        >
          <SaveIcon className='mr-1' /> Save and exit
        </Button>
      )}
    </>
  );
}

export default FormWrapper;
