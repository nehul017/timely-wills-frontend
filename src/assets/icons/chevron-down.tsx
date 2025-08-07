import { IconProps } from '@/types';

function ChevronDownIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='13'
      height='8'
      viewBox='0 0 13 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M1 1L6.37959 6.64844L11.7592 1'
        stroke={fill || '#04452D'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default ChevronDownIcon;
