import { IconProps } from '@/types';

function ArrowRightIcon({ className, fill }: IconProps) {
  return (
    <svg
      width='20'
      height='14'
      viewBox='0 0 20 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M12.7507 0.583344L11.4582 1.87584L15.6565 6.08334H0.833984V7.91668H15.6565L11.449 12.1242L12.7507 13.4167L19.1673 7.00001L12.7507 0.583344Z'
        fill={fill || 'white'}
      />
    </svg>
  );
}

export default ArrowRightIcon;
