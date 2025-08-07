import React from 'react';

import { IconProps } from '@/types';

function PencillFillIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_1106_59236)'>
        <path
          d='M2.75 15.8124V19.2499H6.1875L16.3258 9.11152L12.8883 5.67402L2.75 15.8124ZM18.9842 6.45318C19.3417 6.09568 19.3417 5.51818 18.9842 5.16068L16.8392 3.01568C16.4817 2.65818 15.9042 2.65818 15.5467 3.01568L13.8692 4.69318L17.3067 8.13068L18.9842 6.45318Z'
          fill={fill || '#636B65'}
        />
      </g>
      <defs>
        <clipPath id='clip0_1106_59236'>
          <rect width='22' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PencillFillIcon;
