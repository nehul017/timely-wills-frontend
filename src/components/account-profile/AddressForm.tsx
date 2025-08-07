'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { aboutAddressSchema } from '@/schemas/about';
import { useAboutStore } from '@/store/about';
import { useProgressStepStore } from '@/store/progress-steps';
import { formatDate } from '@/utils';
import AddressFields from '../power-of-attorney/durable-poa/AddressFields';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import aboutAPI from '@/services/about';
import dayjs from 'dayjs';
import WarningIcon from '@/assets/icons/warning-icon'
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types';

type FormData = z.infer<typeof aboutAddressSchema>;

function AddressForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { address, updateAddress, updateBirthday, birthday } = useAboutStore();

  const methods = useForm<FormData>({
    resolver: zodResolver(aboutAddressSchema),
    defaultValues: {
      userAddress: {
        address,
        birthday,
      },
    },
  });

  const {
    setValue,
    formState: { errors },
    trigger,
  } = methods;

  useEffect(() => {
    setValue('userAddress.address', { ...address });
    setValue('userAddress.birthday', birthday);
  }, [address, setValue, birthday]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const {
      userAddress: { address, birthday },
    } = data;

    // updateAddress({ ...address });
    // updateBirthday(birthday);

    const body: any = {
      county: address.county,
      address,
      dateOfBirth: dayjs(birthday).format('YYYY-MM-DD'),birthday,
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
              Address Info Updated!
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
      console.error(err);
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
            <h2 className='h3 mb-2'>
              What is your current residential address?
            </h2>

            <AddressFields methods={methods} name='userAddress' />

            <FormField
              control={methods.control}
              name='userAddress.address.county'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    County<span className='text-danger'>*</span> (Not Country)
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.userAddress?.address?.county && 'focus:ring-danger-outline'}`}
                      placeholder='County'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name='userAddress.birthday'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>Date of birth</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.userAddress?.birthday && 'focus:ring-danger-outline'}`}
                      placeholder='mm/dd/yyyy'
                      onChange={(e) => {
                        const formattedValue = formatDate(e.target.value);
                        field.onChange(formattedValue);
                        trigger('userAddress.birthday');
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
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

export default AddressForm;
