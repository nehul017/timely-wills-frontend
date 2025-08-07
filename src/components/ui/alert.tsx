import { ReactNode } from 'react';

import InviteIcon from '@/assets/icons/invite-icon';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children: ReactNode;
};

function Alert({ children, className }: Props) {
  return (
    <p
      className={cn(
        'flex flex-col gap-[6px] rounded-lg bg-[#DBFFE5] px-5 py-[10px] text-[16px] lg:flex-row lg:items-center',
        className,
      )}
    >
      <InviteIcon className='shrink-0' />
      <span className='text-start'>{children}</span>
    </p>
  );
}

export default Alert;
