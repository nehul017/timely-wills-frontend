import { IconProps } from '@/types';

function PencilInSquareIcon({ className }: IconProps) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <rect width='20' height='20' rx='4' fill='#CDCBCB' />
      <g clipPath='url(#clip0_2084_21)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.0298 3.17417C14.2976 2.44194 13.1104 2.44194 12.3781 3.17417L3.52965 12.0227C3.2679 12.2844 3.08948 12.6178 3.01689 12.9808L2.64997 14.8154C2.47504 15.69 3.24619 16.4612 4.12084 16.2863L5.95543 15.9193C6.31841 15.8468 6.65178 15.6683 6.91353 15.4066L15.762 6.55806C16.4942 5.82582 16.4942 4.63864 15.762 3.90641L15.0298 3.17417ZM13.262 4.05806C13.5061 3.81398 13.9018 3.81398 14.1459 4.05806L14.8781 4.79029C15.1222 5.03437 15.1222 5.43009 14.8781 5.67418L13.2084 7.34392L11.5923 5.7278L13.262 4.05806ZM10.7084 6.61169L4.41353 12.9066C4.32628 12.9938 4.26681 13.1049 4.24261 13.2259L3.87569 15.0605L5.71028 14.6936C5.83128 14.6694 5.9424 14.6099 6.02965 14.5227L12.3245 8.2278L10.7084 6.61169Z'
          fill='#0F0F0F'
        />
      </g>
      <defs>
        <clipPath id='clip0_2084_21'>
          <rect
            width='15'
            height='15'
            fill='white'
            transform='translate(2 2)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PencilInSquareIcon;
