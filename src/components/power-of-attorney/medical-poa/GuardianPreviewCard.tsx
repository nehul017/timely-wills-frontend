import React from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import useMedicalPOAReview from '@/hooks/medical-poa/useMedicalPOAReview';
import { getAgentOptions } from '@/utils';

type Props = {
  handleClick: () => void;
};

function GuardianPreviewCard({ handleClick }: Props) {
  const { guardian } = useMedicalPOAReview();

  if (!guardian?.fullName) return null;

  return (
    <article className='mb-[36px]'>
      <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>Guardian</h2>

      <div className='rounded-lg border border-[#8D9395] p-5'>
        <div>
          <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
            Guardian
            <Button
              onClick={handleClick}
              variant='ghost'
              className='h-fit w-fit p-0'
            >
              <PencillFillIcon />
            </Button>
          </h3>

          <div className='flex flex-col space-y-4'>
            {getAgentOptions(guardian).map(({ id, key, value }) => (
              <p
                key={id}
                className={`${value ? 'flex flex-col space-y-1' : 'hidden'}`}
              >
                <span className='text-sm'>{key}</span>
                <span className='text-[16px] font-semibold'>{value}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default GuardianPreviewCard;
