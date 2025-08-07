'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import QuestionDialog from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import Textarea from '@/components/ui/textarea';
import { agentsPowersQuestionsWithAnswers } from '@/constant/poa';
import useDurableRequestBody from '@/hooks/durable-poa/use-durable-request-body';
import { durablePOAAgentPowersSchema } from '@/schemas/poa/durable';
import durablePoaAPI from '@/services/durable-poa';
import { DurablePOABody } from '@/services/durable-poa/types';
import { useDurablePOAAgentPowersStore } from '@/store/durable-poa';
import { AgentPowers } from '@/store/durable-poa/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { FormDataAgentPowers } from '@/types';
import { formatPhoneNumber, shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type GuardianField = 'email' | 'phone' | 'postal';

function DurablePOAAgentPowersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { powers, updatePowersState, setIsCompletedAgentPowersSection } =
    useDurablePOAAgentPowersStore();
  const { durableBody, durableId } = useDurableRequestBody();
  const { durableStep, decreaseDurableStep, increaseDurableStep } =
    useProgressStepStore();
  const router = useRouter();

  const { guardian } = powers;

  const guardianFieldToContact: GuardianField = guardian.phoneNumber
    ? 'phone'
    : guardian.postalAddress
      ? 'postal'
      : 'email';
  const [guardianField, setGuardianField] = useState<GuardianField>(
    guardianFieldToContact,
  );

  const methods = useForm<FormDataAgentPowers>({
    resolver: zodResolver(durablePOAAgentPowersSchema),
    defaultValues: { ...powers },
  });

  const {
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset({ ...powers });
  }, [powers, reset]);

  const resetGuardian = () => {
    setValue('guardian', {
      email: '',
      fullName: '',
      phoneNumber: '',
      postalAddress: '',
    });
    setValue('isOver18', undefined);
  };

  const submitData = async (
    data: FormDataAgentPowers,
    isNotRedirect?: boolean,
  ) => {
    const {
      generalOverallAuthority,
      isMaintenance,
      isManageAccounts,
      isManageProperty,
      isManageRealEstate,
      isManageInsuranceAndAnnuityTransactions,
      isManageRetirementAccounts,
      isManageGovernmentalBenefits,
      isManageTaxMatters,
      isManageEstateTrust,
      isMakeGifts,
      isManageSecurities,
      isManageClaimsLitigations,
      restrictions,
      guardian,
      isGuardian,
      isRestrictions,
    } = data;

    const body: DurablePOABody = {
      ...durableBody,
      isCompletedAgentPowersSection: true,
      isGuardian,
      isAgentRestrictions: isRestrictions,
      generalOverallAuthority:
        generalOverallAuthority === 'Yes' ? generalOverallAuthority : 'no',
      guardian: guardian?.fullName
        ? {
            fullName: guardian.fullName || null,
            email: guardian.email || null,
            phoneNumber: guardian.phoneNumber || null,
            postalAddress: guardian.postalAddress || null,
          }
        : null,
      isCanMaintenance: isMaintenance,
      isCanMakeGiftsUsingYourProperty: isMakeGifts,
      isCanManageClaimsAndLitigations: isManageClaimsLitigations,
      isCanManageInsuranceAndAnnuityTransactions:
        isManageInsuranceAndAnnuityTransactions,
      isCanManageFiinance: isManageAccounts,
      isCanManageGovermentBenefits: isManageGovernmentalBenefits,
      isCanManageInterestInEstateOrTrust: isManageEstateTrust,
      isCanManageRealEstate: isManageRealEstate,
      isCanManageRetuirementAccounts: isManageRetirementAccounts,
      isCanManageSecurityTransactions: isManageSecurities,
      isCanManageTangiblePersonalProperty: isManageProperty,
      isCanManageTax: isManageTaxMatters,
      restrictions,
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

  const handleGuardianField = (value: GuardianField) => {
    setGuardianField(value);
  };

  const setDefaultValues = () => {
    const defaultValues: Partial<AgentPowers> = {
      generalOverallAuthority: 'Yes',
      isMaintenance: true,
      isManageAccounts: true,
      isManageProperty: true,
      isManageRealEstate: true,
      isManageInsuranceAndAnnuityTransactions: true,
      isManageRetirementAccounts: true,
      isManageGovernmentalBenefits: true,
      isManageTaxMatters: true,
      isManageEstateTrust: true,
      isMakeGifts: true,
      isManageSecurities: true,
      isManageClaimsLitigations: true,
    } as const;

    Object.entries(defaultValues).forEach(([key, value]) =>
      setValue(key as keyof FormDataAgentPowers, value),
    );
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

    if (!isValid || (watch('isGuardian') && !watch('isOver18'))) {
      return;
    }

    if (!shouldCallAPI(getValues(), { ...powers })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        increaseDurableStep();
        updatePowersState(getValues());
        setIsCompletedAgentPowersSection(true);
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

  const onSubmit = async (data: FormDataAgentPowers) => {
    if (watch('isGuardian') && !watch('isOver18')) {
      return;
    }

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

  const handleClickNoGeneralPowers = () => {
    if (watch('generalOverallAuthority') === 'Yes') {
      reset({
        generalOverallAuthority: 'No, I choose only specific powers',
        guardian: getValues('guardian'),
        restrictions: getValues('restrictions'),
        isGuardian: getValues('isGuardian'),
        isRestrictions: getValues('isRestrictions'),
        isOver18: getValues('isOver18'),
      });
    }
  };

  return (
    <div className='w-full lg:max-w-[690px]'>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='mb-2 text-2xl font-bold'>
              What powers do you wish to grant your agent?
            </h2>

            <p className='text-sm'>
              In this section, you can grant your agent either broad or
              restricted authority to make legal decisions regarding your
              property, finances, and other matters.
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-2'>
              Do you wish to grant your agent with general overall{' '}
              <span className='relative'>
                authority?
                <QuestionDialog question='Do you wish to grant your agent with general overall authority?'>
                  If you choose to grant your agent general authority, they will
                  have the power to act on your behalf in all matters,
                  performing any actions you could do if you were personally
                  present.
                </QuestionDialog>
              </span>
            </h3>

            <FormField
              control={methods.control}
              name='generalOverallAuthority'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup {...field} onValueChange={field.onChange}>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          onClick={setDefaultValues}
                          value='Yes'
                          id='authority-yes'
                        />
                        <Label htmlFor='authority-yes' className='font-normal'>
                          Yes
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          onClick={handleClickNoGeneralPowers}
                          value='No, I choose only specific powers'
                          id='authority-no'
                        />
                        <Label htmlFor='authority-no' className='font-normal'>
                          No, I choose only specific powers
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
          </div>

          {watch('generalOverallAuthority').includes('No') && (
            <>
              {agentsPowersQuestionsWithAnswers.map(
                ({ answer, name, question }) => {
                  const lastWord = question.split(' ').pop();

                  return (
                    <div key={name} className='mb-8 lg:mb-[36px]'>
                      <h3 className='h3 mb-6'>
                        {question.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className='relative'>
                          {lastWord}
                          <QuestionDialog question={question}>
                            {answer}
                          </QuestionDialog>
                        </span>
                      </h3>

                      <RadioFieldBoolean
                        methods={methods}
                        name={name as keyof FormDataAgentPowers}
                      />
                    </div>
                  );
                },
              )}
            </>
          )}

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Would you like to put any restrictions on your{' '}
              <span className='relative'>
                agent(s)?
                <QuestionDialog question='Would you like to put any restrictions on your agent(s)?'>
                  You are giving your agent considerable authority, so you might
                  consider setting some limitations on their powers. For
                  instance, you may want to restrict your agent from selling a
                  specific property or limit the amount they can spend on
                  renovating it.
                </QuestionDialog>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isRestrictions'
              handleClickNo={() => setValue('restrictions', '')}
            />
          </div>

          {watch('isRestrictions') && (
            <FormField
              control={methods.control}
              name='restrictions'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-[-12px] block text-xs'>
                    Restrictions
                  </Label>
                  <FormControl>
                    <Textarea
                      className={`mt-2 h-[94px] ${errors.restrictions && 'focus:ring-danger-outline'}`}
                      placeholder='Specify the restrictions here...'
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className='mb-8 mt-8 lg:mb-6 lg:mt-[36px]'>
            <h3 className='h3 mb-6'>
              Would you like to nominate a guardian of your person and{' '}
              <span className='relative'>
                estate?
                <QuestionDialog question='Would you like to nominate a guardian of your person and estate?'>
                  <span className='mb-2 block'>
                    In a Durable Power of Attorney (DPOA), it’s common to
                    nominate the same person named as your agent to avoid
                    potential conflicts.
                  </span>
                  <span>
                    This role is similar to that of your agent. A DFPA lets you
                    bypass court-run guardianship proceedings by allowing your
                    agent to manage your property if you become incapacitated.
                    However, DFPAs can sometimes be set aside or invalidated. If
                    this happens, your agent loses authority, and a guardian may
                    need to be appointed. This option allows you to nominate
                    someone as the guardian and conservator of your person and
                    estate, and courts typically honor these nominations.
                  </span>
                </QuestionDialog>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isGuardian'
              handleClickNo={resetGuardian}
            />
          </div>

          {watch('isGuardian') && (
            <div className='mb-8 lg:mb-9'>
              <FormField
                control={methods.control}
                name='guardian.fullName'
                render={({ field }) => (
                  <FormItem>
                    <Label className='mt-6 block text-xs'>
                      Guardian’s full legal name
                      <span className='text-danger'>*</span>
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardian?.fullName && 'focus:ring-danger-outline'}`}
                        placeholder='Guardian’s full legal name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {guardianField === 'email' && (
                <FormField
                  control={methods.control}
                  name='guardian.email'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='mt-6 block text-xs'>
                        Email address
                        <span className='text-danger'>*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardian?.email && 'focus:ring-danger-outline'}`}
                          placeholder='Email address'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-normal' />
                    </FormItem>
                  )}
                />
              )}

              {guardianField === 'phone' && (
                <FormField
                  control={methods.control}
                  name='guardian.phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='mt-6 block text-xs'>
                        Phone number
                        <span className='text-danger'>*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardian?.phoneNumber && 'focus:ring-danger-outline'}`}
                          placeholder='Phone number'
                          onChange={(e) => {
                            const formattedValue = formatPhoneNumber(
                              e.target.value,
                            );
                            field.onChange(formattedValue);
                            methods.trigger('guardian.phoneNumber');
                          }}
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-normal' />
                    </FormItem>
                  )}
                />
              )}

              {guardianField === 'postal' && (
                <FormField
                  control={methods.control}
                  name='guardian.postalAddress'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='mt-6 block text-xs'>
                        Postal address
                        <span className='text-danger'>*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardian?.postalAddress && 'focus:ring-danger-outline'}`}
                          placeholder='Postal address'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-normal' />
                    </FormItem>
                  )}
                />
              )}

              {errors.guardian?.root && (
                <p className='mt-2 text-xs text-danger'>
                  {errors.guardian?.root?.message}
                </p>
              )}

              <div className='mt-6'>
                <FormField
                  control={methods.control}
                  name='isOver18'
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className='flex items-center'>
                          <Checkbox
                            checked={watch('isOver18')}
                            id='is-over-18'
                            className='border-black data-[state=checked]:border-bright data-[state=checked]:bg-bright'
                            onCheckedChange={(checked) =>
                              setValue('isOver18', checked === true)
                            }
                          />
                          <Label
                            htmlFor='is-over-18'
                            className='ml-2 text-sm font-normal'
                          >
                            I confirm this guardian is over the age of 18
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mt-6 flex flex-col space-y-[14px]'>
                <Button
                  type='button'
                  onClick={() => {
                    handleGuardianField(
                      guardianField !== 'phone' ? 'phone' : 'email',
                    );
                    setValue('guardian', {
                      email: '',
                      postalAddress: '',
                      fullName: getValues('guardian.fullName'),
                    });
                  }}
                  className='h-fit w-fit p-0 text-[16px] font-semibold underline'
                  variant='link'
                >
                  {guardianField !== 'phone'
                    ? 'Use phone number instead'
                    : 'Use email address instead'}
                </Button>

                <Button
                  type='button'
                  onClick={() => {
                    handleGuardianField(
                      guardianField !== 'postal' ? 'postal' : 'email',
                    );
                    setValue('guardian', {
                      email: '',
                      phoneNumber: '',
                      fullName: getValues('guardian.fullName'),
                    });
                  }}
                  className='h-fit w-fit p-0 text-[16px] font-semibold underline'
                  variant='link'
                >
                  {guardianField !== 'postal'
                    ? 'Use postal address instead'
                    : 'Use email address instead'}
                </Button>
              </div>
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

export default DurablePOAAgentPowersForm;
