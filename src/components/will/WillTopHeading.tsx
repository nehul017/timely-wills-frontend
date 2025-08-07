import React from 'react';

import InfoPopup from '../InfoPopup';

type Props = {
  heading: string;
  description?: string;
};

function WillTopHeading({ heading, description }: Props) {
  return (
    <div className='relative flex justify-between'>
      <div className='max-w-[690px]'>
        <h1 className='h2 mb-2'>{heading}</h1>
        {description && <p className='text-sm'>{description}</p>}
      </div>

      <InfoPopup />
    </div>
  );
}

export default WillTopHeading;
