'use client';

import Link from 'next/link';
import React from 'react';

import CloseIcon from '@/assets/icons/close-icon';
import EyeIcon from '@/assets/icons/eye-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import DocumentViewer from '@/components/DocumentViewer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProgressStepStore } from '@/store/progress-steps';

import DownloadButton from '../DownloadButton';

type Props = {
  editStep: number;
  title: 'Durable POA' | 'Living Will' | 'Medical POA';
  url: string;
};

function DownloadDocument({ title, url, editStep }: Props) {
  const { setMedicalStep, setDurableStep } = useProgressStepStore();
  const setStep = title === 'Durable POA' ? setDurableStep : setMedicalStep;

  return (
    <article className='w-full lg:w-[690px]'>
      <h2 className='mb-6 text-[22px] font-bold lg:text-2xl'>
        {`Your ${title} has been created`}
      </h2>
      <p className='mb-6 text-xl font-bold'>What’s next?</p>
      <p className='mb-[14px] text-[16px] text-[#010D0499]'>
        {`Your ${title} is ready to be made official! Preview your ${title}
        to verify everything looks good, and then download it to sign and
        finalize it. Once you’ve signed it, you can upload it into your`}
        <Link href='/digital-vault' className='font-semibold'>
          {' '}
          digital vault
        </Link>{' '}
        to store it for safe keepings.
      </p>

      <p className='text-[16px]'>
        Need to make some changes?{' '}
        <Button
          onClick={() => setStep(editStep)}
          variant='ghost'
          className='h-fit p-0 text-[16px] font-semibold hover:bg-white'
        >
          Edit here!
        </Button>
      </p>

      {url ? (
        <div className='mt-[36px] flex gap-2'>
          <Dialog>
            <DialogTrigger className='flex h-[52px] w-full items-center justify-center rounded-md border border-[#DEE0DF] text-lg font-semibold'>
              <EyeIcon className='mr-1' />
              Preview
            </DialogTrigger>
            <DialogOverlay />
            <DialogContent
              isCloseIconHidden
              className='!h-screen max-h-screen w-screen overflow-x-hidden bg-[#F7F7F7] md:w-screen lg:mt-8 lg:max-h-[100vh] lg:w-[1056px]'
            >
              <DialogTitle className='sr-only'>{title}</DialogTitle>
              <DialogDescription className='sr-only'>
                View document
              </DialogDescription>

              <div className='flex items-center justify-between bg-[#F7F7F7] pb-8 text-xl font-bold lg:text-[26px]'>
                <h3>{title}</h3>
                <div className='flex items-center gap-6'>
                  <div className='hidden lg:inline-flex'>
                    <DialogTrigger
                      onClick={() => setStep(0)}
                      className='flex h-[52px] w-full items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white lg:w-[160px]'
                    >
                      <PencillFillIcon className='mr-1' fill='white' />
                      Edit
                    </DialogTrigger>
                  </div>

                  <DialogTrigger className='h-fit w-fit p-0'>
                    <CloseIcon className='h-[30px] w-[30px]' />
                  </DialogTrigger>
                </div>
              </div>
              <div className='bg-[#f7f7f7] lg:hidden'>
                <DialogTrigger
                  onClick={() => setStep(0)}
                  className='mb-8 flex h-[52px] w-full items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white'
                >
                  <PencillFillIcon className='mr-1' fill='white' />
                  Edit
                </DialogTrigger>
              </div>

              <DocumentViewer url={url} />
            </DialogContent>
          </Dialog>

          <DownloadButton
            isShownText
            className='h-[52px] w-full border-none bg-bright text-lg text-white hover:bg-bright lg:h-[52px] lg:w-full'
            fileUrl={url}
          />
        </div>
      ) : (
        <p className='mt-6 font-semibold'>Please fill out your {title} </p>
      )}

      <Link
        href='/Power-of-attorney'
        onClick={() => setStep(0)}
        className='mt-6 block text-lg font-semibold text-bright'
      >
        Go back to checklist
      </Link>
    </article>
  );
}

export default DownloadDocument;
