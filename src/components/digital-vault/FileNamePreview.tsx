import React from 'react';

import CloseIcon from '@/assets/icons/close-icon';
import DocumentIcon from '@/assets/icons/document-icon';

import { Button } from '../ui/button';

type Props = {
  fileName: string;
  removeFile: () => void;
};

function FileNamePreview({ fileName, removeFile }: Props) {
  if (!fileName) return null;

  return (
    <div className='mt-4 flex items-center gap-[6px] lg:mt-6'>
      <DocumentIcon className='h-[18px] w-[15px]' fill='#DEE0DFCC' />
      <h3 className='truncate whitespace-nowrap text-[16px] font-semibold lg:text-lg'>
        {fileName}
      </h3>

      <Button onClick={removeFile} variant='ghost' className='h-[22px] p-0'>
        <CloseIcon className='h-[22px] w-[22px] cursor-pointer' />
      </Button>
    </div>
  );
}

export default FileNamePreview;
