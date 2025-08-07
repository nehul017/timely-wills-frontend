'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import CloseIcon from '@/assets/icons/close-icon';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn('your-custom-styles-for-trigger', className)}
    {...props}
  />
));

DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 bg-[#010D0433]', className)}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    isCloseIconHidden?: boolean;
  }
>(({ className, isCloseIconHidden, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      'scrollbar fixed inset-0 z-10 m-auto h-fit max-h-[90vh] w-[327px] overflow-y-auto rounded-[8px] border border-[#8D9395] bg-white p-6 shadow-md md:w-[450px] lg:w-[600px] lg:p-[30px]',
      className,
    )}
    {...props}
  >
    {props.children}
    {!isCloseIconHidden && (
      <DialogPrimitive.Close asChild>
        <div className='absolute right-6 top-6 cursor-pointer lg:right-[30px] lg:top-[30px]'>
          <CloseIcon className='lg:h-[30px] lg:w-[30px]' />
        </div>
      </DialogPrimitive.Close>
    )}
  </DialogPrimitive.Content>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'mb-6 text-xl font-bold text-[#010D04] lg:text-[26px] lg:font-semibold',
      className,
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm leading-6 lg:text-[16px]', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
