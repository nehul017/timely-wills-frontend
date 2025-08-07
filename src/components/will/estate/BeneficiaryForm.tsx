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
import { presonTypeOptions } from '@/constant/will';
import { beneficiarySchema } from '@/schemas/will/estate';
import estateAPI from '@/services/estate';
import willAPI from '@/services/will';
import { useEstateState } from '@/store/will/estate';
import { useWillInfoState } from '@/store/will/will-info';
import { EmailPostal } from '@/types';

import SelectTextInput from '../SelectTextInput';

type FormData = z.infer<typeof beneficiarySchema>;
type Props = {
  isDeleteButton?: boolean;
  setIsOpenForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
};

function BeneficiaryForm({
  setIsOpenForm,
  isDeleteButton,
  setErrorMessage,
}: Props) {
  const {
    addBeneficiaries,
    updateBeneficiaries,
    deleteBeneficiary,
    beneficiary,
  } = useEstateState();
  const { willId, setEntireWillInfo } = useWillInfoState();

  const field = beneficiary?.address ? 'postal' : 'email';
  const [emailOrPostal, setEmailOrPostal] = useState<EmailPostal>(field);
  const [isLoading, setIsLoading] = useState(false);
  const [secondIsLoading, setSecondIsLoading] = useState(false);
  const isEmail = emailOrPostal === 'email';

  const methods = useForm<FormData>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      address: isDeleteButton ? beneficiary?.address : '',
      email: isDeleteButton ? beneficiary?.email : '',
      fullName: isDeleteButton ? beneficiary?.fullName : '',
      personType: isDeleteButton ? beneficiary?.personType : '',
    },
  });

  const {
    setValue,
    formState: { errors },
  } = methods;

  const handleChangeField = () => {
    if (emailOrPostal === 'email') {
      setValue(`email`, '');
      setEmailOrPostal('postal');
    } else {
      setValue(`address`, '');
      setEmailOrPostal('email');
    }
  };

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
      email: data.email || null,
      backupType: null,
      isBackup: false,
      percent: beneficiary?.percent || 0,
      will: willId || id,
      type: 'person',
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
    if (beneficiary) {
      setSecondIsLoading(true);

      const ids = beneficiary.backupBeneficiaries.map((item) => item.id);

      try {
        await Promise.all([
          ...ids.map((id) => estateAPI.delete(id)),
          estateAPI.delete(beneficiary.id),
        ]);

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
          {isEmail ? 'Use postal address instead' : 'Use email address instead'}
        </Button>

        <div
          className={`flex ${isDeleteButton ? 'justify-between' : 'justify-end'} mt-6 space-x-2 lg:mt-8`}
        >
          {isDeleteButton && (
            <Button
              isLoading={secondIsLoading}
              type='button'
              onClick={onDelete}
              variant='outline'
              className='h-[52px] w-full border-bright text-lg font-semibold text-bright hover:text-bright lg:w-[107px]'
            >
              Delete
            </Button>
          )}

          <Button
            isLoading={isLoading}
            type='submit'
            className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
          >
            {isDeleteButton ? 'Save' : 'Add beneficiary'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BeneficiaryForm;
