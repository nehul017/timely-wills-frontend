import React from 'react';

import { IconProps } from '@/types';

function FacebookIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='50'
      height='50'
      viewBox='0 0 50 50'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <circle cx='25' cy='25' r='25' fill={fill || '#25D998'} />
      <g clipPath='url(#clip0_1408_3584)'>
        <path
          d='M30.6482 26.2825L31.3219 21.8461H27.1073V18.9684C27.1073 17.7544 27.695 16.5704 29.5826 16.5704H31.5V12.7934C31.5 12.7934 29.7607 12.4937 28.0986 12.4937C24.626 12.4937 22.3584 14.6189 22.3584 18.4648V21.8461H18.5V26.2825H22.3584V37.0078C23.1331 37.1307 23.9256 37.1937 24.7329 37.1937C25.5402 37.1937 26.3326 37.1307 27.1073 37.0078V26.2825H30.6482Z'
          fill='white'
        />
      </g>
      <defs>
        <clipPath id='clip0_1408_3584'>
          <rect
            width='26'
            height='26'
            fill='white'
            transform='translate(12 11.8438)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FacebookIcon;
