'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
import { Form } from '@/components/ui/form';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { executorSchema } from '@/schemas/will/executors';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useExecutorsState } from '@/store/will/executor';
import { useGiftsState } from '@/store/will/gifts';
import { ExecutorFormData } from '@/types';
import { shouldCallAPI } from '@/utils';

import ExecuterDialog from './ExecuterDialog';
import ExecutorDescription from './ExecutorDescription';
import FormFields from './FormFields';

function PrimaryExecutor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { increaseSubStep, decreaseWillMainStep, setSubStep } =
    useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const { primaryExecutor, setPrimaryExecutor } = useExecutorsState();
  const { beneficiaryForGift } = useGiftsState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const defaultData = {
    address: primaryExecutor?.address || '',
    email: primaryExecutor?.email || '',
    fullName: primaryExecutor?.fullName || '',
    personType: primaryExecutor?.personType || '',
    isOver18: !!primaryExecutor?.fullName,
  };
  const methods = useForm<ExecutorFormData>({
    resolver: zodResolver(executorSchema),
    defaultValues: { ...defaultData },
  });

  const { getValues, trigger, reset } = methods;

  useEffect(() => {
    reset({
      address: primaryExecutor?.address || '',
      email: primaryExecutor?.email || '',
      fullName: primaryExecutor?.fullName || '',
      personType: primaryExecutor?.personType || '',
      isOver18: !!primaryExecutor?.fullName,
    });
  }, [primaryExecutor, reset]);

  const submitData = async (
    data: ExecutorFormData,
    isNotRedirect?: boolean,
  ) => {
    const res = await willAPI.getWill();
    const { isOver18, ...executor } = data;
    const bodyForRequest: Partial<WillRequestBody> = {
      ...willRequestBody,
      primaryExecutor: {
        ...executor,
        email: executor.email || null,
      },
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, bodyForRequest);
      } else {
        await willAPI.createWill(bodyForRequest);
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

    const { isOver18, ...executor } = getValues();

    if (!shouldCallAPI(getValues(), defaultData)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseSubStep();
        setPrimaryExecutor({ ...executor, email: executor.email || null });
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseSubStep();
    }
  };

  const handleBack = () => {
    decreaseWillMainStep();
    setSubStep(beneficiaryForGift.length ? 2 : 0);
    updateSearchParams('gifts');
  };

  const onSubmit = async (data: ExecutorFormData) => {
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
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>Who do you choose as your primary executor?</h2>
        <InfoPopup />
      </div>

      <ExecuterDialog />

      <div className='w-full lg:max-w-[690px]'>
        <ExecutorDescription className='mb-8 lg:mb-9' />

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
            >
              <FormFields methods={methods} />
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PrimaryExecutor;
