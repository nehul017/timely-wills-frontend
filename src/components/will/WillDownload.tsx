'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import CloseIcon from '@/assets/icons/close-icon';
import EyeIcon from '@/assets/icons/eye-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import DocumentViewer from '@/components/DocumentViewer';
import DownloadButton from '@/components/DownloadButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useFetchUserInfo from '@/hooks/user-info/use-fetch-user-info';
import { useProgressStepStore } from '@/store/progress-steps';
import { useAuthStore } from '@/store/user-info';
import { useWillInfoState } from '@/store/will/will-info';

import { Button } from '../ui/button';

function WillDownload() {
  const { setWillMainStep, setSubStep } = useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const { willUrl } = useWillInfoState();
  const { userInfo } = useAuthStore();
  const { fetchUserInfo } = useFetchUserInfo();

  const shouldDownloadWill = userInfo?.products?.some(
    (product) => product.product_type === 'WILL',
  );

  const handleEdit = () => {
    updateSearchParams('family');
    setWillMainStep(0);
    setSubStep(0);
  };

  const goToReview = () => {
    setWillMainStep(4);
    updateSearchParams('review');
  };

  useEffect(() => {
    if (!shouldDownloadWill) {
      fetchUserInfo();
    }
  }, []);

  return (
    <article className='w-full lg:w-[690px]'>
      <h2 className='mb-6 text-[22px] font-bold lg:text-2xl'>
        Your Last Will has been created
      </h2>
      <p className='mb-6 text-xl font-bold'>What’s next?</p>
      <p className='mb-[14px] text-[16px] text-[#010D0499]'>
        Your documents are ready to be made official! Preview your Will to
        verify everything looks good, and then download it to sign and finalize
        it. Once you’ve signed it, you can upload it into your
        <Link href='/digital-vault' className='font-semibold'>
          {' '}
          digital vault
        </Link>{' '}
        to store it for safe keepings.
      </p>

      <p className='text-[16px]'>
        Need to make some changes?{' '}
        <Button
          variant='link'
          className='h-fit p-0 text-[16px] font-semibold'
          onClick={goToReview}
        >
          Edit here!
        </Button>
      </p>

      {shouldDownloadWill && willUrl ? (
        <div className='mt-8 lg:mt-[36px]'>
          <div className='mt-6 flex gap-2'>
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
                <DialogTitle className='sr-only'>Will</DialogTitle>
                <DialogDescription className='sr-only'>
                  View document
                </DialogDescription>

                <div className='flex items-center justify-between bg-[#F7F7F7] pb-8 text-xl font-bold lg:text-[26px]'>
                  <h3>Will</h3>
                  <div className='flex items-center gap-6'>
                    <div className='hidden lg:inline-flex'>
                      <DialogTrigger
                        onClick={handleEdit}
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
                    onClick={handleEdit}
                    className='mb-8 flex h-[52px] w-full items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white'
                  >
                    <PencillFillIcon className='mr-1' fill='white' />
                    Edit
                  </DialogTrigger>
                </div>

                <DocumentViewer url={willUrl || ''} />
              </DialogContent>
            </Dialog>

            <DownloadButton
              isShownText
              className='h-[52px] w-full border-none bg-bright text-lg text-white hover:bg-bright lg:h-[52px] lg:w-full'
              fileUrl={willUrl || ''}
            />
          </div>
        </div>
      ) : !willUrl && shouldDownloadWill ? (
        <Button
          onClick={goToReview}
          className='mt-6 p-0 font-semibold underline'
          variant='link'
        >
          Please complete filling out your Will
        </Button>
      ) : (
        <Link
          href='/will/checkout'
          className='mt-6 block font-semibold underline'
        >
          Go to checkout to download your Will
        </Link>
      )}

      <Link href='/' className='mt-6 block text-lg font-semibold text-bright'>
        Go back to checklist
      </Link>
    </article>
  );
}

export default WillDownload;
