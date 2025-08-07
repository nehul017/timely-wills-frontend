import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { charitySchema } from '@/schemas/will/estate';
import estateAPI from '@/services/estate';
import willAPI from '@/services/will';
import { useEstateState } from '@/store/will/estate';
import { useWillInfoState } from '@/store/will/will-info';
import { formatPhoneNumber } from '@/utils';

type FormData = z.infer<typeof charitySchema>;
type Props = {
  isDeleteButton?: boolean;
  setIsOpenForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
};

function CharityForm({
  setIsOpenForm,
  isDeleteButton,
  setErrorMessage,
}: Props) {
  const {
    addBeneficiaries,
    updateBeneficiaries,
    beneficiary,
    deleteBeneficiary,
  } = useEstateState();
  const { willId, setEntireWillInfo } = useWillInfoState();

  const [isLoading, setIsLoading] = useState(false);
  const [secondIsLoading, setSecondIsLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(charitySchema),
    defaultValues: {
      phoneNumber: isDeleteButton ? beneficiary?.phoneNumber : '',
      fullName: isDeleteButton ? beneficiary?.fullName : '',
      websiteLink: isDeleteButton ? beneficiary?.websiteLink : '',
    },
  });

  const {
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const res = await willAPI.getWill();
    let id = res.id;

    if (!res) {
      try {
        const result = await willAPI.createWill({});
        id = result.id;
        setEntireWillInfo(result.id, result.url);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }

    const body = {
      ...data,
      email: null,
      backupType: null,
      isBackup: false,
      percent: beneficiary?.percent || 0,
      will: willId || id,
      type: 'charity',
    };

    try {
      if (isDeleteButton) {
        const res = await estateAPI.update(beneficiary?.id as number, body);
        updateBeneficiaries({ ...res });
      } else {
        const res = await estateAPI.create(body);
        addBeneficiaries({ ...res });
      }

      setErrorMessage?.('');
      setIsOpenForm?.(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (beneficiary?.id) {
      setSecondIsLoading(true);

      try {
        await estateAPI.delete(beneficiary.id as number);
        deleteBeneficiary(beneficiary.id);
      } catch (error) {
        console.error(error);
      } finally {
        setSecondIsLoading(false);
      }
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                Charity Phone number (optional)
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.phoneNumber && 'focus:ring-danger-outline'}`}
                  placeholder='Charity Phone number'
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name='websiteLink'
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                Charity website link (optional)
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.websiteLink && 'focus:ring-danger-outline'}`}
                  placeholder='Charity website link'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={`flex ${isDeleteButton ? 'justify-between' : 'justify-end'} mt-6 space-x-2 lg:mt-8`}
        >
          {isDeleteButton && (
            <Button
              type='button'
              isLoading={secondIsLoading}
              onClick={onDelete}
              variant='outline'
              className='h-[52px] w-full border-bright text-lg font-semibold text-bright hover:text-bright lg:w-[107px]'
            >
              Delete
            </Button>
          )}

          <Button
            type='submit'
            isLoading={isLoading}
            className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
          >
            {isDeleteButton ? 'Save' : 'Add charity'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CharityForm;
