import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'h-[100px] w-full resize-none rounded-md border border-[#8D9395] bg-[#F3F3F3] px-3 pt-3 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#25D99880]',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
