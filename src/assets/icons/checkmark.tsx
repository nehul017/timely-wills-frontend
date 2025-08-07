import { IconProps } from '@/types';

function CheckmarkIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 15C0 6.71573 6.71573 0 15 0C23.2842 0 30 6.71573 30 15C30 23.2842 23.2842 30 15 30C6.71573 30 0 23.2842 0 15ZM23.7488 11.8692C24.2802 11.3355 24.2783 10.4721 23.7446 9.94069L22.7783 8.97854C22.2446 8.44715 21.3813 8.44901 20.8499 8.9827L12.9795 16.887L8.45077 12.4212C7.91452 11.8925 7.05113 11.8985 6.52234 12.4349L5.56489 13.4058C5.0361 13.942 5.04215 14.8054 5.5784 15.3342L12.0397 21.7055C12.5741 22.2326 13.4339 22.2286 13.9635 21.6968L23.7488 11.8692Z'
        fill={fill || '#25D998'}
      />
    </svg>
  );
}

export default CheckmarkIcon;
