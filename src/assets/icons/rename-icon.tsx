import React from 'react';

import { IconProps } from '@/types';

function RenameIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='20'
      height='21'
      viewBox='0 0 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_3010_1043)'>
        <path
          d='M15.3417 5.33372L14.3333 4.32539C13.6833 3.67539 12.625 3.67539 11.975 4.32539L9.74167 6.55872L2.5 13.8004V17.1671H5.86667L13.15 9.88372L15.3417 7.69206C16 7.04206 16 5.98372 15.3417 5.33372ZM5.175 15.5004H4.16667V14.4921L11.3833 7.27539L12.3917 8.28372L5.175 15.5004ZM9.16667 17.1671L12.5 13.8337H17.5V17.1671H9.16667Z'
          fill={fill || '#010D04'}
        />
      </g>
      <defs>
        <clipPath id='clip0_3010_1043'>
          <rect
            width='20'
            height='20'
            fill='white'
            transform='translate(0 0.5)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default RenameIcon;
