import React from 'react';

import { IconProps } from '@/types';

function BurgerIcon({ className }: IconProps) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_3010_6534)'>
        <path
          d='M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z'
          fill='#010D04'
        />
      </g>
      <defs>
        <clipPath id='clip0_3010_6534'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default BurgerIcon;
