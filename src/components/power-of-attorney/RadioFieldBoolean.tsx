import React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';

type Props<T extends FieldValues> = {
  name: Path<T>;
  methods: UseFormReturn<T>;
  labelYes?: string;
  labelNo?: string;
  handleClickYes?: () => void;
  handleClickNo?: () => void;
};

function RadioFieldBoolean<T extends FieldValues>({
  methods,
  name,
  labelNo = 'No',
  labelYes = 'Yes',
  handleClickNo,
  handleClickYes,
}: Props<T>) {
  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value === 'Yes')}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  id={`${name}-yes`}
                  className='shrink-0'
                  value='Yes'
                  checked={field.value === true}
                  onClick={handleClickYes}
                />
                <Label
                  htmlFor={`${name}-yes`}
                  className='font-normal leading-6'
                >
                  {labelYes}
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  id={`${name}-no`}
                  className='shrink-0'
                  value='No'
                  checked={field.value === false}
                  onClick={handleClickNo}
                />
                <Label htmlFor={`${name}-no`} className='font-normal leading-6'>
                  {labelNo}
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default RadioFieldBoolean;
