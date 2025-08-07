import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

function Spinner({ className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-bright',
        className,
      )}
    />
  );
}

export default Spinner;
