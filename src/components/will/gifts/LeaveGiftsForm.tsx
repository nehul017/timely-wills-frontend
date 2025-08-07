'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FormWrapper from '@/components/FormWrapper';
import RadioFieldBoolean from '@/components/power-of-attorney/RadioFieldBoolean';
import { Form } from '@/components/ui/form';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { isGiftSchema } from '@/schemas/will/gifts';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { useGiftsState } from '@/store/will/gifts';
import { shouldCallAPI } from '@/utils';

import WillTopHeading from '../WillTopHeading';

type FormData = z.infer<typeof isGiftSchema>;

function LeaveGiftsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const {
    isGifts,
    setIsGifts,
    beneficiaryForGift,
    removeAllGifts,
    setIsCompletedGiftsSection,
  } = useGiftsState();
  const { beneficiaries } = useEstateState();
  const { setSubStep, decreaseWillMainStep, setWillMainStep } =
    useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();
  const isAllCharity = beneficiaries.every((item) => item.type === 'charity');

  const methods = useForm<FormData>({
    resolver: zodResolver(isGiftSchema),
    defaultValues: {
      isGifts,
    },
  });

  const { getValues, trigger, setValue } = methods;

  useEffect(() => {
    setValue('isGifts', isGifts);
  }, [isGifts, setValue]);

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();

    const preparedData = beneficiaryForGift.map(({ id, ...rest }) => ({
      ...rest,
      address: rest.address || null,
      giftDescription: rest.giftDescription || null,
      money: rest.money || null,
      email: rest.email || null,
      giftType: rest.giftType,
    }));

    const body: WillRequestBody = {
      ...willRequestBody,
      beneficiaryForGift: preparedData,
      isGifts: data.isGifts,
      isCompletedGiftsSection: !data.isGifts,
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
    const isValid = await trigger();

    if (!isValid) return;

    const goToNextSection = () => {
      const isGifts = getValues('isGifts');

      if (!isGifts) {
        setWillMainStep(3);
        setIsCompletedGiftsSection(true);
        updateSearchParams('executors');
      } else {
        setSubStep(beneficiaryForGift.length ? 2 : 1);
      }
    };

    if (!shouldCallAPI(getValues(), { isGifts })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        setIsGifts(getValues('isGifts'));
        goToNextSection();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      goToNextSection();
    }
  };

  const handleBack = () => {
    decreaseWillMainStep();
    setSubStep(isAllCharity ? 0 : 1);
    updateSearchParams('estate');
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <WillTopHeading
        heading='Do you want to add any specific gifts?'
        description='Everything you own carries a story. This is why many people choose to leave gifts to their loved ones in their will. These gifts could represent a shared memory, something they always treasured, or simply a small token to remember you by.'
      />

      <div className='mt-8 w-full lg:mt-9 lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              typeNextBtn='button'
              isNextLoading={isNextLoading}
            >
              <RadioFieldBoolean
                methods={methods}
                name='isGifts'
                handleClickNo={
                  beneficiaryForGift.length ? removeAllGifts : undefined
                }
              />
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LeaveGiftsForm;
