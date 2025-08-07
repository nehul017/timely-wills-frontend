'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ArrowRightIcon from '@/assets/icons/arrow-right';
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

type FormData = z.infer<typeof aboutAddressSchema>;

function AddressForm() {
  const { increaseAboutStep, decreaseAboutStep, aboutStep } =
    useProgressStepStore();
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
    const {
      userAddress: { address, birthday },
    } = data;

    increaseAboutStep();
    updateAddress({ ...address });
    updateBirthday(birthday);
  };

  return aboutStep === 1 ? (
    <div className='w-full lg:max-w-[690px]'>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              type='submit'
              className={`h-[52px] w-full text-lg font-semibold lg:w-[200px] ${errors?.userAddress?.birthday?.message ? 'bg-[#f3f3f3] text-[#DEE0DF] hover:bg-[#f3f3f3]' : 'bg-bright'}`}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  ) : null;
}

export default AddressForm;
