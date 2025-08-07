'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import {  useForm } from 'react-hook-form';
import { AboutBody } from '@/services/about/types';
import aboutAPI from '@/services/about';
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
import { AboutMainFormData } from '@/types';
import { formatPhoneNumber } from '@/utils';
import { toast } from 'sonner';
import WarningIcon from '@/assets/icons/warning-icon'
import { Input } from '../ui/input';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types';

function MainInfoAboutForm() {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    // updateMainInfo({ ...data });

    const body: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName || "",
      phoneNumber: data.phoneNumber || "",
    };

    try {
      const res = await aboutAPI.getAbout();

      if (res) {
        await aboutAPI.updateAbout(res.id as number, body);
        toast('', {
            position: 'top-center',
            duration: 0,
            description: (
              <div className='flex items-center gap-[6px]'>
                <WarningIcon fill='#010D04' className='rotate-180' />
                Main Info Updated!
              </div>
            ),
          });
      } else {
        await aboutAPI.createAbout(body);
      }
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as ErrorResponse;
      toast('', {
        position: 'top-center',
        duration: 4000,
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            {message}
          </div>
        ),
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full lg:max-w-[690px]'>
      <Form {...methods}>
        <form
          className='w-full lg:max-w-[644px]'
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h3 mb-2'>What is your full legal name?</h2>
            <div className='grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2'>
              
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
                    <Label className='mt-2 block text-xs'>
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
                    <Label className='mt-2 block text-xs'>
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
                    <Label className='mt-2 block text-xs'>
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
          </div>
          <div className='mt-8 flex justify-end lg:mt-[36px] lg:mb-0 mb-8'>
            <Button
              type='submit'
              disabled={isLoading}
              className='h-[35px] w-full bg-[#25D998] text-xs font-semibold lg:w-[100px] flex items-center justify-center gap-2'
            >
              {isLoading && (
                <svg
                  className='h-4 w-4 animate-spin text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  ></path>
                </svg>
              )}
              {isLoading ? 'Updating...' : 'UPDATE'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default MainInfoAboutForm;
