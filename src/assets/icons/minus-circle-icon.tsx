import React from 'react';

import { IconProps } from '@/types';

function MinusCircleIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_5135_2987)'>
        <path
          d='M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM21.25 16.25H8.75V13.75H21.25V16.25Z'
          fill={fill || '#25D998'}
        />
      </g>
      <defs>
        <clipPath id='clip0_5135_2987'>
          <rect width='30' height='30' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MinusCircleIcon;
