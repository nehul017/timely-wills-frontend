import { ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { presonTypeOptions } from '@/constant/will';
import useDisplayOtherPersonOption from '@/hooks/use-dispaly-other-person-option';
import { petGuardianSchema } from '@/schemas/will/family';
import { Child, Guardian, Pet } from '@/store/will/family-and-guardians/types';

import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

type Props<T extends FieldValues> = {
  index: number;
  methods: UseFormReturn<T>;
  array: Child[] | Pet[];
};

type EmailPostal = {
  field: 'email' | 'postal';
  index: number;
};

function GuardianFields({
  index,
  methods,
  array,
}: Props<z.infer<typeof petGuardianSchema>>) {
  const {
    setValue,
    formState: { errors },
  } = methods;

  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [emailOrPostal, setEmailOrPostal] = useState<EmailPostal[]>(
    array.map((item, i) => ({
      field: item.guardian?.address ? 'postal' : 'email',
      index: i,
    })),
  );

  const guardians = array.map(({ guardian }) => guardian);
  const { otherOptions, setOtherOptions } = useDisplayOtherPersonOption(
    guardians as Guardian[],
  );

  const handleIconClick = (i: number) => {
    setIsOpenSelect(true);
    setOtherOptions(
      otherOptions.map((item) =>
        item.index === i ? { ...item, isOther: false } : item,
      ),
    );
  };

  const handleChangeField = (index: number) => {
    if (emailOrPostal[index].field === 'email') {
      setValue(`guardians.${index}.email`, '');
      setEmailOrPostal(
        emailOrPostal.map((item) =>
          item.index === index ? { ...item, field: 'postal' } : item,
        ),
      );
    } else {
      setValue(`guardians.${index}.address`, '');
      setEmailOrPostal(
        emailOrPostal.map((item) =>
          item.index === index ? { ...item, field: 'email' } : item,
        ),
      );
    }
  };

  return (
    <>
      <h3 className='mb-[18px] text-lg font-semibold'>
        {`Guardian for ${array[index]?.fullName}`}
      </h3>
      <div className='space-y-6'>
        <FormField
          control={methods.control}
          name={`guardians.${index}.fullName`}
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                <div>
                  Guardian’s full legal name
                  <span className='text-danger'>*</span>
                </div>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardians?.[index]?.fullName && 'focus:ring-danger-outline'}`}
                  placeholder='Guardian’s full legal name'
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />

        {emailOrPostal[index].field === 'email' ? (
          <FormField
            control={methods.control}
            name={`guardians.${index}.email`}
            render={({ field }) => (
              <FormItem className='mb-6'>
                <Label className='flex items-center justify-between text-xs'>
                  <div>
                    Guardian’s email address
                    <span className='text-danger'>*</span>
                  </div>
                </Label>
                <FormControl>
                  <Input
                    {...field}
                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardians?.[index]?.email && 'focus:ring-danger-outline'}`}
                    placeholder='Guardian’s email address'
                  />
                </FormControl>
                <FormMessage className='text-xs font-normal' />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={methods.control}
            name={`guardians.${index}.address`}
            render={({ field }) => (
              <FormItem className='mb-6'>
                <Label className='flex items-center justify-between text-xs'>
                  <div>
                    Guardian’s postal address
                    <span className='text-danger'>*</span>
                  </div>
                </Label>
                <FormControl>
                  <Input
                    {...field}
                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardians?.[index]?.address && 'focus:ring-danger-outline'}`}
                    placeholder='Guardian’s poatal address'
                  />
                </FormControl>
                <FormMessage className='text-xs font-normal' />
              </FormItem>
            )}
          />
        )}

        <Button
          type='button'
          onClick={() => handleChangeField(index)}
          className='h-fit w-fit p-0 text-[16px] font-semibold underline'
          variant='link'
        >
          {emailOrPostal[index].field === 'email'
            ? 'Use postal address instead'
            : 'Use email address instead'}
        </Button>

        <FormField
          control={methods.control}
          name={`guardians.${index}.phoneNumber`}
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                <div>
                  Phone number
                  <span className='text-danger'>*</span>
                </div>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardians?.[index]?.phoneNumber && 'focus:ring-danger-outline'}`}
                  placeholder='Phone number'
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name={`guardians.${index}.personType`}
          render={({ field }) => {
            const handleValueChange = (value: string) => {
              if (value === 'Other') {
                setOtherOptions(
                  otherOptions.map((item) =>
                    item.index === index ? { ...item, isOther: true } : item,
                  ),
                );
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
                field.onChange('');
              } else {
                field.onChange(value);
              }
            };

            return (
              <FormItem>
                <Label className='mt-6 block text-xs'>
                  This person is my
                  <span className='text-danger'>*</span>
                </Label>
                <FormControl>
                  {otherOptions[index]?.isOther ? (
                    <div className='relative'>
                      <Input
                        {...field}
                        ref={inputRef}
                        className={`h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.guardians?.[index]?.personType && 'focus:ring-danger-outline'}`}
                        placeholder='This person is my'
                      />
                      <ChevronDown
                        onClick={() => handleIconClick(index)}
                        className='pointer absolute right-[12px] top-[50%] h-4 w-4 translate-y-[-50%] opacity-50'
                      />
                    </div>
                  ) : (
                    <Select
                      defaultOpen={isOpenSelect}
                      onValueChange={handleValueChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.guardians?.[index]?.personType ? 'custom-outline' : undefined}`}
                      >
                        <SelectValue placeholder='This person is my' />
                        <SelectContent>
                          <SelectGroup>
                            {presonTypeOptions.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <p className='text-sm font-semibold'>
          We’ll use this to help whoever deals with your will identify this
          person. We will never contact them without your permission
        </p>

        <FormField
          control={methods.control}
          name={`guardians.${index}.isOver18`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex items-center'>
                  <Checkbox
                    checked={field.value}
                    id={`is-over-18-${index}`}
                    className='border-black data-[state=checked]:border-bright data-[state=checked]:bg-bright'
                    onCheckedChange={(checked) =>
                      setValue(`guardians.${index}.isOver18`, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`is-over-18-${index}`}
                    className='ml-2 text-sm font-normal'
                  >
                    I confirm this guardian is over the age of 18
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export default GuardianFields;
