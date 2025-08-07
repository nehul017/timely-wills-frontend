'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import Textarea from '@/components/ui/textarea';
import { presonTypeOptions } from '@/constant/will';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { asignGiftsSchema } from '@/schemas/will/gifts';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { useGiftsState } from '@/store/will/gifts';
import { BeneficiaryForGift } from '@/store/will/gifts/types';
import { EmailPostal } from '@/types';
import { formatAmount, shouldCallAPI } from '@/utils';

import DialogForm from '../estate/DialogForm';
import SelectTextInput from '../SelectTextInput';

type FormData = z.infer<typeof asignGiftsSchema>;

function AsignGiftsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [giftBeneficiary, setGiftBeneficiary] =
    useState<BeneficiaryForGift | null>(null);
  const [emailOrPostal, setEmailOrPostal] = useState<EmailPostal>('email');
  const [isOpenPersonForm, setIsOpenPersonForm] = useState(false);

  const { increaseSubStep, decreaseSubStep } = useProgressStepStore();
  const { beneficiaries } = useEstateState();
  const {
    addBeneficiary,
    setIsCompletedGiftsSection,
    selectedGiftId,
    beneficiaryForGift,
    isGifts,
  } = useGiftsState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const beneficiaryToUpdate = beneficiaryForGift.find(
    (item) => item.giftId === selectedGiftId,
  );
  const beneficiariesPersonType = beneficiaries.filter(
    (item) => item.type === 'person',
  );

  const defaultData = {
    giftType: beneficiaryToUpdate?.giftType || '',
    beneficiaryId: `${beneficiaryToUpdate?.id || ''}`,
    giftDescription: beneficiaryToUpdate?.giftDescription || '',
    message: beneficiaryToUpdate?.message || '',
    money: beneficiaryToUpdate?.money || '',
    beneficiary: {
      address: beneficiaryToUpdate?.address || '',
      email: beneficiaryToUpdate?.email || '',
      fullName: beneficiaryToUpdate?.fullName || '',
      personType: beneficiaryToUpdate?.personType || '',
    },
  };
  const methods = useForm<FormData>({
    resolver: zodResolver(asignGiftsSchema),
    defaultValues: { ...defaultData },
  });

  const {
    trigger,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const isMoney = watch('giftType') === 'money';
  const isEmail = emailOrPostal === 'email';

  const handleChangeField = () => {
    if (emailOrPostal === 'email') {
      setValue('beneficiary.email', '');
      setEmailOrPostal('postal');
    } else {
      setValue('beneficiary.address', '');
      setEmailOrPostal('email');
    }
  };

  const addExistingBeneficiary = (id: string | number) => {
    const beneficiary =
      [...beneficiaries, ...beneficiaryForGift].find(
        (item) => `${item.id}` === `${id}`,
      ) || giftBeneficiary;

    setValue('beneficiary', {
      address: beneficiary?.address || '',
      email: beneficiary?.email || '',
      fullName: beneficiary?.fullName || '',
      personType: beneficiary?.personType || '',
    });
  };

  const setBeneficiary = async () => {
    const { beneficiary, giftType, message, giftDescription, money } =
      getValues();
    const isValid = await trigger('beneficiary');

    if (!isValid) return;

    const id = uuidv4();

    setGiftBeneficiary({
      ...beneficiary,
      id,
      giftId: '',
      giftDescription,
      giftType,
      message: message || '',
      money,
    });
    setValue('beneficiaryId', id);
    setIsOpenPersonForm(false);
  };

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const { beneficiary, giftDescription, giftType, message, money } = data;
    const res = await willAPI.getWill();
    const body: WillRequestBody = {
      ...willRequestBody,
      isGifts,
      isCompletedGiftsSection: true,
      beneficiaryForGift: selectedGiftId
        ? beneficiaryForGift.map((item) =>
            `${item.id}` === data.beneficiaryId
              ? {
                  address: beneficiary.address,
                  email: beneficiary.email || null,
                  fullName: beneficiary.fullName,
                  giftDescription,
                  giftId: item.giftId,
                  giftType,
                  money,
                  message: message || '',
                  personType: beneficiary.personType,
                }
              : item,
          )
        : [
            ...beneficiaryForGift.map(({ id, ...rest }) => rest),
            {
              address: beneficiary.address,
              email: beneficiary.email || null,
              fullName: beneficiary.fullName.trim(),
              giftType,
              message: message || '',
              giftDescription,
              money,
              giftId: uuidv4(),
              personType: beneficiary.personType,
            },
          ],
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, body);
      } else {
        await willAPI.createWill(body);
      }

      if (!isNotRedirect) {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    const {
      beneficiary,
      beneficiaryId,
      giftDescription,
      giftType,
      message,
      money,
    } = getValues();

    const oldBeneficiary =
      beneficiaryForGift.find((item) => item.id === beneficiaryId) ||
      beneficiary;

    if (!shouldCallAPI(getValues(), defaultData)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        setIsCompletedGiftsSection(true);
        addBeneficiary({
          ...oldBeneficiary,
          id: beneficiaryId,
          giftType,
          message: message || '',
          giftDescription,
          money,
          email: oldBeneficiary.email || null,
          giftId: selectedGiftId || uuidv4(),
        });
        increaseSubStep();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseSubStep();
    }
  };

  const handleBack = () => {
    decreaseSubStep();
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>
          Add and assign the gifts that you’d like to leave.
        </h2>
        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
            >
              <div className='mb-6'>
                <FormField
                  control={methods.control}
                  name='giftType'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          className='gap-6'
                          {...field}
                          onValueChange={field.onChange}
                        >
                          <div className='flex items-center'>
                            <Label
                              htmlFor='item'
                              className={`relationship ${field.value === 'gift' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                            >
                              <div className='flex flex-col gap-1 leading-5'>
                                <span className='text-[16px] font-semibold leading-6'>
                                  Asset or personal item
                                </span>
                                <span>
                                  Leave a specific item (ex. a watch, vehicle,
                                  etc.)
                                </span>
                              </div>
                              <RadioGroupItem
                                onClick={() => setValue('money', '')}
                                value='gift'
                                id='item'
                              />
                            </Label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Label
                              htmlFor='money'
                              className={`relationship ${field.value === 'money' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                            >
                              <div className='flex flex-col gap-1 leading-5'>
                                <span className='text-[16px] font-semibold leading-6'>
                                  Money
                                </span>
                                <span>
                                  Leave a set dollar amount (ex. $1000)
                                </span>
                              </div>
                              <RadioGroupItem
                                onClick={() => setValue('giftDescription', '')}
                                value='money'
                                id='money'
                              />
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watch('giftType') && (
                <div className='mb-8 lg:mb-9'>
                  {!isMoney ? (
                    <FormField
                      control={methods.control}
                      name='giftDescription'
                      render={({ field }) => (
                        <FormItem>
                          <Label className='text-xs'>
                            I would like to leave my...
                          </Label>
                          <FormControl>
                            <Textarea
                              className={`${isMoney ? 'h-12' : 'h-[154px] lg:h-[108px]'} ${errors.giftDescription && 'focus:ring-danger-outline'}`}
                              placeholder='(Example) My gold rolex, with the blue strap'
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={methods.control}
                      name='money'
                      render={({ field }) => (
                        <FormItem>
                          <Label className='text-xs'>
                            How much would you like to gift?
                          </Label>
                          <FormControl>
                            <Textarea
                              className={`h-12 ${errors.money && 'focus:ring-danger-outline'}`}
                              placeholder='Ex $1,000'
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatAmount(e.target.value));
                              }}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {!isMoney && (
                    <p className='text-xs'>
                      Be specific when describing the item, so that it’s clear
                      to the Executor and the beneficiary exactly what the gift
                      is.
                    </p>
                  )}
                </div>
              )}

              {watch('giftType') && (
                <>
                  <h3 className='h3 mb-6'>
                    Who would you like to leave the gift for?
                  </h3>

                  <FormField
                    control={methods.control}
                    name='beneficiaryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            className='gap-6'
                            {...field}
                            onValueChange={field.onChange}
                          >
                            {!selectedGiftId &&
                              beneficiariesPersonType.map(
                                ({ fullName, id }) => (
                                  <div
                                    key={id}
                                    className='flex items-center space-x-2'
                                  >
                                    <Label
                                      htmlFor={`${id}`}
                                      className={`relationship min-h-16 ${field.value === `${id}` ? 'bg-[#DBFFE5B2] outline outline-2 outline-[#25D99880]' : undefined}`}
                                    >
                                      {fullName}
                                      <RadioGroupItem
                                        onClick={() => {
                                          addExistingBeneficiary(id);
                                        }}
                                        onChange={() => field.onChange(id)}
                                        value={`${id}`}
                                        id={`${id}`}
                                      />
                                    </Label>
                                  </div>
                                ),
                              )}
                            {!beneficiariesPersonType.find(
                              (item) => item.id === beneficiaryToUpdate?.id,
                            ) &&
                              selectedGiftId && (
                                <div className='flex items-center space-x-2'>
                                  <Label
                                    htmlFor={`${beneficiaryToUpdate?.id}`}
                                    className={`relationship min-h-16 ${field.value === `${beneficiaryToUpdate?.id}` ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                                  >
                                    {beneficiaryToUpdate?.fullName}
                                    <RadioGroupItem
                                      onClick={() => {
                                        addExistingBeneficiary(
                                          beneficiaryToUpdate?.id as
                                            | string
                                            | number,
                                        );
                                      }}
                                      onChange={() => {
                                        field.onChange(beneficiaryToUpdate?.id);
                                      }}
                                      value={`${beneficiaryToUpdate?.id}`}
                                      id={`${beneficiaryToUpdate?.id}`}
                                    />
                                  </Label>
                                </div>
                              )}
                            {giftBeneficiary && (
                              <div className='flex items-center space-x-2'>
                                <Label
                                  htmlFor={`${giftBeneficiary.id}`}
                                  className={`relationship min-h-16 ${field.value === `${giftBeneficiary.id}` ? 'bg-[#DBFFE5B2] outline outline-2 outline-[#25D99880]' : undefined}`}
                                >
                                  {giftBeneficiary.fullName}
                                  <RadioGroupItem
                                    onClick={() => {
                                      addExistingBeneficiary(
                                        giftBeneficiary.id,
                                      );
                                    }}
                                    onChange={() => {
                                      field.onChange(giftBeneficiary.id);
                                    }}
                                    value={`${giftBeneficiary.id}`}
                                    id={`${giftBeneficiary.id}`}
                                  />
                                </Label>
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div
                    className={
                      !beneficiariesPersonType.length && !giftBeneficiary
                        ? 'mt-[-24px]'
                        : ''
                    }
                  >
                    {!selectedGiftId && (
                      <DialogForm
                        title='Add a person'
                        isOpen={isOpenPersonForm}
                        openDialog={setIsOpenPersonForm}
                      >
                        <FormField
                          control={methods.control}
                          name='beneficiary.fullName'
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
                                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.beneficiary?.fullName && 'focus:ring-danger-outline'}`}
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
                          name='beneficiary.personType'
                          options={presonTypeOptions}
                        />

                        <FormField
                          control={methods.control}
                          name={
                            isEmail
                              ? 'beneficiary.email'
                              : 'beneficiary.address'
                          }
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
                                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${(isEmail ? errors?.beneficiary?.email : errors?.beneficiary?.address) && 'focus:ring-danger-outline'}`}
                                  placeholder={
                                    isEmail ? 'Email address' : 'Postal address'
                                  }
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

                        <div className='mt-6 flex justify-end space-x-2 lg:mt-8'>
                          <Button
                            onClick={setBeneficiary}
                            className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
                          >
                            Add beneficiary
                          </Button>
                        </div>
                      </DialogForm>
                    )}
                  </div>

                  <FormField
                    control={methods.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <Label className='mt-6 block text-xs'>
                          {`(Optional) Leave a message to ${getValues('beneficiary.fullName') || ''}`}
                        </Label>
                        <FormControl>
                          <Textarea
                            className={`mt-2 h-[154px] lg:h-[108px] ${errors.message && 'focus:ring-danger-outline'}`}
                            placeholder=''
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AsignGiftsForm;
