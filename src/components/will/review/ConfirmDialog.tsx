import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import willAPI from '@/services/will';
import { useProgressStepStore } from '@/store/progress-steps';
import { useAuthStore } from '@/store/user-info';
import { useWillInfoState } from '@/store/will/will-info';

type ErrorResponse = {
  error: string;
};

function ConfirmDialog() {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { willRequestBody } = useWillRequestBody();
  const { setWillMainStep } = useProgressStepStore();
  const { setWillUrl } = useWillInfoState();
  const { updateSearchParams } = useWillSearchParams();
  const { userInfo } = useAuthStore();
  const router = useRouter();

  const isBoughtWill = userInfo?.products?.some(
    (item) => item.product_type === 'WILL',
  );

  const makeApiRequest = async () => {
    if (!index && !isBoughtWill) return;

    setIsLoading(true);

    const res = await willAPI.getWill();

    try {
      if (res) {
        await willAPI.updateWill(res.id, willRequestBody);
        const url = await willAPI.generateFile(res.id);

        setWillUrl(url);
      } else {
        const res = await willAPI.createWill(willRequestBody);
        const url = await willAPI.generateFile(res.id);

        setWillUrl(url);
      }

      if (isBoughtWill) {
        setWillMainStep(5);
        updateSearchParams('download');
      } else {
        router.push('/will/checkout');
      }
    } catch (err) {
      const error = err as AxiosError;
      const { error: errorMessage } = error.response?.data as ErrorResponse;

      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            {errorMessage}
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isBoughtWill ? (
        <Button
          isLoading={isLoading}
          onClick={makeApiRequest}
          className='h-[52px] w-[60%] rounded-lg bg-[#25D998] text-lg font-semibold text-white lg:w-[200px]'
        >
          Save & continue
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger className='h-[52px] w-[60%] rounded-lg bg-[#25D998] text-lg font-semibold text-white lg:w-[200px]'>
            Save & continue
          </DialogTrigger>
          <DialogOverlay />
          <DialogContent className='lg:w-[790px]'>
            <DialogTitle className='w-[220px] md:w-[380px] lg:w-full lg:font-bold'>
              {!index
                ? 'Great job! You have finished filling out your will!'
                : 'I confirm that:'}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              Read your confirmation
            </DialogDescription>

            {!index ? (
              <div className='space-y-6'>
                <div>
                  <h3 className='mb-2 text-lg font-semibold lg:text-xl'>
                    What’s next?
                  </h3>
                  <p className='text-[#010D0499]'>
                    Once your payment is complete, you&apos;ll receive immediate
                    access to download your Last Will and Testament. To make it
                    legally binding, you&apos;ll need to sign and date it. Your
                    Will includes state-specific instructions, detailing the
                    exact steps to follow and any additional requirements you
                    may need to fulfill. This ensures everything is executed
                    properly and in compliance with your state&apos;s laws.
                  </p>
                </div>

                <div>
                  <h3 className='mb-2 text-lg font-semibold lg:text-xl'>
                    Updating your will
                  </h3>
                  <p className='text-[#010D0499]'>
                    Updating your will has been made simple. It’s as easy as
                    logging in again, and editing your will. You can make as
                    many updates as you’d like - your first year is free.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className='mb-6 text-lg font-semibold lg:text-xl'>
                  1. I understand the purpose of my will.
                </p>
                <p className='mb-2 text-lg font-semibold lg:mb-6 lg:text-xl'>
                  2. I confirm that there is nothing impairing my memory or my
                  ability to make decisions.
                </p>
                <p className='text-[#010D0499]'>
                  The purpose of a will is to decide how your money, property,
                  and possessions should be handled after your death. The
                  instructions outlined in the will only take effect after you
                  pass away.
                </p>
              </>
            )}

            <Button
              isLoading={isLoading}
              onClick={async () => {
                setIndex((prev) => prev + 1);
                await makeApiRequest();
              }}
              className='mt-6 h-[52px] w-full bg-bright text-lg font-semibold hover:bg-bright lg:ml-[65%] lg:mt-8 lg:w-[256px]'
            >
              {!index ? 'Next' : 'Submit & pay'}
            </Button>

            <div className='mx-auto mt-6 flex w-fit gap-[6px] lg:mt-8'>
              <div className='h-[6px] w-11 rounded-[100px] bg-bright' />
              <div
                className={`h-[6px] w-11 rounded-[100px] ${index ? 'bg-bright' : 'bg-[#f3f3f3]'}`}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Toaster />
    </>
  );
}

export default ConfirmDialog;
