'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
import Textarea from '@/components/ui/textarea';
import useLivingWillRequestBody from '@/hooks/living-will/use-living-will-request-body';
import { specificWishesSchema } from '@/schemas/poa/living-will';
import livingWillAPI from '@/services/living-will';
import { LivingWillBody } from '@/services/living-will/types';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useMedicalPOAAgentPowersStore } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { FormDataSpecificWishes } from '@/types';
import { shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type Props = {
  isCombined?: boolean;
};

function SpecificWishes({ isCombined }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const {
    medicalStep,
    decreaseMedicalStep,
    increaseMedicalStep,
    decreaseWishesStep,
  } = useProgressStepStore();
  const { specificWishes, updateSpecificWishes } = useLivingWillWishesStore();
  const { livingWillBody } = useLivingWillRequestBody();
  const { setIsCompletedWishesSection } = useMedicalPOAAgentPowersStore();
  const router = useRouter();
  const methods = useForm<FormDataSpecificWishes>({
    resolver: zodResolver(specificWishesSchema),
    defaultValues: {
      ...specificWishes,
    },
  });

  const {
    getValues,
    setValue,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(specificWishes);
  }, [specificWishes, reset]);

  const resetAdditionalWishes = () => {
    setValue('isAdditionalWishes', undefined);
    setValue('additionalWishes', null);
  };

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    if (isCombined) {
      decreaseWishesStep();
    } else {
      decreaseMedicalStep();
    }
  };

  const submitData = async (
    data: FormDataSpecificWishes,
    isNotRedirect?: boolean,
  ) => {
    const { additionalWishes, endOfLifeCareLocation, isOrganDonation } = data;
    const body: LivingWillBody = {
      ...livingWillBody,
      OtherWishes: additionalWishes,
      whereIWantReceveEndOfLife: endOfLifeCareLocation,
      doYouWantDonateOrgans: isOrganDonation,
      isCompletedWishesSection: true,
    };

    const result = await livingWillAPI.getLivingWill();

    try {
      if (result) {
        await livingWillAPI.updateLivingWill(result.id, body);
      } else {
        await livingWillAPI.createLivingWill(body);
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const {
      endOfLifeCareLocation,
      isOrganDonation,
      additionalWishes,
      isAdditionalWishes,
    } = getValues();

    if (!shouldCallAPI(getValues(), { ...specificWishes })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updateSpecificWishes({
          isOrganDonation,
          endOfLifeCareLocation,
          additionalWishes: additionalWishes as string,
          isAdditionalWishes,
        });
        setIsCompletedWishesSection(true);
        increaseMedicalStep();
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

  const onSubmit = async (data: FormDataSpecificWishes) => {
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
            <h2 className='h2'>Specific Wishes</h2>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Do you want to donate your{' '}
              <span className='relative'>
                organs?
                <QuestionDialig question='Do you want to donate your organs?'>
                  By donating your organs and tissues after death, you have the
                  potential to save up to 8 lives, and enhance up to 75 lives.
                  Many families find comfort in knowing that their loved
                  one&apos;s donation has made a positive impact on others.
                  Additionally, organ and tissue donations play a crucial role
                  in medical research, aiding in the discovery of cures for
                  diseases and the education of future medical professionals. It
                  is essential to discuss your wishes with your family to ensure
                  they understand and support your decision.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isOrganDonation'
              labelNo='No, I don’t want to be an organ donor'
              labelYes='Yes, I want to be an organ donor'
            />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Where would you like to receive end of life{' '}
              <span className='relative'>
                care?
                <QuestionDialig question='Where would you like to receive end of life care?'>
                  You can receive end-of-life care at home, in hospices, or
                  hospitals, based on your needs and preferences. Individuals
                  nearing the end of life are entitled to high-quality care,
                  regardless of where they are being cared for.
                </QuestionDialig>
              </span>
            </h3>

            <FormField
              control={methods.control}
              name='endOfLifeCareLocation'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup {...field} onValueChange={field.onChange}>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          id='endOfLifeCareLocation-home'
                          className='shrink-0'
                          value='home'
                        />
                        <Label
                          htmlFor='endOfLifeCareLocation-home'
                          className='font-normal'
                        >
                          Home
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          id='endOfLifeCareLocation-hospital'
                          className='shrink-0'
                          value='hospital'
                        />
                        <Label
                          htmlFor='endOfLifeCareLocation-hospital'
                          className='font-normal'
                        >
                          Hospital
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          id='endOfLifeCareLocation-hospice-facility'
                          className='shrink-0'
                          value='hospice facility'
                        />
                        <Label
                          htmlFor='endOfLifeCareLocation-hospice-facility'
                          className='font-normal'
                        >
                          Hospice Facility
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          id='endOfLifeCareLocation-no-preference'
                          className='shrink-0'
                          value='no preference'
                        />
                        <Label
                          htmlFor='endOfLifeCareLocation-no-preference'
                          className='font-normal'
                        >
                          No preference
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Are there any other wishes you’d like to include in this{' '}
              <span className='relative'>
                directive?
                <QuestionDialig question='Are there any other wishes you’d like to include in this directive?'>
                  Items to include here may encompass specific instructions
                  about: palliative care, pain management, practices for when
                  you are near death (e.g., prayers, rituals, music), comfort
                  measures (e.g., massages with warm oils, reading poems,
                  regular shaving), and any other preferences you want your
                  healthcare agent and doctors to know about.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isAdditionalWishes'
              labelYes='Yes, I’d like to include other wishes'
              handleClickNo={resetAdditionalWishes}
            />

            {watch('isAdditionalWishes') && (
              <div className='mt-6'>
                <FormField
                  control={methods.control}
                  name='additionalWishes'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='text-xs'>Wishes</Label>
                      <FormControl>
                        <Textarea
                          className={`mt-2 h-[138px] ${errors?.additionalWishes && 'focus:ring-danger-outline'}`}
                          placeholder='Please describe any other wishes you have regarding treatment here'
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
            <Button
              onClick={handleBack}
              type='button'
              variant='outline'
              className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
            >
              <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
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

export default SpecificWishes;
