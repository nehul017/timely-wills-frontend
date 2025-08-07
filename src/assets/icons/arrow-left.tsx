import { IconProps } from '@/types';

function ArrowLeftIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='24'
      height='17'
      viewBox='0 0 24 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M1 8.5H23M1 8.5L10.1667 1M1 8.5L10.1667 16'
        stroke={fill || 'red'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default ArrowLeftIcon;
