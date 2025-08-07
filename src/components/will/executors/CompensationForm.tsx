'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
import RadioFieldBoolean from '@/components/power-of-attorney/RadioFieldBoolean';
import { Form } from '@/components/ui/form';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { compensationSchema } from '@/schemas/will/executors';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useExecutorsState } from '@/store/will/executor';
import { shouldCallAPI } from '@/utils';

type FormData = z.infer<typeof compensationSchema>;

function CompensationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { increaseSubStep, decreaseSubStep } = useProgressStepStore();
  const { compensation, setCompensation } = useExecutorsState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: zodResolver(compensationSchema),
    defaultValues: { compensation },
  });

  const { getValues, trigger } = methods;

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();
    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      compensation: data.compensation,
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

    if (!shouldCallAPI(getValues(), { compensation })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        setCompensation(getValues('compensation'));
        increaseSubStep();
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
    decreaseSubStep();
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
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>
          Would you like your executor to receive compensation?
        </h2>
        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
            >
              <RadioFieldBoolean
                methods={methods}
                labelYes='Yes, my executor should receive receive a reasonable compensation and reimbursement for any expenses incurred.'
                labelNo='No, my executor should not receive compensation aside from reimbursement for any expenses incurred.'
                name='compensation'
              />
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CompensationForm;
