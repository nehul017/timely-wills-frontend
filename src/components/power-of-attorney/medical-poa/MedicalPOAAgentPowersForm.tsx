'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import {
  agentPopupDecisions,
  daysOptions,
  monthsOptions,
  yearsOptions,
} from '@/constant/poa';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import { medicalPOAAgentPowersSchema } from '@/schemas/poa/medical';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPOABody } from '@/services/medical-poa/types';
import { useMedicalPOAAgentPowersStore } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { MedicalPOAAgentPowers } from '@/types';
import { getKeyDecision, shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

function MedicalPOAAgentPowersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { medicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const {
    hipaaAuthorization,
    limitations,
    makeDecision,
    updateAgentPowers,
    certainDate,
    isLimitations,
  } = useMedicalPOAAgentPowersStore();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const router = useRouter();

  const methods = useForm<MedicalPOAAgentPowers>({
    resolver: zodResolver(medicalPOAAgentPowersSchema),
    defaultValues: {
      hipaaAuthorization,
      certainDate,
      isLimitations,
      limitations,
      makeDecision,
    },
  });

  const objectToCheck = {
    hipaaAuthorization,
    certainDate,
    isLimitations,
    limitations,
    makeDecision,
  };

  const {
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const resetCertainDate = () => {
    setValue('certainDate', undefined);
  };

  const submitData = async (
    data: MedicalPOAAgentPowers,
    isNotRedirect?: boolean,
  ) => {
    const { hipaaAuthorization, limitations, makeDecision, certainDate } = data;

    const body: MedicalPOABody = {
      ...medicalBody,
      isCompletedAgentPowersSection: true,
      isAgentCanHaveAccessToYourProtectedHealthInformation: hipaaAuthorization,
      whenAgentCanMakeDecisions: getKeyDecision(makeDecision),
      dateOfActivation: certainDate?.day
        ? dayjs(Object.values(certainDate).join('-'), 'YYYY-MMMM-DD').format(
            'YYYY-MM-DD',
          )
        : null,
      limitations,
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

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();

    if (!isValid) {
      return;
    }

    const {
      hipaaAuthorization,
      makeDecision,
      certainDate,
      isLimitations,
      limitations,
    } = getValues();

    if (!shouldCallAPI(getValues(), objectToCheck)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseMedicalStep();
        updateAgentPowers({
          isCompletedAgentPowersSection: true,
          hipaaAuthorization,
          makeDecision,
          certainDate,
          isLimitations,
          limitations,
        });
      } catch (error) {
        console.error(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseMedicalStep();
    }
  };

  const onSubmit = async (data: MedicalPOAAgentPowers) => {
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
          <h2 className='h2 mb-8 lg:mb-[36px]'>Agent Powers</h2>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              When should your agent be able to make decisions for{' '}
              <span className='relative'>
                you?
                <QuestionDialig question='When should your agent be able to make decisions for you?'>
                  <span className='flex flex-col space-y-6 lg:space-y-8'>
                    {agentPopupDecisions.map((item) => {
                      const [start, end] = item.split(':');
                      return (
                        <span key={item}>
                          <span className='font-bold'>{`${start}:`}</span>
                          {end}
                        </span>
                      );
                    })}
                  </span>
                </QuestionDialig>
              </span>
            </h3>

            <FormField
              control={methods.control}
              name='makeDecision'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          className='shrink-0'
                          id='makeDecision-1'
                          value='Right after signing this form'
                          onClick={resetCertainDate}
                        />
                        <Label htmlFor='makeDecision-1' className='font-normal'>
                          Right after signing this form
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          className='shrink-0'
                          onClick={resetCertainDate}
                          id='makeDecision-2'
                          value='Only after my physician determines I can’t make my own decisions'
                        />
                        <Label htmlFor='makeDecision-2' className='font-normal'>
                          Only after my physician determines I can’t make my own
                          decisions
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watch('makeDecision') ===
              'On a certain date that I will specify' && (
              <div className='mt-6 flex flex-col gap-[14px] lg:flex-row lg:gap-6'>
                <div className='lg:w-1/3'>
                  <FormField
                    control={methods.control}
                    name='certainDate.month'
                    render={({ field }) => (
                      <FormItem>
                        <Label className='text-xs'>Month</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.certainDate?.root && !watch('certainDate.month') ? 'custom-outline' : undefined}`}
                            >
                              <SelectValue placeholder='Month' />
                              <SelectContent>
                                <SelectGroup>
                                  {monthsOptions.map((item) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectTrigger>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='lg:w-1/3'>
                  <FormField
                    control={methods.control}
                    name='certainDate.day'
                    render={({ field }) => (
                      <FormItem>
                        <Label className='text-xs'>Day</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.certainDate?.root && !watch('certainDate.day') ? 'custom-outline' : undefined}`}
                            >
                              <SelectValue placeholder='Day' />
                              <SelectContent>
                                <SelectGroup>
                                  {daysOptions.map((item) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectTrigger>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='lg:w-1/3'>
                  <FormField
                    control={methods.control}
                    name='certainDate.year'
                    render={({ field }) => (
                      <FormItem>
                        <Label className='text-xs'>Year</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.certainDate?.root && !watch('certainDate.year') ? 'custom-outline' : undefined}`}
                            >
                              <SelectValue placeholder='Year' />
                              <SelectContent>
                                <SelectGroup>
                                  {yearsOptions.map((item) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectTrigger>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Do you authorize your healthcare providers to share your protected
              health information and medical records with your agent?{' '}
              <span className='relative'>
                (HIPAA&nbsp;Authorization)
                <QuestionDialig question='What happens if I say ‘Yes’ or ‘No’ to HIPAA Authorization?'>
                  <span className='flex flex-col space-y-6 lg:space-y-8'>
                    <span>
                      <span className='font-bold'>Yes:</span> Granting
                      authorization allows your agent access to your medical
                      records and health information. This can help them make
                      informed decisions about your healthcare.
                    </span>
                    <span>
                      <span className='font-bold'>No:</span> Denying
                      authorization means your agent will not have access to
                      your medical records or health information, which may
                      limit their ability to make informed healthcare decisions
                      on your behalf.
                    </span>
                  </span>
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean methods={methods} name='hipaaAuthorization' />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Will there be ANY limitations to the agent’s{' '}
              <span className='relative'>
                powers?
                <QuestionDialig question="Do you want to impose any limitations on your agent's powers?">
                  You can set specific restrictions on what your agent can and
                  cannot do. For example, you might want to prevent your agent
                  from selling certain assets, limit how much they can spend, or
                  restrict access to specific accounts. Clearly defining these
                  limitations helps ensure that your agent acts according to
                  your preferences and protects your interests.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isLimitations'
              handleClickNo={() => setValue('limitations', '')}
              labelYes='Yes, there will be limitations'
            />

            {watch('isLimitations') && (
              <FormField
                control={methods.control}
                name='limitations'
                render={({ field }) => (
                  <FormItem>
                    <Label className='mt-6 block text-xs'>
                      The Agent is authorized to make all health care decisions
                      for me, including decisions to provide, withhold, or
                      withdraw artificial nutrition and hydration and all other
                      forms of health care for survival , except as I state
                      here:
                    </Label>
                    <FormControl>
                      <Textarea
                        className={`mt-2 h-[72px] lg:h-[126px] ${errors.limitations && 'focus:ring-danger-outline'}`}
                        placeholder='Limitations'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
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

export default MedicalPOAAgentPowersForm;
