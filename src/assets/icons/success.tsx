import { IconProps } from '@/types';

function SuccessIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g clipPath='url(#clip0_3033_43994)'>
        <path
          d='M8.24917 14.8224L4.42667 10.9999L3.125 12.2924L8.24917 17.4165L19.2492 6.41652L17.9567 5.12402L8.24917 14.8224Z'
          fill={fill || '#25D998'}
        />
      </g>
      <defs>
        <clipPath id='clip0_3033_43994'>
          <rect width='22' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SuccessIcon;
