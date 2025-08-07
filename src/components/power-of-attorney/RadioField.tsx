import React from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
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

function RadioField<T extends FieldValues>({
  methods,
  name,
  labelYes = 'Yes',
  labelNo = 'No',
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
            <RadioGroup {...field} onValueChange={field.onChange}>
              <div className='flex space-x-2 lg:items-center'>
                <RadioGroupItem
                  id={`${name}-yes`}
                  className='shrink-0'
                  value={labelYes}
                  onClick={handleClickYes}
                />
                <Label
                  htmlFor={`${name}-yes`}
                  className='font-normal leading-6'
                >
                  {labelYes}
                </Label>
              </div>

              <div className='flex space-x-2 lg:items-center'>
                <RadioGroupItem
                  id={`${name}-no`}
                  className='shrink-0'
                  value={labelNo}
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

export default RadioField;
