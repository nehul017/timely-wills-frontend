'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { mainInfoAboutSchema } from '@/schemas/about';
import { useAboutStore } from '@/store/about';
import { useProgressStepStore } from '@/store/progress-steps';
import { AboutMainFormData } from '@/types';
import { formatPhoneNumber } from '@/utils';

import InfoPopup from '../InfoPopup';
import { Input } from '../ui/input';

function MainInfoAboutForm() {
  const { increaseAboutStep, aboutStep } = useProgressStepStore();
  const { firstName, lastName, middleName, phoneNumber, updateMainInfo } =
    useAboutStore();

  const methods = useForm<AboutMainFormData>({
    resolver: zodResolver(mainInfoAboutSchema),
    defaultValues: {
      firstName,
      lastName,
      middleName,
      phoneNumber,
    },
  });

  const {
    formState: { errors },
    reset,
    trigger,
  } = methods;

  useEffect(() => {
    reset({ firstName, lastName, middleName, phoneNumber });
  }, [firstName, lastName, middleName, phoneNumber, reset]);

  const onSubmit = async (data: AboutMainFormData) => {
    updateMainInfo({ ...data });
    increaseAboutStep();
  };

  return aboutStep === 0 ? (
    <div className='w-full'>
      <h1 className='h3 mb-6 flex w-full justify-between'>
        <span className='max-w-[644px]'>
          Congratulations on taking action with your End-of-Life plan. We’ll
          start with a few questions to set up your profile.
        </span>
        <InfoPopup />
      </h1>

      <Form {...methods}>
        <form
          className='w-full lg:max-w-[644px]'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h3 mb-2'>What is your full legal name?</h2>

            <FormField
              control={methods.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <Label className='text-xs'>
                    Your first name
                    <span className='text-danger'>*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.firstName && 'focus:ring-danger-outline'}`}
                      placeholder='First name'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name='middleName'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    Your middle name (optional)
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className='mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12'
                      placeholder='Middle name'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    Your last name
                    <span className='text-danger'>*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.lastName && 'focus:ring-danger-outline'}`}
                      placeholder='Last name'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    Your phone number (optional)
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.phoneNumber && 'focus:ring-danger-outline'}`}
                      placeholder='Phone'
                      onChange={(e) => {
                        const formattedValue = formatPhoneNumber(
                          e.target.value,
                        );
                        field.onChange(formattedValue);
                        trigger('phoneNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
          </div>

          <div className='mt-8 flex justify-end lg:mt-[36px]'>
            <Button
              type='submit'
              className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  ) : null;
}

export default MainInfoAboutForm;
