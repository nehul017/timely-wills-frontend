import React from 'react';

import { useDigitalStore } from '@/store/digital/index';

import DocumentViewer from '../DocumentViewer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';

type Props = {
  isOpen: boolean;
  openDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function ViewDocumentDialog({ isOpen, openDialog }: Props) {
  const { selectedDocument } = useDigitalStore();

  return (
    <Dialog open={isOpen} onOpenChange={openDialog}>
      <DialogOverlay />
      <DialogContent className='h-fit overflow-x-hidden bg-[#F7F7F7] lg:w-[1056px]'>
        <DialogTitle className='sr-only'>Image preview</DialogTitle>
        <div className='flex items-start gap-2 lg:items-center'>
          <DialogDescription className='sr-only'>
            View your document
          </DialogDescription>
        </div>

        <div className='w-full pt-6'>
          {selectedDocument?.file.mime && (
            <DocumentViewer url={selectedDocument?.file.url || ''} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDocumentDialog;
