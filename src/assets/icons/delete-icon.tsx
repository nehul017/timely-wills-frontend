import React from 'react';

import { IconProps } from '@/types';

function DeleteIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_3010_3873)'>
        <path
          d='M13.3346 7.50098V15.8343H6.66797V7.50098H13.3346ZM12.0846 2.50098H7.91797L7.08464 3.33431H4.16797V5.00098H15.8346V3.33431H12.918L12.0846 2.50098ZM15.0013 5.83431H5.0013V15.8343C5.0013 16.751 5.7513 17.501 6.66797 17.501H13.3346C14.2513 17.501 15.0013 16.751 15.0013 15.8343V5.83431Z'
          fill={fill || '#E51A29'}
        />
      </g>
      <defs>
        <clipPath id='clip0_3010_3873'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default DeleteIcon;
