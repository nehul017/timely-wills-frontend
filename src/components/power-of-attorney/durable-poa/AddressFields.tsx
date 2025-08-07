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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stateOptions } from '@/constant/poa';
import { AddressProps } from '@/types';

type Props<T extends FieldValues> = {
  name: Path<T>;
  methods: UseFormReturn<T>;
  isPhysician?: boolean;
};

function AddressFields<T extends FieldValues>({
  name,
  methods,
  isPhysician,
}: Props<T>) {
  const {
    formState: { errors },
  } = methods;

  const getFieldError = () => {
    const agentErrors = errors[name] as
      | Record<string, AddressProps>
      | undefined;

    return agentErrors ? agentErrors.address : undefined;
  };

  return (
    <>
      <FormField
        control={methods.control}
        name={`${name}.address.address_line_1` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              Address Line 1
              {!isPhysician && <span className='text-danger'>*</span>}
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError()?.address_line_1 && 'focus:ring-danger-outline'}`}
                placeholder='Address Line 1'
              />
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name={`${name}.address.address_line_2` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              Address Line 2 (optional)
            </Label>
            <FormControl>
              <Input
                {...field}
                className='mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12'
                placeholder='Address Line 2'
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className='flex gap-[12px] lg:gap-6'>
        <FormField
          control={methods.control}
          name={`${name}.address.city` as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <Label className='mt-6 block text-xs'>
                City
                {!isPhysician && <span className='text-danger'>*</span>}
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError()?.city && 'focus:ring-danger-outline'}`}
                  placeholder='City'
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name={`${name}.address.zip_code` as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <Label className='mt-6 block text-xs'>
                Zip Code
                {!isPhysician && <span className='text-danger'>*</span>}
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${getFieldError()?.zip_code && 'focus:ring-danger-outline'}`}
                  placeholder='Zip code'
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={methods.control}
        name={`${name}.address.state` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <Label className='mt-6 block text-xs'>
              State
              {!isPhysician && <span className='text-danger'>*</span>}
            </Label>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${getFieldError()?.state ? 'custom-outline' : undefined}`}
                >
                  <SelectValue placeholder='State' />
                  <SelectContent>
                    <SelectGroup>
                      {stateOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </FormControl>
            <FormMessage className='text-xs font-normal' />
          </FormItem>
        )}
      />
    </>
  );
}

export default AddressFields;
