import React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SelectTextInput from '@/components/will/SelectTextInput';
import { presonTypeOptions } from '@/constant/will';
import { formatPhoneNumber } from '@/utils';

type Props<T extends FieldValues> = {
  agent: Path<T>;
  methods: UseFormReturn<T>;
  label?: string;
  isPersonType?: boolean;
};

function AgentFields<T extends FieldValues>({
  agent,
  methods,
  label = 'Agent’s',
  isPersonType,
}: Props<T>) {
  const {
    formState: { errors },
    trigger,
  } = methods;

  const getFieldError = (field: string) => {
    const agentErrors = errors[agent] as Record<string, any> | undefined;

    return agentErrors ? agentErrors[field] : undefined;
  };

  return (
    <>
      <FormField
        control={methods.control}
        name={`${agent}.fullName` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              {`${label} full legal name`}
              <span className='text-danger'>*</span>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError('fullName') && 'focus:ring-danger-outline'}`}
                placeholder={`${label} full legal name`}
              />
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      />

      {isPersonType && (
        <div className='mt-6'>
          <SelectTextInput
            label='This person is my'
            options={presonTypeOptions}
            methods={methods}
            name={`${agent}.personType` as Path<T>}
          />
        </div>
      )}
      {/* 
      <FormField
        control={methods.control}
        name={`${agent}.phoneNumber` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              {`${label} phone number`}
              <span className='text-danger'>*</span>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError('phoneNumber') && 'focus:ring-danger-outline'}`}
                placeholder={`${label} phone number`}
              />
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      /> */}

      <FormField
        control={methods.control}
        name={`${agent}.phoneNumber` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              {`${label} phone number`}
              <span className='text-danger'>*</span>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError('phoneNumber') && 'focus:ring-danger-outline'}`}
                placeholder={`${label} phone number`}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  field.onChange(formattedValue);
                  trigger(`${agent}.phoneNumber` as Path<T>);
                }}
              />
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name={`${agent}.email` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              {`${label} email address (optional)`}
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError('email') && 'focus:ring-danger-outline'}`}
                placeholder={`${label} email address`}
              />
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      />
    </>
  );
}

export default AgentFields;
