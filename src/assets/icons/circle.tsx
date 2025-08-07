import { IconProps } from '@/types';

interface CircleIconProps extends IconProps {
  fill?: string;
}

function CircleIcon({ className, fill }: CircleIconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <rect
        x='0.5'
        y='0.5'
        width='13'
        height='13'
        rx='6.5'
        fill={fill || '#FFF'}
        stroke='black'
      />
    </svg>
  );
}

export default CircleIcon;
