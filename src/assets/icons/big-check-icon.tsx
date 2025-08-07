import React from 'react';

import { IconProps } from '@/types';

function BigCheckIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='130'
      height='130'
      viewBox='0 0 130 130'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M65 0C29.1 0 0 29.1 0 65C0 100.9 29.1 130 65 130C100.9 130 130 100.9 130 65C130 29.1 100.9 0 65 0ZM101.29 46.535L53.86 93.96C52.67 95.145 50.745 95.145 49.555 93.96L48.6 93.005L48.595 93.01L22.5 66.73C21.31 65.54 21.31 63.61 22.5 62.42L28.97 55.955C30.16 54.765 32.09 54.765 33.28 55.955L51.725 74.535L90.505 35.755C91.695 34.565 93.625 34.565 94.815 35.755L101.285 42.225C102.48 43.41 102.48 45.34 101.29 46.535Z'
        fill={fill || '#25D998'}
      />
    </svg>
  );
}

export default BigCheckIcon;
