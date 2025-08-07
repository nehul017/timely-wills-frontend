'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import CrossIcon from '@/assets/icons/cross-icon';
import DeleteIcon from '@/assets/icons/delete-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import SaveIcon from '@/assets/icons/save-icon';
import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useGiftsState } from '@/store/will/gifts';
import { shouldCallAPI } from '@/utils';

function ReviewGifts() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { decreaseSubStep, setSubStep, increaseWillMainStep } =
    useProgressStepStore();
  const {
    beneficiaryForGift,
    setIsCompletedGiftsSection,
    setSelectedGiftId,
    deleteBeneficiary,
    setIsGifts,
    isCompletedGiftsSection,
    isGifts,
  } = useGiftsState();
  const { updateSearchParams } = useWillSearchParams();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const currentData = useMemo(() => [...beneficiaryForGift], []);

  const submitData = async (isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();
    const preparedData = beneficiaryForGift.map(({ id, ...rest }) => ({
      ...rest,
      address: rest.address || null,
      giftDescription: rest.giftDescription || null,
      money: rest.money || null,
      email: rest.email || null,
    }));

    const body: WillRequestBody = {
      ...willRequestBody,
      beneficiaryForGift: preparedData,
      isGifts,
      isCompletedGiftsSection,
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, body);
      } else {
        await willAPI.createWill(body);
      }

      if (!isNotRedirect) {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    if (!shouldCallAPI(beneficiaryForGift, currentData)) {
      setIsNextLoading(true);
      try {
        await submitData(true);
        increaseWillMainStep();
        setSubStep(0);
        updateSearchParams('executors');
      } catch (error) {
        console.error(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseWillMainStep();
      updateSearchParams('executors');
      setSubStep(0);
    }
  };

  const handleBack = () => {
    decreaseSubStep();
  };

  const handleDelete = (giftId: string | number) => {
    deleteBeneficiary(giftId);

    if (beneficiaryForGift.length === 1) {
      setIsCompletedGiftsSection(false);
      setIsGifts(false);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await submitData();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>
          Add and assign the gifts that you’d like to leave.
        </h2>
        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <FormWrapper
          isHiddenSubmitButton
          isNextLoading={isNextLoading}
          handleBack={handleBack}
          handleNext={handleNext}
        >
          <h3 className='mb-3 text-[16px] font-semibold'>Your Gifts</h3>

          <div className='rounded-lg border border-[#8D9395] p-5'>
            {beneficiaryForGift.map(
              ({ fullName, giftId, giftDescription, money }, index) => (
                <div key={giftId} className='space-y-2'>
                  <h4 className='flex flex-wrap items-center justify-between text-lg font-semibold'>
                    {giftDescription || `${money}`}

                    <div className='space-x-2'>
                      <Button
                        onClick={() => handleDelete(giftId)}
                        variant='link'
                        className='h-fit p-0'
                      >
                        <DeleteIcon
                          className='h-[22px] w-[22px]'
                          fill='#636b65'
                        />
                      </Button>

                      <Button
                        onClick={() => {
                          setSelectedGiftId(giftId);
                          setSubStep(1);
                        }}
                        variant='link'
                        className='h-fit p-0'
                      >
                        <PencillFillIcon />
                      </Button>
                    </div>
                  </h4>
                  <p className='text-sm'>{fullName}</p>

                  {beneficiaryForGift.length - 1 !== index && (
                    <Separator className='!mb-[14px] !mt-5' />
                  )}
                </div>
              ),
            )}
          </div>

          <Button
            className='!mt-6 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
            variant='ghost'
            onClick={() => {
              setSubStep(1);
              setSelectedGiftId('');
            }}
          >
            <CrossIcon className='mr-1 h-[22px] w-[22px]' />
            Add a gift
          </Button>
        </FormWrapper>

        <Button
          isLoading={isLoading}
          onClick={onSubmit}
          className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
          variant='outline'
        >
          <SaveIcon className='mr-1' /> Save and exit
        </Button>
      </div>
    </div>
  );
}

export default ReviewGifts;
