import React from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import useMedicalPOAReview from '@/hooks/medical-poa/useMedicalPOAReview';
import { getAgentOptions } from '@/utils';

type Props = {
  handleClick: () => void;
};

function PrimaryPhysicianPreviewCard({ handleClick }: Props) {
  const { physician } = useMedicalPOAReview();

  if (!physician.fullName) return null;

  return (
    <article className='mb-[36px]'>
      <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>
        Primary Physician
      </h2>

      <div className='rounded-lg border border-[#8D9395] p-5'>
        <div>
          <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
            Primary Physician
            <Button
              onClick={handleClick}
              variant='ghost'
              className='h-fit w-fit p-0'
            >
              <PencillFillIcon />
            </Button>
          </h3>

          <div className='flex flex-col space-y-4'>
            {getAgentOptions(physician).map(({ id, key, value }) => (
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

export default PrimaryPhysicianPreviewCard;
