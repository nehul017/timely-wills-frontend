'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useLivingWillRequestBody from '@/hooks/living-will/use-living-will-request-body';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import { medicalPOAPrimaryPhysicianSchema } from '@/schemas/poa/medical';
import livingWillAPI from '@/services/living-will';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPOABody } from '@/services/medical-poa/types';
import { useMedicalPOAPrimaryPhysicianStore } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { Agent, MedicalPrimaryPhysicianForm } from '@/types';
import { prepareGuardianForRequest, shouldCallAPI } from '@/utils';

import AddressFields from '../durable-poa/AddressFields';
import AgentFields from '../durable-poa/AgentFields';
import RadioFieldBoolean from '../RadioFieldBoolean';

type Props = {
  isHealthCare?: boolean;
};

function MedicalPOAPrimaryPhysicianForm({ isHealthCare }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { medicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const { livingWillBody, livingWillId } = useLivingWillRequestBody();
  const { physician, isPhysician, updatePrimaryPhysicianState } =
    useMedicalPOAPrimaryPhysicianStore();
  const router = useRouter();

  const methods = useForm<MedicalPrimaryPhysicianForm>({
    resolver: zodResolver(medicalPOAPrimaryPhysicianSchema),
    defaultValues: {
      physician,
      isPhysician,
    },
  });

  const {
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const objectToCheck = {
    physician,
    isPhysician,
  };

  const resetPrimaryPhysician = () => {
    setValue('physician', {
      address: {
        city: '',
        address_line_1: '',
        address_line_2: '',
        state: '',
        zip_code: '',
      },
      email: '',
      fullName: '',
      phoneNumber: '',
    });
    setValue('isPhysician', false);
  };

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const submitData = async (
    data: MedicalPrimaryPhysicianForm,
    isNotRedirect?: boolean,
  ) => {
    const { isPhysician, physician } = data;

    const body: MedicalPOABody = {
      ...medicalBody,
      isPhysician,
      physician: prepareGuardianForRequest(physician as Agent),
      isCompletedPrimaryPhysicianSection: true,
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

    const { isPhysician, physician } = getValues();

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseMedicalStep();
        updatePrimaryPhysicianState({
          isCompletedPrimaryPhysicianSection: true,
          isPhysician,
          physician,
        });
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

  const onSubmit = async (data: MedicalPrimaryPhysicianForm) => {
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
          <h2 className='h2 mb-8 lg:mb-[36px]'>Primary Physician</h2>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Would you like to designate a primary{' '}
              <span className='relative'>
                physician?
                <QuestionDialig question='Why designate a primary physician?'>
                  Designating a primary physician can help ensure consistent and
                  informed medical care. They will be familiar with your medical
                  history and preferences, potentially providing
                  better-coordinated and continuous care.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isPhysician'
              handleClickNo={resetPrimaryPhysician}
            />
          </div>

          {watch('isPhysician') && (
            <>
              <div className='mb-8 lg:mb-[36px]'>
                <h3 className='h3 mb-6'>Primary Physician Information</h3>

                <AgentFields
                  methods={methods}
                  label='Primary Physician’s'
                  agent='physician'
                />
              </div>

              <div>
                <h3 className='h3 mb-6'>
                  Primary Physician’s address (optional)
                </h3>

                <AddressFields isPhysician methods={methods} name='physician' />
                {errors.physician?.address?.address_line_2 && (
                  <p className='mt-1 text-xs text-danger'>
                    {errors.physician.address.address_line_2.message}
                  </p>
                )}
              </div>
            </>
          )}

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
              className='h-[52px] w-full bg-bright text-lg font-semibold lg:w-[200px]'
              isLoading={isNextLoading}
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

export default MedicalPOAPrimaryPhysicianForm;
