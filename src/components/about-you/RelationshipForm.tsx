'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { relationshipSchema } from '@/schemas/about';
import aboutAPI from '@/services/about';
import { AboutBody } from '@/services/about/types';
import { useAboutStore } from '@/store/about';
import { useProgressStepStore } from '@/store/progress-steps';
import { RelationshipFormData } from '@/types';

import InfoPopup from '../InfoPopup';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio';

function RelationshipForm() {
  const { increaseAboutStep, aboutStep, decreaseAboutStep } =
    useProgressStepStore();
  const {
    partner,
    status,
    updateStatus,
    birthday,
    firstName,
    middleName,
    address,
    lastName,
    phoneNumber,
    state,
  } = useAboutStore();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<RelationshipFormData>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      status,
      partner,
    },
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();

  useEffect(() => {
    reset({ partner, status });
  }, [partner, status, reset]);

  const clearPartner = () => {
    setValue('partner', {
      email: '',
      fullName: '',
    });
  };

  const onSubmit = async (data: RelationshipFormData) => {
    setIsLoading(true);

    const { partner, status } = data;

    const body: AboutBody = {
      address: address.address_line_1 ? address : null,
      county: address.county || null,
      dateOfBirth: dayjs(birthday).format('YYYY-MM-DD'),
      firstName,
      lastName,
      midleName: middleName || null,
      partnerEmail: partner.email || null,
      partnerName: partner.fullName || null,
      partnerStatus: status.toLowerCase(),
      phoneNumber: phoneNumber || null,
      state,
    };

    try {
      const res = await aboutAPI.getAbout();

      if (res) {
        await aboutAPI.updateAbout(res.id as number, body);
      } else {
        await aboutAPI.createAbout(body);
      }

      updateStatus({ partner, status });
      router.push('/will');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return aboutStep === 2 ? (
    <div className='w-full'>
      <h2 className='h3 mb-6 flex justify-between'>
        What is your relationship status? <InfoPopup />
      </h2>

      <Form {...methods}>
        <form
          className='w-full lg:mt-[-40px] lg:max-w-[644px]'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className='mb-8 lg:mb-[36px]'>
            <FormField
              control={methods.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className='gap-6'
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <div className='flex items-center'>
                        <Label
                          htmlFor='Single'
                          className={`relationship ${field.value === 'Single' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                        >
                          <div className='flex flex-col gap-1 leading-5'>
                            <span className='text-[16px] font-semibold leading-6'>
                              Single
                            </span>
                            <span>
                              Including separated, divorced, or widowed
                            </span>
                          </div>
                          <RadioGroupItem
                            onClick={clearPartner}
                            value='Single'
                            id='Single'
                          />
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <Label
                          htmlFor='Married'
                          className={`relationship ${field.value === 'Married' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                        >
                          <div className='flex flex-col gap-1 leading-5'>
                            <span className='text-[16px] font-semibold leading-6'>
                              Married
                            </span>
                            <span>Legally married</span>
                          </div>
                          <RadioGroupItem value='Married' id='Married' />
                        </Label>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <Label
                          htmlFor='domestic-relationship'
                          className={`relationship ${field.value?.includes('Defacto/') ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                        >
                          <div className='flex flex-col gap-1 leading-5'>
                            <span className='text-[16px] font-semibold leading-6'>
                              Domestic Partnership
                            </span>
                            <span>
                              Living together as a committed couple without
                              marriage
                            </span>
                          </div>
                          <RadioGroupItem
                            value='Defacto/ domestic relationship'
                            id='domestic-relationship'
                          />
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {watch('status') !== 'Single' && watch('status') && (
            <div className='mb-8 lg:mb-[36px]'>
              <h2 className='h3 mb-6'>Who is your partner?</h2>

              <div className='space-y-6'>
                <FormField
                  control={methods.control}
                  name='partner.fullName'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='text-xs'>
                        Partners full name
                        <span className='text-danger'>*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.partner?.fullName && 'focus:ring-danger-outline'}`}
                          placeholder='Partners full name'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-normal' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name='partner.email'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='text-xs'>
                        Partners email address (optional)
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.partner?.email && 'focus:ring-danger-outline'}`}
                          placeholder='Partners email address'
                        />
                      </FormControl>
                      <FormMessage className='text-xs font-normal' />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
            <Button
              type='button'
              onClick={decreaseAboutStep}
              variant='outline'
              className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
            >
              <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
              Back
            </Button>

            <Button
              isLoading={isLoading}
              type='submit'
              className='h-[52px] w-full bg-bright text-lg font-semibold lg:w-[200px]'
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  ) : null;
}

export default RelationshipForm;
