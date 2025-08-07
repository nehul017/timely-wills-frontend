import React from 'react';

import { IconProps } from '@/types';

function DownloadIcon({ fill, className }: IconProps) {
  return (
    <svg
      width='20'
      height='21'
      viewBox='0 0 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M10.0007 13.833L5.83398 9.66634L7.00065 8.45801L9.16732 10.6247V3.83301H10.834V10.6247L13.0007 8.45801L14.1673 9.66634L10.0007 13.833ZM5.00065 17.1663C4.54232 17.1663 4.14996 17.0031 3.82357 16.6768C3.49718 16.3504 3.33398 15.958 3.33398 15.4997V12.9997H5.00065V15.4997H15.0007V12.9997H16.6673V15.4997C16.6673 15.958 16.5041 16.3504 16.1777 16.6768C15.8513 17.0031 15.459 17.1663 15.0007 17.1663H5.00065Z'
        fill={fill || '#010D04'}
      />
    </svg>
  );
}

export default DownloadIcon;
