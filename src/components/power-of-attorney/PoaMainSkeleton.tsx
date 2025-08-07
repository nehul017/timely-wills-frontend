import React from 'react';

import { Skeleton } from '../ui/skeleton';

function PoaMainSkeleton() {
  return (
    <div className='mx-auto max-w-[1200px] px-6 xl:px-0'>
      <div className='mt-12 lg:flex lg:justify-between'>
        <div>
          <Skeleton className='mb-3 h-9 w-[300px]' />
          <Skeleton className='mb-3 h-[16px] w-full lg:w-[500px]' />
        </div>

        <Skeleton className='mb-3 hidden h-[76px] w-[76px] rounded-[16px] lg:inline-flex' />
      </div>

      <div className='mt-8 lg:mt-12'>
        <div className='mb-6 lg:mb-[18px] lg:flex lg:justify-between'>
          <Skeleton className='mb-[18px] h-[22px] w-[200px] self-end' />
          <Skeleton className='h-[52px] w-full lg:w-[259px]' />
        </div>

        <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
          <Skeleton className='h-[216px] w-full' />
          <Skeleton className='h-[216px] w-full' />
        </div>
      </div>

      <div className='mt-8 lg:mt-12'>
        <Skeleton className='h-[22px] w-full lg:w-[320px]' />
        <Skeleton className='mt-[18px] h-[169px] w-full' />
      </div>
    </div>
  );
}

export default PoaMainSkeleton;
