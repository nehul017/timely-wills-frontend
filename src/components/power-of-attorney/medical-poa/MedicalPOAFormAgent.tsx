'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import AddressFields from '@/components/power-of-attorney/durable-poa/AddressFields';
import AgentFields from '@/components/power-of-attorney/durable-poa/AgentFields';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { appointAgentPopupOptions } from '@/constant/poa';
import { medicalPOAAgentSchema } from '@/schemas/poa/medical';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPOABody } from '@/services/medical-poa/types';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { Agent, MedicalPOAAgentForm } from '@/types';
import { prepareAgentForRequest, shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type Props = {
  isHealthCare?: boolean;
};

function MedicalPOAFormAgent({ isHealthCare }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const {
    alternatedAgent,
    designetedAgent,
    secondAlternatedAgent,
    is2ndAlternateAgent,
    isAlternateAgent,
    id,
    updateMedicalAgent,
  } = useMedicalPOAAgentStore();
  const { medicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const router = useRouter();

  const methods = useForm<MedicalPOAAgentForm>({
    resolver: zodResolver(medicalPOAAgentSchema),
    defaultValues: {
      designetedAgent,
      alternatedAgent,
      secondAlternatedAgent,
      isAlternateAgent,
      is2ndAlternateAgent,
    },
  });

  const { getValues, watch, setValue, reset } = methods;

  useEffect(() => {
    reset({
      alternatedAgent,
      designetedAgent,
      secondAlternatedAgent,
      is2ndAlternateAgent,
      isAlternateAgent,
    });
  }, [
    alternatedAgent,
    designetedAgent,
    is2ndAlternateAgent,
    isAlternateAgent,
    reset,
    secondAlternatedAgent,
  ]);

  const isAlternateAgentWatch = watch('isAlternateAgent');
  const is2ndAlternateAgentWatch = watch('is2ndAlternateAgent');
  const objectToCheck = {
    designetedAgent,
    alternatedAgent,
    secondAlternatedAgent,
    isAlternateAgent,
    is2ndAlternateAgent,
  };

  const resetAgent = (name: keyof MedicalPOAAgentForm) => () => {
    setValue(name, {
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
    data: MedicalPOAAgentForm,
    isNotRedirect?: boolean,
  ) => {
    const {
      designetedAgent,
      is2ndAlternateAgent,
      isAlternateAgent,
      alternatedAgent,
      secondAlternatedAgent,
    } = data;

    const body: Partial<MedicalPOABody> = {
      agent: {
        address: { ...designetedAgent.address },
        fullName: designetedAgent.fullName,
        phoneNumber: designetedAgent.phoneNumber,
        email: designetedAgent.email || null,
        personType: designetedAgent.personType,
      },
      alternativeAgent: prepareAgentForRequest(alternatedAgent as Agent),
      secondAlternativeAgent: prepareAgentForRequest(
        secondAlternatedAgent as Agent,
      ),
      is2ndAlternateAgent,
      isAlternateAgent,
      isCompletedAgentSection: true,
      isHealthCare: isHealthCare || false,
    };

    let result = await medicalPoaAPI.getMedicalPOA();

    try {
      if (result) {
        await medicalPoaAPI.updateMedicalPOA(id as number, body);
      } else {
        result = await medicalPoaAPI.createtMedicalPOA(body);
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }

      return result.id;
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();

    if (!isValid) {
      return;
    }

    setIsNextLoading(true);

    const {
      designetedAgent,
      alternatedAgent,
      is2ndAlternateAgent,
      isAlternateAgent,
      secondAlternatedAgent,
    } = getValues();

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        const id = await submitData(getValues(), true);
        increaseMedicalStep();
        updateMedicalAgent({
          id,
          designetedAgent,
          alternatedAgent,
          secondAlternatedAgent,
          isAlternateAgent,
          is2ndAlternateAgent,
          isCompletedAgentSection: true,
          isHealthCare: isHealthCare || false,
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

  const onSubmit = async (data: MedicalPOAAgentForm) => {
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
            <h2 className='h2 mb-2 flex items-start gap-2'>
              Appoint your
              <span className='relative'>
                agent
                <QuestionDialig question='Appoint your agent'>
                  <span className='text-lg font-semibold text-[#010D04] lg:text-xl'>
                    When choosing a healthcare agent, most people select a
                    family member or friend who:
                  </span>

                  <span className='mt-2 flex flex-col space-y-2'>
                    {appointAgentPopupOptions.map((item) => (
                      <span key={item} className='flex items-center'>
                        <span className='mx-2 mt-2 h-1 w-1 shrink-0 self-start rounded-full bg-[#010D0499]' />
                        {item}
                      </span>
                    ))}
                  </span>
                </QuestionDialig>
              </span>
            </h2>

            <p className='mb-6 text-sm'>
              In this section you’ll select who will make your healthcare
              decisions if you become unable to do so. This person will be
              called your “agent.”
            </p>

            <AgentFields
              isPersonType
              agent='designetedAgent'
              methods={methods}
            />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>Agent’s address</h3>

            <AddressFields name='designetedAgent' methods={methods} />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <div className='border-gradient m-0 mb-2'>
              <span className='block h-[33px] w-[134px] rounded-md bg-[#DBFFE5] px-0 py-[6px] text-center text-sm font-semibold'>
                Recommended
              </span>
            </div>

            <h3 className='h3 mb-6'>
              Would you like to add an Alternate{' '}
              <span className='relative'>
                Agent?
                <QuestionDialig question='What is an alternate agent?'>
                  An alternate agent steps in if the original agent is unable or
                  unwilling to fulfill the responsibilities outlined in the
                  advance directive. This alternate can make the same healthcare
                  decisions assigned to the original agent.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isAlternateAgent'
              handleClickNo={resetAgent('alternatedAgent')}
            />

            {isAlternateAgentWatch && (
              <>
                <div className='mb-8 lg:mb-[36px]'>
                  <AgentFields agent='alternatedAgent' methods={methods} />
                </div>

                <div className='mb-8 lg:mb-[36px]'>
                  <h3 className='h3 mb-6'>Alternate Agent’s address</h3>

                  <AddressFields name='alternatedAgent' methods={methods} />
                </div>
              </>
            )}
          </div>

          {isAlternateAgentWatch && (
            <div className='mb-8 lg:mb-[36px]'>
              <div className='border-gradient m-0 mb-2'>
                <span className='block h-[33px] w-[86px] rounded-md bg-[#DBFFE5] px-0 py-[6px] text-center text-sm font-semibold'>
                  Optional
                </span>
              </div>

              <h3 className='h3 mb-6'>
                Would you like to add a 2nd Alternate Agent?
              </h3>

              <RadioFieldBoolean
                methods={methods}
                name='is2ndAlternateAgent'
                handleClickNo={resetAgent('secondAlternatedAgent')}
              />

              {is2ndAlternateAgentWatch && (
                <>
                  <div className='mb-8 lg:mb-[36px]'>
                    <AgentFields
                      agent='secondAlternatedAgent'
                      methods={methods}
                    />
                  </div>

                  <div className='mb-8 lg:mb-[36px]'>
                    <h3 className='h3 mb-6'>Alternate Agent’s address</h3>

                    <AddressFields
                      name='secondAlternatedAgent'
                      methods={methods}
                    />
                  </div>
                </>
              )}
            </div>
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

export default MedicalPOAFormAgent;
