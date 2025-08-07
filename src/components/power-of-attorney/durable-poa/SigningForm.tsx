'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useDurableRequestBody from '@/hooks/durable-poa/use-durable-request-body';
import { signingSchema } from '@/schemas/poa';
import durablePoaAPI from '@/services/durable-poa';
import { DurablePOABody } from '@/services/durable-poa/types';
import { useDurablePOAAgentPowersStore } from '@/store/durable-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type FormData = z.infer<typeof signingSchema>;

function SigningForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const {
    isNotarization,
    isWitnesses,
    updateSigning,
    setIsCompletedSigningSection,
  } = useDurablePOAAgentPowersStore();
  const { durableBody, durableId } = useDurableRequestBody();
  const { durableStep, decreaseDurableStep, increaseDurableStep } =
    useProgressStepStore();
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: zodResolver(signingSchema),
    defaultValues: {
      isNotarization,
      isWitnesses,
    },
  });
  const { trigger, getValues } = methods;

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const { isNotarization, isWitnesses } = data;

    const body: DurablePOABody = {
      ...durableBody,
      isNotarization,
      isWitnesses,
      isCompletedSigningSection: true,
    };

    const result = await durablePoaAPI.getDurablePOA();

    try {
      if (result) {
        await durablePoaAPI.updateDurablePOA(durableId as number, body);
      } else {
        await durablePoaAPI.createDurablePOA(body);
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    if (!durableStep) {
      router.back();
      return;
    }

    decreaseDurableStep();
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    if (!shouldCallAPI(getValues(), { isNotarization, isWitnesses })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updateSigning(getValues());
        increaseDurableStep();
        setIsCompletedSigningSection(true);
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseDurableStep();
    }
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
    <div className='w-full lg:max-w-[690px]'>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='mb-2 text-2xl font-bold'>
              Signing requirements for your Durable POA
            </h2>

            <p className='text-sm'>
              When signing your Durable Power of Attorney, it’s{' '}
              <strong>recommended</strong> to have your signature witnessed by
              two individuals and notarized, as many states require these steps
              to ensure the document’s validity.
              <br /> Even in states where it’s not mandatory, having witnesses
              and a notary can add an extra layer of{' '}
              <strong>legitimacy and protection</strong> to your POA. While
              these steps are optional in some cases, they help prevent disputes
              or challenges later on.
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-2'>Two witnesses</h3>

            <RadioFieldBoolean
              name='isWitnesses'
              methods={methods}
              labelYes='Yes, I would like to have my signature witnessed by 2 witnesses.'
              labelNo='No, I would not like to have my signature witnessed by 2 witnesses.'
            />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-2'>Notarization</h3>

            <RadioFieldBoolean
              name='isNotarization'
              methods={methods}
              labelYes='Yes, I will be notarizing my Durable POA'
              labelNo='No, I won’t be notarizing my Durable POA'
            />
          </div>

          <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
            <Button
              type='button'
              onClick={handleBack}
              variant='outline'
              className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
            >
              <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
              Back
            </Button>

            <Button
              onClick={handleNext}
              isLoading={isNextLoading}
              className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
            >
              Next
            </Button>
          </div>

          <Button
            isLoading={isLoading}
            className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
            type='submit'
            variant='outline'
          >
            <SaveIcon className='mr-1' /> Save and exit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SigningForm;
