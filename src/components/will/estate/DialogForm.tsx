import React, { ReactNode } from 'react';

import CrossIcon from '@/assets/icons/cross-icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  openDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function DialogForm({ children, isOpen, title, openDialog }: Props) {
  return (
    <Dialog onOpenChange={openDialog} open={isOpen}>
      <DialogTrigger className='mt-6 flex items-center text-[16px] font-semibold text-bright'>
        <CrossIcon className='mr-1 h-[18px] w-[18px]' />
        {title}
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className='sr-only'>
          {`${title} who inherit your estate`}
        </DialogDescription>

        {children}
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
