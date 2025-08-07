'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Input } from './input';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTogglePassword();
      }
    };

    return (
      <div className='relative'>
        <Input
          type={showPassword ? 'text' : 'password'}
          {...props}
          ref={ref}
          className={cn('h-[40px] border-[#8D9395] pr-10', className)}
        />
        <span
          className='absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer select-none'
          onClick={handleTogglePassword}
          onKeyDown={handleKeyDown}
          role='button'
          tabIndex={0}
        >
          {showPassword ? (
            <EyeIcon
              className='text-[#636B65]'
              width={22}
              height={22}
              strokeWidth={1.5}
            />
          ) : (
            <EyeOffIcon
              className='text-[#636B65]'
              width={22}
              height={22}
              strokeWidth={1.5}
            />
          )}
        </span>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
