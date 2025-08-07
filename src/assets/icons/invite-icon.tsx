import React from 'react';

import { IconProps } from '@/types';

function InviteIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_5037_27041)'>
        <path
          d='M18.332 3.6665H3.66536C2.65703 3.6665 1.83203 4.4915 1.83203 5.49984V16.4998C1.83203 17.5082 2.65703 18.3332 3.66536 18.3332H11.9154V16.4998H3.66536V7.33317L10.9987 11.9165L18.332 7.33317V11.9165H20.1654V5.49984C20.1654 4.4915 19.3404 3.6665 18.332 3.6665ZM10.9987 10.0832L3.66536 5.49984H18.332L10.9987 10.0832ZM17.4154 13.7498L21.082 17.4165L17.4154 21.0832V18.3332H13.7487V16.4998H17.4154V13.7498Z'
          fill={fill || '#010D04'}
        />
      </g>
      <defs>
        <clipPath id='clip0_5037_27041'>
          <rect width='22' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default InviteIcon;
