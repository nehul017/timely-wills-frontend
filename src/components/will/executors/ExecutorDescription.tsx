import React, { ReactNode } from 'react';

import WarningIcon from '@/assets/icons/warning-icon';
import { cn } from '@/lib/utils';

type Props = {
  children?: ReactNode;
  title?: string;
  className?: string;
};

function ExecutorDescription({ children, title, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#DEE0DF] bg-[#f7f7f7] p-5',
        className,
      )}
    >
      <h3 className='flex flex-col text-sm font-semibold leading-6 lg:flex-row lg:text-[16px]'>
        <WarningIcon className='mb-2 mr-2 shrink-0' fill='#25d998' />
        {title ||
          'Being an executor is a significant responsibility. When selecting someone for this role, ensure they meet the following criteria:'}
      </h3>

      {children || (
        <ul className='ml-5 mt-2 list-disc space-y-1 text-sm text-[#010D0499] lg:ml-12'>
          <li>They must be over 18 years old.</li>
          <li>
            They should be proficient in handling finances and managing
            paperwork.
          </li>
          <li>
            They should be reliable and capable of handling conflicts
            impartially.
          </li>
          <li>
            They should be aware of their selection and willing to take on the
            responsibilities involved.
          </li>
        </ul>
      )}
    </div>
  );
}

export default ExecutorDescription;
