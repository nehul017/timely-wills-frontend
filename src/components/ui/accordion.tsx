'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import CrossIcon from '@/assets/icons/cross-icon';
import MinusCircleIcon from '@/assets/icons/minus-circle-icon';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b[#DEE0DF] border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isIconHidden?: boolean;
    iconClass?: string;
  }
>(({ className, children, isIconHidden, iconClass, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex text-xl font-semibold'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'mb-[14px] flex flex-1 justify-between gap-[16px] text-left font-semibold transition-all lg:items-center [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      {!isIconHidden && (
        <ChevronDown
          className={cn(
            'h-8 w-8 shrink-0 transition-transform duration-200',
            iconClass,
          )}
        />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const ReviewAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    iconClass?: string;
  }
>(({ className, children, iconClass, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex text-xl font-semibold'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'mb-[14px] flex flex-1 justify-between gap-[16px] text-left font-semibold transition-all lg:items-center [&[data-state=closed]>svg]:hidden',
        className,
      )}
      {...props}
    >
      {children}
      <MinusCircleIcon className={cn('shrink-0', iconClass)} />
    </AccordionPrimitive.Trigger>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn('mb-[14px] [&[data-state=open]>svg]:hidden', className)}
      {...props}
    >
      <CrossIcon className={cn('shrink-0', iconClass)} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
ReviewAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className='overflow-hidden text-[16px] leading-6 text-[#010D0499] transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ReviewAccordionTrigger,
};
