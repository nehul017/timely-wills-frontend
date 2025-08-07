import React, { forwardRef, Ref } from 'react';

import CloudIcon from '@/assets/icons/cloud-icon';
import CloudUploadIcon from '@/assets/icons/cloud-uplad-icon';

import { Input } from '../ui/input';

type Props = {
  file: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDivClick: () => void;
};

const DragDropPlaceholder = forwardRef<HTMLInputElement, Props>(
  (
    { file, handleFileChange, handleDivClick }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    return (
      <div>
        <Input
          onChange={handleFileChange}
          type='file'
          className='hidden'
          ref={ref}
        />

        <div
          aria-hidden
          onClick={handleDivClick}
          className='dashed flex h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-[4px] bg-[#DBFFE5B2] px-6 text-sm font-medium lg:text-[16px]'
        >
          {file ? (
            <CloudIcon className='lg:h-12 lg:w-12' />
          ) : (
            <CloudUploadIcon className='lg:h-12 lg:w-12' />
          )}

          <h2 className='text-center text-sm lg:text-[16px]'>
            Drag & drop document or photo of document here
          </h2>
        </div>
      </div>
    );
  },
);

DragDropPlaceholder.displayName = 'DragDropPlaceholder';

export default DragDropPlaceholder;
