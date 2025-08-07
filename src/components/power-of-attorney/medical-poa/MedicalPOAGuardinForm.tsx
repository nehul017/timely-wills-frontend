'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import { medicalPOAGuardianSchema } from '@/schemas/poa/medical';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPOABody } from '@/services/medical-poa/types';
import {
  useMedicalPOAAgentStore,
  useMedicalPOAGuardianStore,
} from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { Agent, MedicalPOAGuardianForm } from '@/types';
import { prepareGuardianForRequest, shouldCallAPI } from '@/utils';

import AddressFields from '../durable-poa/AddressFields';
import AgentFields from '../durable-poa/AgentFields';
import RadioFieldBoolean from '../RadioFieldBoolean';

function MedicalPOAGuardinForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { medicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const { guardian, isAgentGuardian, updateGuardianState, isGuardian } =
    useMedicalPOAGuardianStore();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const { designetedAgent } = useMedicalPOAAgentStore();
  const router = useRouter();

  const methods = useForm<MedicalPOAGuardianForm>({
    resolver: zodResolver(medicalPOAGuardianSchema),
    defaultValues: {
      guardian,
      isAgentGuardian,
      isGuardian,
    },
  });

  const { getValues, watch, setValue, reset } = methods;

  useEffect(() => {
    reset({ guardian, isGuardian, isAgentGuardian });
  }, [reset, guardian, isGuardian, isAgentGuardian]);

  const objectToCheck = {
    guardian,
    isAgentGuardian,
    isGuardian,
  };

  const setDefaultGuardian = () => {
    setValue('guardian', {
      address: { ...designetedAgent.address },
      email: designetedAgent.email,
      fullName: designetedAgent.fullName,
      phoneNumber: designetedAgent.phoneNumber,
    });
  };

  const resetGuardian = () => {
    setValue('guardian', {
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
  };

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const submitData = async (
    data: MedicalPOAGuardianForm,
    isNotRedirect?: boolean,
  ) => {
    const { guardian, isGuardian } = data;

    const body: MedicalPOABody = {
      ...medicalBody,
      guardian: prepareGuardianForRequest(guardian as Agent),
      isGuardian,
      isCompletedGuardianSection: true,
    };

    const result = await medicalPoaAPI.getMedicalPOA();

    try {
      if (result) {
        await medicalPoaAPI.updateMedicalPOA(medicalId as number, body);
      } else {
        await medicalPoaAPI.createtMedicalPOA(body);
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

    const { guardian, isAgentGuardian, isGuardian } = getValues();

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseMedicalStep();
        updateGuardianState({
          isCompletedGuardianSection: true,
          guardian,
          isAgentGuardian,
          isGuardian,
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

  const onSubmit = async (data: MedicalPOAGuardianForm) => {
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
          <h2 className='h2 mb-8 lg:mb-[36px]'>Guardian</h2>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Would you like to designate a{' '}
              <span className='relative'>
                guardian?
                <QuestionDialig question='Would you like to designate a guardian?'>
                  Designating a guardian allows you to choose a trusted
                  individual to manage your personal and financial affairs if
                  you become incapacitated or unable to make decisions for
                  yourself. This person will be responsible for your well-being,
                  including healthcare and financial management, according to
                  your wishes. Selecting a guardian can prevent court-appointed
                  guardianship and ensure that someone you trust is making
                  decisions on your behalf.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isGuardian'
              handleClickNo={() => {
                resetGuardian();
                setValue('isAgentGuardian', undefined);
              }}
            />
          </div>

          {watch('isGuardian') && (
            <div className='mb-8 lg:mb-[36px]'>
              <h3 className='h3 mb-6'>
                {`Would you like ${designetedAgent.fullName} to be the `}
                <span className='relative'>
                  guardian?
                  <QuestionDialig question='Would you like your agent to be the guardian?'>
                    Selecting your agent as your guardian can ensure consistency
                    and continuity in decision-making. If you appoint your agent
                    as guardian, they will manage both your healthcare and
                    financial affairs, following your outlined preferences. This
                    choice can streamline responsibilities and provide clarity
                    for those involved in your care. Before deciding, consider
                    your agent&apos;s ability to fulfill this role and their
                    understanding of your wishes.
                  </QuestionDialig>
                </span>
              </h3>

              <RadioFieldBoolean
                methods={methods}
                name='isAgentGuardian'
                handleClickNo={resetGuardian}
                handleClickYes={setDefaultGuardian}
              />
            </div>
          )}

          {watch('isAgentGuardian') === false && watch('isGuardian') && (
            <>
              <div className='mb-8 lg:mb-[36px]'>
                <h3 className='h3 mb-6'>Guardian’s Information</h3>

                <AgentFields
                  methods={methods}
                  label='Guardian’s'
                  agent='guardian'
                />
              </div>

              <div>
                <h3 className='h3 mb-6'>Guardian’s address</h3>

                <AddressFields methods={methods} name='guardian' />
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
              isLoading={isNextLoading}
              className='h-[52px] w-full bg-bright text-lg font-semibold lg:w-[200px]'
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

export default MedicalPOAGuardinForm;
