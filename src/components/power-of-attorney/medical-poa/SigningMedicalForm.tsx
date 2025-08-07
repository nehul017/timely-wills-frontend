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
import useLivingWillRequestBody from '@/hooks/living-will/use-living-will-request-body';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import { signingSchema } from '@/schemas/poa';
import livingWillAPI from '@/services/living-will';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPOABody } from '@/services/medical-poa/types';
import { useSigningMedicalState } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type FormData = z.infer<typeof signingSchema>;
type Props = {
  isHealthCare?: boolean;
};

function SigningMedicalForm({ isHealthCare }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { isNotarization, isWitnesses, setSigning } = useSigningMedicalState();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const { livingWillBody, livingWillId } = useLivingWillRequestBody();
  const { medicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: zodResolver(signingSchema),
    defaultValues: {
      isNotarization,
      isWitnesses,
    },
  });

  const objectToCheck = {
    isNotarization,
    isWitnesses,
  };

  const { getValues } = methods;

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const { isNotarization, isWitnesses } = data;

    const body: MedicalPOABody = {
      ...medicalBody,
      isNotarization,
      isWitnesses,
      isCompletedSigningSection: true,
    };

    const result = await Promise.all([
      livingWillAPI.getLivingWill(),
      medicalPoaAPI.getMedicalPOA(),
    ]);

    try {
      if (result[1]) {
        await medicalPoaAPI.updateMedicalPOA(medicalId as number, body);
      } else {
        await medicalPoaAPI.createtMedicalPOA(body);
      }

      if (isHealthCare) {
        if (result[0]) {
          await livingWillAPI.updateLivingWill(livingWillId, {
            ...livingWillBody,
            isCompletedWishesSection: true,
          });
        } else {
          await livingWillAPI.createLivingWill({
            ...livingWillBody,
            isCompletedWishesSection: true,
          });
        }
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();

    if (!isValid) {
      return;
    }

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseMedicalStep();
        setSigning({ ...getValues(), isCompletedSigningSection: true });
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseMedicalStep();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.log(error);
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
              Signing requirements for your Medical POA
            </h2>

            <p className='text-sm'>
              {`When signing your ${isHealthCare ? 'Advance Healthcare Directive' : 'Medical POA'}`}
              , it’s <strong>recommended</strong> to have your signature
              witnessed by two individuals and notarized, as many states require
              these steps to ensure the document’s validity.
              <br /> Even in states where it’s not mandatory, having witnesses
              and a notary can add an extra layer of{' '}
              <strong>legitimacy and protection </strong>
              to your{' '}
              {`${isHealthCare ? 'Advance Healthcare Directive' : 'Medical POA'}`}
              . While these steps are optional in some cases, they help prevent
              disputes or challenges later on.
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
              labelYes='Yes, I will be notarizing my Medical POA'
              labelNo='No, I won’t be notarizing my Medical POA'
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
            <SaveIcon className='mr-1' /> Save an exit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SigningMedicalForm;
