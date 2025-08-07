'use client';

import React from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { useProgressStepStore } from '@/store/progress-steps';
import { Guardian } from '@/store/will/family-and-guardians/types';

type Props = {
  guardian: Guardian | null;
  familyMemberName: string;
  subStep: number;
};

function GuardianReviewCard({ guardian, familyMemberName, subStep }: Props) {
  const { setWillMainStep, setSubStep } = useProgressStepStore();

  const handleClick = () => {
    setWillMainStep(0);
    setSubStep(subStep);
  };

  return (
    <div>
      <h3 className='mb-[18px] flex items-center justify-between text-lg font-semibold'>
        {`Guardian for "${familyMemberName}"`}
        <Button
          onClick={handleClick}
          variant='ghost'
          className='h-fit w-fit p-0'
        >
          <PencillFillIcon />
        </Button>
      </h3>

      <p className='mb-[16px] flex flex-col space-y-1 text-sm'>
        Guardian’s full legal name:
        <span className='text-[16px] font-semibold'>{guardian?.fullName}</span>
      </p>

      <p className='flex flex-col space-y-1 text-sm'>
        {guardian?.email
          ? 'Guardian’s email address:'
          : 'Guardian’s postal address:'}

        <span className='text-[16px] font-semibold'>
          {guardian?.email || guardian?.address}
        </span>
      </p>
    </div>
  );
}

export default GuardianReviewCard;
