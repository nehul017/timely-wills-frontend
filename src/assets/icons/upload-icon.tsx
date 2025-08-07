import React from 'react';

import { IconProps } from '@/types';

function UploadIcon({ fill }: IconProps) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.0827 14.667V7.19616L7.69935 9.57949L6.41602 8.25033L10.9993 3.66699L15.5827 8.25033L14.2993 9.57949L11.916 7.19616V14.667H10.0827ZM5.49935 18.3337C4.99518 18.3337 4.56359 18.1541 4.20456 17.7951C3.84553 17.4361 3.66602 17.0045 3.66602 16.5003V13.7503H5.49935V16.5003H16.4993V13.7503H18.3327V16.5003C18.3327 17.0045 18.1532 17.4361 17.7941 17.7951C17.4351 18.1541 17.0035 18.3337 16.4993 18.3337H5.49935Z'
        fill={fill || 'white'}
      />
    </svg>
  );
}

export default UploadIcon;
