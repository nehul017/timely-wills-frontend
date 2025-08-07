import { IconProps } from '@/types';

function LogoutIcon({ className }: IconProps) {
  return (
    <svg
      width='23'
      height='18'
      viewBox='0 0 23 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path d='M16 10V8H5.875V5L0.25 9L5.875 13V10H16Z' fill='black' />
      <path
        d='M20.5 0H10.375C9.13412 0 8.125 0.897 8.125 2V6H10.375V2H20.5V16H10.375V12H8.125V16C8.125 17.103 9.13412 18 10.375 18H20.5C21.7409 18 22.75 17.103 22.75 16V2C22.75 0.897 21.7409 0 20.5 0Z'
        fill='black'
      />
    </svg>
  );
}

export default LogoutIcon;
