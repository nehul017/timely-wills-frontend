'use client';

import React, { useEffect, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { presonTypeOptions } from '@/constant/will';
import { EmailPostal, ExecutorFormData } from '@/types';

import SelectTextInput from '../SelectTextInput';

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
};

function FormFields({ methods }: Props<ExecutorFormData>) {
  const {
    formState: { errors },
    getValues,
  } = methods;
  const [emailOrPostal, setEmailOrPostal] = useState<EmailPostal>(
    getValues('address') ? 'postal' : 'email',
  );

  useEffect(() => {
    setEmailOrPostal(getValues('address') ? 'postal' : 'email');
  }, [getValues('address')]);

  const isEmail = emailOrPostal === 'email';

  const handleChangeField = () => {
    if (emailOrPostal === 'email') {
      methods.setValue('email', '');
      setEmailOrPostal('postal');
    } else {
      methods.setValue('address', '');
      setEmailOrPostal('email');
    }
  };

  return (
    <>
      <FormField
        control={methods.control}
        name='fullName'
        render={({ field }) => (
          <FormItem className='mb-6'>
            <Label className='flex items-center justify-between text-xs'>
              <div>
                Full legal name
                <span className='text-danger'>*</span>
              </div>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.fullName && 'focus:ring-danger-outline'}`}
                placeholder='Full legal name'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SelectTextInput
        label='This person is my'
        methods={methods}
        name='personType'
        options={presonTypeOptions}
      />

      <FormField
        control={methods.control}
        name={isEmail ? 'email' : 'address'}
        render={({ field }) => (
          <FormItem className='mb-6'>
            <Label className='flex items-center justify-between text-xs'>
              <div>
                {isEmail ? 'Email address' : 'Postal address'}
                <span className='text-danger'>*</span>
              </div>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${(isEmail ? errors.email : errors.address) && 'focus:ring-danger-outline'}`}
                placeholder={isEmail ? 'Email address' : 'Postal address'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type='button'
        onClick={() => handleChangeField()}
        className='h-fit w-fit p-0 text-[16px] font-semibold underline'
        variant='link'
      >
        {emailOrPostal === 'email'
          ? 'Use postal address instead'
          : 'Use email address instead'}
      </Button>

      <FormField
        control={methods.control}
        name='isOver18'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className='mt-6 flex items-center'>
                <Checkbox
                  checked={field.value}
                  id='is-over-18'
                  className='border-black data-[state=checked]:border-bright data-[state=checked]:bg-bright'
                  onCheckedChange={(checked) =>
                    methods.setValue('isOver18', checked === true)
                  }
                />
                <Label
                  htmlFor='is-over-18'
                  className='ml-2 text-sm font-normal'
                >
                  I confirm this executor is over the age of 18
                </Label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default FormFields;
