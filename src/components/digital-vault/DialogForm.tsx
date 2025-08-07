import React, { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  openDialog: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

function DialogForm({ title, openDialog, children, isOpen }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openDialog}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className='sr-only'>
          upload your document
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
