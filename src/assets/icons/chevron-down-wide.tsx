import { IconProps } from '@/types';

function ChevronDownWideIcon({ className }: IconProps) {
  return (
    <svg
      width='20'
      height='10'
      viewBox='0 0 20 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M1 1L10 9L19 1'
        stroke='#7E7E7E'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default ChevronDownWideIcon;
