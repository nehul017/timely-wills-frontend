import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import SaveIcon from '@/assets/icons/save-icon';
import FormWrapper from '@/components/FormWrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import { presonTypeOptions } from '@/constant/will';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { backupsSchema } from '@/schemas/will/estate';
import estateAPI from '@/services/estate';
import willAPI from '@/services/will';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { Backup, Beneficiary } from '@/store/will/estate/types';
import { useWillInfoState } from '@/store/will/will-info';
import { EmailPostal } from '@/types';
import { formatPhoneNumber } from '@/utils';

import BeneficiaryItem from './BeneficiaryItem';
import DialogForm from './DialogForm';
import SelectTextInput from '../SelectTextInput';
import WillTopHeading from '../WillTopHeading';

type FormData = z.infer<typeof backupsSchema>;
type SelectedType = 'person' | 'charity';
interface TemperoryBeneficiary {
  address?: string;
  phoneNumber?: string;
  fullName?: string;
  backupType?: string;
  email?: string;
  personType?: string;
  websiteLink?: string;
}

function Backups() {
  const [index, setIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedId, setSelectedId] = useState<number | string>('');
  const [isOpenPersonForm, setIsOpenPersonForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecondLoading, setIsSecondLoading] = useState(false);
  const [isThirdLoading, setIsThirdLoading] = useState(false);
  const [isOpenUpdatePersonForm, setIsOpenUpdatePersonForm] = useState(false);
  const [selectedType, setSelectedType] = useState<SelectedType>('charity');
  const [isOpenChariryForm, setIsOpenChariryForm] = useState(false);
  const [temperoryBeneficiary, setTemperoryBeneficiary] =
    useState<TemperoryBeneficiary>();

  const { updateBeneficiaries, beneficiaries, setIsCompletedEstateSection } =
    useEstateState();
  const {
    increaseSubStep,
    decreaseSubStep,
    setSubStep,
    increaseWillMainStep,
    setWillMainStep,
  } = useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const { willId } = useWillInfoState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const beneficiariesPeople = useMemo(
    () => beneficiaries.filter((person) => person.type === 'person'),
    [beneficiaries],
  );
  const isAllCharity = beneficiaries.every((item) => item.type === 'charity');

  const methods = useForm<FormData>({
    resolver: zodResolver(backupsSchema),
    defaultValues: {
      backups: {
        backupType: beneficiariesPeople[index]?.backupType || '',
        address: beneficiariesPeople[index]?.address || '',
        phoneNumber: beneficiariesPeople[index]?.phoneNumber || '',
        email: beneficiariesPeople[index]?.email || '',
        fullName: beneficiariesPeople[index]?.fullName || '',
        personType: beneficiariesPeople[index]?.personType || '',
        websiteLink: beneficiariesPeople[index]?.websiteLink || '',
      },
    },
  });

  const {
    trigger,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [emailOrPostal, setEmailOrPostal] = useState<EmailPostal>(
    getValues('backups.email') ? 'email' : 'postal',
  );
  const isEmail = emailOrPostal === 'email';

  useEffect(() => {
    reset({
      backups: {
        ...watch('backups'),
        backupType: beneficiariesPeople[index]?.backupType || '',
      },
    });
  }, [beneficiaries, beneficiariesPeople, watch, index, reset]);

  useEffect(() => {
    if (isAllCharity) {
      setWillMainStep(2);
      setSubStep(0);
      updateSearchParams('gifts');
    }
  }, [isAllCharity]);

  const resetBackup = () => {
    setValue(`backups`, {
      address: '',
      phoneNumber: '',
      email: '',
      fullName: '',
      personType: '',
      websiteLink: '',
      backupType: '',
    });
  };

  const handleChangeField = () => {
    const backup = getValues('backups');

    if (emailOrPostal === 'email') {
      setValue('backups', { ...backup, email: '' });
      setEmailOrPostal('postal');
    } else {
      setValue('backups', { ...backup, address: '' });
      setEmailOrPostal('email');
    }
  };

  const addBackup = async (type: 'person' | 'charity') => {
    const isValidPerson = await trigger(`backups`);
    const isValidChariry = await Promise.all([
      await trigger(`backups.fullName`),
      await trigger(`backups.phoneNumber`),
      await trigger(`backups.websiteLink`),
    ]);

    if (!isValidPerson && type === 'person') {
      return;
    }

    if (!isValidChariry.every((el) => el) && type === 'charity') {
      return;
    }

    const backupQuantity =
      beneficiariesPeople[index].backupBeneficiaries.length + 1;
    const backupFromForm = getValues(`backups`);
    const backup: Backup = {
      address: backupFromForm.address || '',
      backupType: null,
      phoneNumber: backupFromForm.phoneNumber || '',
      email: backupFromForm.email || '',
      fullName: backupFromForm.fullName || '',
      personType: backupFromForm.personType || '',
      websiteLink: backupFromForm.websiteLink || '',
      id: 0,
      type,
      percent: 100 / backupQuantity,
      isBackup: true,
    };

    try {
      setIsSecondLoading(true);

      const res = await estateAPI.create({
        ...backup,
        email: backup.email || null,
        will: willId,
      });

      const ids = [
        ...beneficiariesPeople[index].backupBeneficiaries.map(
          (item) => item.id,
        ),
      ];

      await estateAPI.update(beneficiariesPeople[index].id as number, {
        will: willId,
        backupBeneficiaries: [...ids, res.id],
      });

      await Promise.all(
        ids.map((id) =>
          estateAPI.update(id, {
            percent: 100 / backupQuantity,
            will: willId,
          }),
        ),
      );

      const newBeneficiary: Beneficiary = {
        ...beneficiariesPeople[index],
        backupType: backupFromForm.backupType,
        backupBeneficiaries: [
          ...beneficiariesPeople[index].backupBeneficiaries.map((item) => ({
            ...item,
            percent: 100 / backupQuantity,
          })),
          { ...backup, id: res.id },
        ],
      };

      if (errorMessage) {
        setErrorMessage('');
      }

      updateBeneficiaries(newBeneficiary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSecondLoading(false);
    }

    if (type === 'charity') {
      setIsOpenChariryForm(false);
    } else {
      setIsOpenPersonForm(false);
    }
  };

  const updateBackup = async () => {
    const isValidPerson = await trigger(`backups`);
    const isValidChariry = await Promise.all([
      await trigger(`backups.fullName`),
      await trigger(`backups.phoneNumber`),
      await trigger(`backups.websiteLink`),
    ]);

    if (!isValidPerson && selectedType === 'person') {
      return;
    }

    if (!isValidChariry.every((el) => el) && selectedType === 'charity') {
      return;
    }

    const {
      email,
      address,
      backupType,
      personType,
      phoneNumber,
      fullName,
      websiteLink,
    } = getValues(`backups`);

    const newBeneficiary: Beneficiary = {
      ...beneficiariesPeople[index],
      backupType,
      backupBeneficiaries: [
        ...beneficiariesPeople[index].backupBeneficiaries.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                websiteLink: websiteLink || '',
                phoneNumber: phoneNumber || '',
                fullName: fullName || '',
                personType: personType || '',
                email: email || '',
                address: address || '',
                backupType: null,
              }
            : { ...item, backupType: null },
        ),
      ],
    };

    try {
      setIsSecondLoading(true);

      await estateAPI.update(selectedId as number, {
        email: email || null,
        address,
        backupType: null,
        personType,
        phoneNumber,
        fullName,
        websiteLink,
      });

      updateBeneficiaries(newBeneficiary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSecondLoading(false);
    }

    setIsOpenUpdatePersonForm(false);
  };

  const deleteBackup = async () => {
    try {
      setIsThirdLoading(true);

      await estateAPI.delete(selectedId as number);

      const backupQuantity =
        beneficiariesPeople[index].backupBeneficiaries.length - 1;
      const ids = [
        ...beneficiariesPeople[index].backupBeneficiaries
          .map((item) => item.id)
          .filter((id) => id !== selectedId),
      ];

      await Promise.all(
        ids.map((id) =>
          estateAPI.update(id, {
            percent: 100 / backupQuantity,
            will: willId,
          }),
        ),
      );

      const newBeneficiary: Beneficiary = {
        ...beneficiariesPeople[index],
        backupBeneficiaries: beneficiariesPeople[index].backupBeneficiaries
          .filter((item) => item.id !== selectedId)
          .map((item) => ({ ...item, percent: 100 / backupQuantity })),
      };

      updateBeneficiaries(newBeneficiary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThirdLoading(false);
    }

    setIsOpenUpdatePersonForm(false);
  };

  const setValueToUpdate = (id: string | number) => {
    setSelectedId(id);

    const backup = beneficiariesPeople[index].backupBeneficiaries.find(
      (item) => item.id === id,
    ) as Beneficiary;

    setValue(`backups.address`, backup.address);
    setValue(`backups.email`, backup.email);
    setValue(`backups.fullName`, backup.fullName);
    setValue(`backups.personType`, backup.personType);
    setValue(`backups.phoneNumber`, backup.phoneNumber);
    setValue(`backups.websiteLink`, backup.websiteLink);
    setEmailOrPostal(backup.email ? 'email' : 'postal');
  };

  const handleNext = useCallback(async () => {
    setValue('backups.personType', beneficiariesPeople[index].personType);
    setValue('backups.address', beneficiariesPeople[index].address);

    const isValid = await trigger();
    const backuptype = getValues('backups.backupType');
    const currentBeneficiar = beneficiariesPeople[index];

    if (!(!!isValid && !!currentBeneficiar.backupBeneficiaries.length)) {
      if (backuptype === 'backupBeneficiary' || !backuptype) {
        setErrorMessage(
          'Must add at least 1 backup beneficiary, or choose another option.',
        );
        return;
      }
    }

    if (index < beneficiariesPeople.length - 1) {
      setIndex(index + 1);
    } else {
      increaseWillMainStep();
      setSubStep(0);
      updateSearchParams('gifts');
    }

    if (
      backuptype !== currentBeneficiar.backupType &&
      currentBeneficiar.backupBeneficiaries.length
    ) {
      const ids = currentBeneficiar.backupBeneficiaries.map((item) => item.id);

      try {
        await Promise.all(ids.map((id) => estateAPI.delete(id)));
      } catch (error) {
        console.error(error);
      }
    }

    try {
      const res = await estateAPI.update(currentBeneficiar.id as number, {
        will: willId,
        backupType: backuptype,
      });

      const beneficiary: Beneficiary = {
        ...currentBeneficiar,
        backupType: res.backupType,
      };

      updateBeneficiaries(beneficiary);
      reset();
      setIsCompletedEstateSection(true);
    } catch (error) {
      console.error(error);
    }
  }, [
    beneficiariesPeople,
    getValues,
    increaseSubStep,
    index,
    reset,
    trigger,
    updateBeneficiaries,
  ]);

  const handleBack = useCallback(() => {
    if (index === 0) {
      decreaseSubStep();
    } else {
      setIndex(index - 1);
    }

    setErrorMessage('');
  }, [index]);

  const onSubmit = async () => {
    const backuptype = getValues('backups.backupType');
    const currentBeneficiar = beneficiariesPeople[index];

    if (
      beneficiariesPeople[index].backupBeneficiaries.length ||
      (backuptype && backuptype !== 'backupBeneficiary')
    ) {
      setIsLoading(true);
      try {
        const res = await estateAPI.update(
          beneficiariesPeople[index].id as number,
          {
            will: willId,
            backupType: getValues('backups.backupType'),
          },
        );

        await willAPI.updateWill(willId, {
          ...willRequestBody,
          isCompletedEstateSection: true,
        });

        const beneficiary: Beneficiary = {
          ...beneficiariesPeople[index],
          backupType: res.backupType,
        };

        updateBeneficiaries(beneficiary);
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    } else {
      setErrorMessage(
        'Must add at least 1 backup beneficiary, or choose another option.',
      );
    }

    if (
      backuptype !== currentBeneficiar.backupType &&
      currentBeneficiar.backupBeneficiaries.length
    ) {
      const ids = currentBeneficiar.backupBeneficiaries.map((item) => item.id);

      try {
        await Promise.all(ids.map((id) => estateAPI.delete(id)));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='w-full'>
      <WillTopHeading
        heading={`Select backups for ${beneficiariesPeople[index]?.fullName}`}
        description='If a beneficiary predeceases you or is otherwise unable to receive an allocation from your estate, it’s recommended to appoint one or more backup beneficiaries.'
      />

      <div className='mt-6 w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={async () => handleNext()}
              typeNextBtn='button'
              isHiddenSubmitButton
            >
              <div className='mb-8 lg:mb-9'>
                <FormField
                  control={methods.control}
                  name='backups.backupType'
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
                              htmlFor={`kids-${1}`}
                              className={`relationship min-h-[64px] text-[16px] font-semibold ${field.value === 'children' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                            >
                              Go directly to their children
                              <RadioGroupItem
                                value='children'
                                id={`kids-${1}`}
                              />
                            </Label>
                          </div>

                          {beneficiariesPeople.length > 1 && (
                            <div className='flex items-center space-x-2'>
                              <Label
                                htmlFor={`splitWithOtherBeneficiaries-${1}`}
                                className={`relationship min-h-[64px] text-[16px] font-semibold ${field.value === 'splitWithOtherBeneficiaries' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                              >
                                Divide among my surviving beneficiaries
                                <RadioGroupItem
                                  value='splitWithOtherBeneficiaries'
                                  id={`splitWithOtherBeneficiaries-${1}`}
                                />
                              </Label>
                            </div>
                          )}

                          <div className='flex items-center space-x-2'>
                            <Label
                              htmlFor={`new-beneficiariesPeople-${1}`}
                              className={`relationship min-h-[64px] text-[16px] font-semibold ${field.value === 'backupBeneficiary' ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                            >
                              Select new beneficiaries (backup)
                              <RadioGroupItem
                                value='backupBeneficiary'
                                id={`new-beneficiariesPeople-${1}`}
                              />
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watch(`backups.backupType`) === 'backupBeneficiary' && (
                  <div className='lg:max-w-[690px]'>
                    <div className='mt-8 lg:mt-9'>
                      <h2 className='h3 mb-2'>{`Select backups for ${beneficiariesPeople[index]?.fullName}`}</h2>
                      <p className='text-sm'>
                        If you nominate multiple backup beneficiaries, then they
                        will receive the primary beneficiary’s share of your
                        estate in equal proportions (it will be distributed
                        equally).
                      </p>
                    </div>

                    {!beneficiariesPeople[index].backupBeneficiaries
                      ?.length || (
                      <div className='mt-6 rounded-lg border border-[#8D9395]'>
                        <div className='flex h-fit flex-col rounded-t-lg bg-[#DBFFE5B2] p-5 lg:h-[99px] lg:flex-row lg:items-center lg:justify-between'>
                          <div>
                            <span className='h3 mb-2 text-bright'>{`${Math.round(100)}%`}</span>
                            <h3 className='text-sm'>
                              The total for all beneficiariesPeople should add
                              up to 100%.
                            </h3>
                          </div>
                        </div>

                        <ul className='p-5'>
                          {beneficiariesPeople[index].backupBeneficiaries.map(
                            (item, i) => (
                              <Fragment key={item.id}>
                                <BeneficiaryItem
                                  beneficiary={{
                                    ...item,
                                    backupBeneficiaries: [],
                                  }}
                                >
                                  <Dialog
                                    onOpenChange={setIsOpenUpdatePersonForm}
                                    open={isOpenUpdatePersonForm}
                                  >
                                    <DialogTrigger
                                      onClick={() => {
                                        setValueToUpdate(item.id);
                                        setSelectedType(item.type);
                                      }}
                                      className='h-fit w-fit p-0'
                                    >
                                      <PencillFillIcon />
                                    </DialogTrigger>
                                    {beneficiariesPeople[index]
                                      .backupBeneficiaries.length -
                                      1 ===
                                      i && <DialogOverlay />}
                                    <DialogContent>
                                      <DialogTitle>Update</DialogTitle>
                                      <DialogDescription className='sr-only'>
                                        Update yoour backup
                                      </DialogDescription>

                                      <FormField
                                        control={methods.control}
                                        name='backups.fullName'
                                        render={({ field }) => (
                                          <FormItem className='mb-6'>
                                            <Label className='flex items-center justify-between text-xs'>
                                              <div>
                                                Full legal name
                                                <span className='text-danger'>
                                                  *
                                                </span>
                                              </div>
                                            </Label>
                                            <FormControl>
                                              <Input
                                                {...field}
                                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.backups?.fullName && 'focus:ring-danger-outline'}`}
                                                placeholder='Full legal name'
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      {selectedType === 'person' ? (
                                        <>
                                          <SelectTextInput
                                            label='This person is my'
                                            methods={methods}
                                            name='backups.personType'
                                            options={presonTypeOptions}
                                          />

                                          <FormField
                                            control={methods.control}
                                            name={
                                              isEmail
                                                ? 'backups.email'
                                                : 'backups.address'
                                            }
                                            render={({ field }) => (
                                              <FormItem className='mb-6'>
                                                <Label className='flex items-center justify-between text-xs'>
                                                  <div>
                                                    {isEmail
                                                      ? 'Email address'
                                                      : 'Postal address'}
                                                    <span className='text-danger'>
                                                      *
                                                    </span>
                                                  </div>
                                                </Label>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${(isEmail ? errors?.backups?.email : errors?.backups?.address) && 'focus:ring-danger-outline'}`}
                                                    placeholder={
                                                      isEmail
                                                        ? 'Email address'
                                                        : 'Postal address'
                                                    }
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <FormField
                                            control={methods.control}
                                            name='backups.phoneNumber'
                                            render={({ field }) => (
                                              <FormItem className='mb-6'>
                                                <Label className='flex items-center justify-between text-xs'>
                                                  Charity Phone number
                                                  (optional)
                                                </Label>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${
                                                      errors?.backups
                                                        ?.phoneNumber &&
                                                      'focus:ring-danger-outline'
                                                    }`}
                                                    onChange={(e) => {
                                                      const formattedValue =
                                                        formatPhoneNumber(
                                                          e.target.value,
                                                        );
                                                      field.onChange(
                                                        formattedValue,
                                                      );
                                                    }}
                                                    placeholder='Charity Phone number'
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={methods.control}
                                            name='backups.websiteLink'
                                            render={({ field }) => (
                                              <FormItem className='mb-6'>
                                                <Label className='flex items-center justify-between text-xs'>
                                                  Charity website link
                                                  (optional)
                                                </Label>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.backups?.websiteLink && 'focus:ring-danger-outline'}`}
                                                    placeholder='Charity website link'
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </>
                                      )}

                                      {selectedType === 'person' && (
                                        <Button
                                          type='button'
                                          onClick={() => handleChangeField()}
                                          className='h-fit w-fit p-0 text-[16px] font-semibold underline'
                                          variant='link'
                                        >
                                          {isEmail
                                            ? 'Use postal address instead'
                                            : 'Use email address instead'}
                                        </Button>
                                      )}

                                      <div className='mt-6 flex justify-between space-x-2 lg:mt-8'>
                                        <Button
                                          type='button'
                                          onClick={() => deleteBackup()}
                                          isLoading={isThirdLoading}
                                          variant='outline'
                                          className='h-[52px] w-full border-bright text-lg font-semibold text-bright hover:text-bright lg:w-[107px]'
                                        >
                                          Delete
                                        </Button>

                                        <Button
                                          isLoading={isSecondLoading}
                                          onClick={() => updateBackup()}
                                          className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </BeneficiaryItem>

                                {i !==
                                  beneficiariesPeople[index].backupBeneficiaries
                                    .length -
                                    1 && (
                                  <Separator className='mb-[18px] mt-5' />
                                )}
                              </Fragment>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    <DialogForm
                      title='Add a person'
                      isOpen={isOpenPersonForm}
                      openDialog={() => {
                        if (!isOpenPersonForm) {
                          const personType = getValues('backups.personType');
                          setTemperoryBeneficiary({
                            ...getValues('backups'),
                            personType,
                          });
                          resetBackup();
                        } else {
                          reset({ backups: { ...temperoryBeneficiary } });
                        }

                        setIsOpenPersonForm((prev) => !prev);
                      }}
                    >
                      <FormField
                        control={methods.control}
                        name='backups.fullName'
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
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.backups?.fullName && 'focus:ring-danger-outline'}`}
                                placeholder='Child’s legal full name'
                              />
                            </FormControl>
                            <FormMessage className='text-xs font-normal' />
                          </FormItem>
                        )}
                      />

                      <SelectTextInput
                        label='This person is my'
                        methods={methods}
                        name='backups.personType'
                        options={presonTypeOptions}
                      />

                      <FormField
                        control={methods.control}
                        name={isEmail ? 'backups.email' : 'backups.address'}
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
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${(isEmail ? errors?.backups?.email : errors?.backups?.address) && 'focus:ring-danger-outline'}`}
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
                        {isEmail
                          ? 'Use postal address instead'
                          : 'Use email address instead'}
                      </Button>

                      <div className='mt-6 flex justify-end space-x-2 lg:mt-8'>
                        <Button
                          type='button'
                          isLoading={isSecondLoading}
                          onClick={() => addBackup('person')}
                          className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
                        >
                          Add beneficiary
                        </Button>
                      </div>
                    </DialogForm>

                    <DialogForm
                      title='Add a charity'
                      isOpen={isOpenChariryForm}
                      openDialog={() => {
                        if (!isOpenChariryForm) {
                          const personType = getValues('backups.personType');

                          setTemperoryBeneficiary({
                            ...getValues('backups'),
                            personType,
                          });
                          resetBackup();
                        } else {
                          reset({ backups: { ...temperoryBeneficiary } });
                        }

                        setIsOpenChariryForm((prev) => !prev);
                      }}
                    >
                      <FormField
                        control={methods.control}
                        name='backups.fullName'
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
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.backups?.fullName && 'focus:ring-danger-outline'}`}
                                placeholder='Full legal name'
                              />
                            </FormControl>
                            <FormMessage className='text-xs font-normal' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name='backups.phoneNumber'
                        render={({ field }) => (
                          <FormItem className='mb-6'>
                            <Label className='flex items-center justify-between text-xs'>
                              Charity Phone number (optional)
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${
                                  errors?.backups?.phoneNumber &&
                                  'focus:ring-danger-outline'
                                }`}
                                onChange={(e) => {
                                  const formattedValue = formatPhoneNumber(
                                    e.target.value,
                                  );
                                  field.onChange(formattedValue);
                                  trigger('backups.phoneNumber');
                                }}
                                placeholder='Charity Phone number'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name='backups.websiteLink'
                        render={({ field }) => (
                          <FormItem className='mb-6'>
                            <Label className='flex items-center justify-between text-xs'>
                              Charity website link (optional)
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors?.backups?.websiteLink && 'focus:ring-danger-outline'}`}
                                placeholder='Charity website link'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='mt-6 flex justify-end space-x-2 lg:mt-8'>
                        <Button
                          type='button'
                          isLoading={isSecondLoading}
                          className='ml-full h-[52px] w-full bg-bright text-lg font-semibold lg:w-[206px]'
                          onClick={() => addBackup('charity')}
                        >
                          Add charity
                        </Button>
                      </div>
                    </DialogForm>

                    {errorMessage && (
                      <p className='mt-2 text-xs text-danger'>{errorMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </FormWrapper>

            <Button
              className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
              type='button'
              variant='outline'
              onClick={onSubmit}
              isLoading={isLoading}
            >
              <SaveIcon className='mr-1' /> Save and exit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default memo(Backups);
