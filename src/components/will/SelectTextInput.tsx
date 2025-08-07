'use client';

import { ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
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

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  methods: UseFormReturn<T>;
  options: string[];
};

function SelectTextInput<T extends FieldValues>({
  methods,
  name,
  label,
  options,
}: Props<T>) {
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    formState: { errors },
    getValues,
  } = methods;

  const [isOtherOption, setIsOtherOption] = useState<boolean>(
    getValues(name) ? !options.includes(getValues(name)) : false,
  );

  const handleIconClick = () => {
    setIsOpenSelect(true);
    setIsOtherOption(false);
  };

  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => {
        const handleValueChange = (value: string) => {
          if (value === 'Other') {
            setIsOtherOption(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
            field.onChange('');
          } else {
            field.onChange(value);
          }
        };

        return (
          <FormItem className='mb-6'>
            <Label className='block text-xs'>
              {label}
              <span className='text-danger'>*</span>
            </Label>
            <FormControl>
              {isOtherOption ? (
                <div className='relative'>
                  <Input
                    {...field}
                    ref={inputRef}
                    className={`h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.[name] && 'focus:ring-danger-outline'}`}
                    placeholder={label}
                  />
                  <ChevronDown
                    onClick={handleIconClick}
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
                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors?.[name] ? 'custom-outline' : undefined}`}
                  >
                    <SelectValue placeholder={label} />
                    <SelectContent>
                      <SelectGroup>
                        {options.map((item) => (
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
  );
}

export default SelectTextInput;
