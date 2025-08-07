'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import AddressFields from '@/components/power-of-attorney/durable-poa/AddressFields';
import AgentFields from '@/components/power-of-attorney/durable-poa/AgentFields';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  disabilityEffectivePoaHeading,
  disabilityEffectivePoaParagraph,
  immediateEffectivePoaHeading,
  immediateEffectivePoaParagraph,
} from '@/constant/poa';
import { durablePOADesignatedAgentSchema } from '@/schemas/poa/durable';
import durablePoaAPI from '@/services/durable-poa';
import { DurablePOABody } from '@/services/durable-poa/types';
import { useDurablePOAdesignatedAgentStore } from '@/store/durable-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { Agent, FormDataDurablePOA } from '@/types';
import { prepareAgentForRequest, shouldCallAPI } from '@/utils';

import RadioField from '../RadioField';
import RadioFieldBoolean from '../RadioFieldBoolean';

function DurablePOAFormAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { durableStep, decreaseDurableStep, increaseDurableStep } =
    useProgressStepStore();
  const {
    alternatedAgent,
    becomeEffectivePOA,
    designetedAgent,
    isAlternateAgent,
    id,
    updateDurableAgents,
    setIsCompletedAgentSection,
  } = useDurablePOAdesignatedAgentStore();
  const router = useRouter();

  const methods = useForm<FormDataDurablePOA>({
    resolver: zodResolver(durablePOADesignatedAgentSchema),
    defaultValues: {
      designetedAgent,
      alternatedAgent,
      becomeEffectivePOA,
      isAlternateAgent,
      isUnderstand: !!designetedAgent.fullName,
    },
  });

  const { getValues, watch, setValue, reset } = methods;

  useEffect(() => {
    reset({
      alternatedAgent,
      becomeEffectivePOA,
      designetedAgent,
      isAlternateAgent,
    });
  }, [
    alternatedAgent,
    becomeEffectivePOA,
    designetedAgent,
    isAlternateAgent,
    reset,
  ]);

  const objectToCheck = {
    designetedAgent,
    alternatedAgent,
    becomeEffectivePOA,
    isAlternateAgent,
    isUnderstand: !!designetedAgent.fullName,
  };

  const submitData = async (
    data: FormDataDurablePOA,
    isNotRedirect?: boolean,
  ) => {
    const {
      designetedAgent,
      alternatedAgent,
      becomeEffectivePOA,
      isAlternateAgent,
    } = data;

    const body: Partial<DurablePOABody> = {
      whenPoaBecomeEffective: becomeEffectivePOA,
      isCompletedAgentSection: true,
      agent: {
        address: { ...designetedAgent.address },
        fullName: designetedAgent.fullName,
        phoneNumber: designetedAgent.phoneNumber,
        email: designetedAgent.email || null,
        personType: designetedAgent.personType,
      },
      alternativeAgent: prepareAgentForRequest(alternatedAgent as Agent),
      isAlternativeAgent: isAlternateAgent,
    };

    let result = await durablePoaAPI.getDurablePOA();

    try {
      if (result) {
        await durablePoaAPI.updateDurablePOA(id as number, body);
      } else {
        result = await durablePoaAPI.createDurablePOA(body);
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }

      return result.id;
    } catch (error) {
      throw error;
    }
  };

  const isEffectivePoaImmediately =
    watch('becomeEffectivePOA').includes('immediately');
  const isAlternateAgentField = watch('isAlternateAgent');

  const resetAlternateAgent = () => {
    setValue('alternatedAgent', {
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
    if (!durableStep) {
      router.back();
      return;
    }

    decreaseDurableStep();
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();

    if (!isValid) {
      return;
    }

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        const id = await submitData(getValues(), true);
        increaseDurableStep();
        setIsCompletedAgentSection(true);
        updateDurableAgents({
          id,
          alternatedAgent: getValues('alternatedAgent'),
          designetedAgent: getValues('designetedAgent'),
          becomeEffectivePOA: getValues('becomeEffectivePOA'),
          isAlternateAgent: getValues('isAlternateAgent'),
          isUnderstand: getValues('isUnderstand'),
        });
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

  const onSubmit = async (data: FormDataDurablePOA) => {
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
            <h2 className='h2 mb-2'>
              Appoint your{' '}
              <span className='relative'>
                agent
                <QuestionDialig question='Appoint your designated agent'>
                  Your chosen agent(s) should be capable and trustworthy adults
                  who can manage your financial and legal matters responsibly.
                  Make sure your agents have strong financial management skills,
                  enough time to handle your affairs, and can make objective
                  decisions while keeping accurate records.
                </QuestionDialig>
              </span>
            </h2>

            <p className='mb-6 text-sm'>
              In this section you’ll designate a trusted individual to manage
              your financial affairs and make decisions on your behalf if you
              become unable to do so.
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
              handleClickNo={resetAlternateAgent}
            />
          </div>

          {isAlternateAgentField && (
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

          {(isAlternateAgentField === true ||
            isAlternateAgentField === false) && (
            <div>
              <h3 className='h3 mb-6'>
                When do you want this power of attorney to become{' '}
                <span className='relative'>
                  effective?
                  <QuestionDialig question='When should your agent be able to make decisions for you?'>
                    <span className='mb-2 block text-xl font-semibold text-[#010D04]'>
                      Choosing Effective Immediately
                    </span>
                    <span className='mb-6 block'>
                      This option allows your agent to act on your behalf as
                      soon as the POA is signed. Choose this if you need
                      immediate assistance or if you trust your agent
                      completely.
                      <br />
                      <span className='flex items-center'>
                        <span className='mx-2 h-1 w-1 shrink-0 rounded-full bg-[#010D0499]' />
                        Pros: Immediate help with tasks and decisions.
                      </span>
                      <span className='flex items-center'>
                        <span className='mx-2 h-1 w-1 shrink-0 rounded-full bg-[#010D0499]' />
                        Cons: Requires a high level of trust in your agent.
                      </span>
                    </span>

                    <span className='mb-2 block text-xl font-semibold text-[#010D04]'>
                      Choosing Effective Upon Disabilityy
                    </span>
                    <span>
                      This option only activates if you become incapacitated.
                      Choose this if you want to maintain control until you are
                      unable to manage your affairs.
                      <br />
                      <span className='flex items-center'>
                        <span className='mx-2 h-1 w-1 shrink-0 rounded-full bg-[#010D0499]' />
                        Pros: Ensures you retain control until necessary.
                      </span>
                      <span className='flex items-center'>
                        <span className='mx-2 h-1 w-1 shrink-0 rounded-full bg-[#010D0499]' />
                        Cons: May delay action until incapacity is confirmed.
                      </span>
                    </span>
                  </QuestionDialig>
                </span>
              </h3>

              <RadioField
                methods={methods}
                name='becomeEffectivePOA'
                labelYes='I want this POA to become effective immediately'
                labelNo='I want this POA to become effective upon disability'
              />
            </div>
          )}

          {getValues('becomeEffectivePOA') && (
            <div className='mt-8 lg:mt-[36px]'>
              <h4 className='mb-[14px] text-sm font-semibold'>
                {isEffectivePoaImmediately
                  ? immediateEffectivePoaHeading
                  : disabilityEffectivePoaHeading}
              </h4>

              <p className='mb-[14px] text-sm text-[#010D0499]'>
                {isEffectivePoaImmediately
                  ? immediateEffectivePoaParagraph
                  : disabilityEffectivePoaParagraph}
              </p>

              <FormField
                control={methods.control}
                name='isUnderstand'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='mt-6 flex items-center'>
                        <Checkbox
                          checked={field.value}
                          id='isUnderstand'
                          className='border-black data-[state=checked]:border-bright data-[state=checked]:bg-bright'
                          onCheckedChange={(checked) =>
                            methods.setValue('isUnderstand', checked === true)
                          }
                        />
                        <Label
                          htmlFor='isUnderstand'
                          className='ml-2 text-sm font-normal'
                        >
                          I undestand
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              isLoading={isNextLoading}
              onClick={handleNext}
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

export default DurablePOAFormAgent;
