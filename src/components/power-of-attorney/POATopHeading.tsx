import React, { ReactNode } from 'react';

import DynamicBreadcrumb from '../DynamicBreadcrumb';
import InfoPopup from '../InfoPopup';

type Props = {
  children: ReactNode;
};

function POATopHeading({ children }: Props) {
  return (
    <article className='flex justify-between py-[30px]'>
      <div>
        <DynamicBreadcrumb />
        <h1 className='mt-[30px] text-4xl font-bold'>{children}</h1>
      </div>
      <InfoPopup />
    </article>
  );
}

export default POATopHeading;
