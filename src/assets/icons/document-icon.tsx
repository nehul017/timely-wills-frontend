import React from 'react';

import { IconProps } from '@/types';

function DocumentIcon({ fill, ...props }: IconProps) {
  return (
    <svg
      width='32'
      height='41'
      viewBox='0 0 32 41'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M20 0.500488H4C1.8 0.500488 0.0200005 2.30049 0.0200005 4.50049L0 36.5005C0 38.7005 1.78 40.5005 3.98 40.5005H28C30.2 40.5005 32 38.7005 32 36.5005V12.5005L20 0.500488ZM24 32.5005H8V28.5005H24V32.5005ZM24 24.5005H8V20.5005H24V24.5005ZM18 14.5005V3.50049L29 14.5005H18Z'
        fill={fill || '#25D998'}
      />
    </svg>
  );
}

export default DocumentIcon;
