import React from 'react';

import { IconProps } from '@/types';

function DeleteFillIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_5002_14873)'>
        <path
          d='M5.50065 17.4167C5.50065 18.425 6.32565 19.25 7.33398 19.25H14.6673C15.6756 19.25 16.5006 18.425 16.5006 17.4167V6.41667H5.50065V17.4167ZM17.4173 3.66667H14.209L13.2923 2.75H8.70898L7.79232 3.66667H4.58398V5.5H17.4173V3.66667Z'
          fill={fill || '#25D998'}
        />
      </g>
      <defs>
        <clipPath id='clip0_5002_14873'>
          <rect width='22' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default DeleteFillIcon;
