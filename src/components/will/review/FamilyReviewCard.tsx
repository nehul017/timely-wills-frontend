import React from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { useProgressStepStore } from '@/store/progress-steps';

type Props = {
  fullName: string;
  birthday?: string;
  petType?: string;
  subStep: number;
};

function FamilyReviewCard({ fullName, birthday, petType, subStep }: Props) {
  const { setWillMainStep, setSubStep } = useProgressStepStore();

  const handleClick = () => {
    setWillMainStep(0);
    setSubStep(subStep);
  };

  return (
    <div>
      <h3 className='mb-[18px] flex items-center justify-between text-lg font-semibold'>
        {fullName}
        <Button
          onClick={handleClick}
          variant='ghost'
          className='h-fit w-fit p-0'
        >
          <PencillFillIcon />
        </Button>
      </h3>

      <p className='flex flex-col space-y-1 text-sm'>
        {birthday ? 'Child’s date of birth:' : 'What kind of animal?:'}
        <span className='text-[16px] font-semibold'>{birthday || petType}</span>
      </p>
    </div>
  );
}

export default FamilyReviewCard;
