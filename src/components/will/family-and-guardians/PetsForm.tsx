'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import CrossIcon from '@/assets/icons/cross-icon';
import DeleteFillIcon from '@/assets/icons/delete-fill-icon';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { petsTypeOptions } from '@/constant/will';
import useDisplayOtherPetOption from '@/hooks/use-dispaly-other-pet-option';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { petsSchema } from '@/schemas/will/family';
import willAPI from '@/services/will';
import { FamilyMember, WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { Pet } from '@/store/will/family-and-guardians/types';
import { shouldCallAPI } from '@/utils';

import FormWrapper from '../../FormWrapper';
import InfoPopup from '../../InfoPopup';
import RadioFieldBoolean from '../../power-of-attorney/RadioFieldBoolean';
import { Button } from '../../ui/button';
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
import { Separator } from '../../ui/separator';

type FormData = z.infer<typeof petsSchema>;

function PetsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setSubStep, decreaseSubStep, setWillMainStep } =
    useProgressStepStore();
  const {
    updatePets,
    pets,
    children,
    isPet,
    setIsPet,
    setIsCompletedFamilySection,
  } = useFamilyMembersState();
  const { updateSearchParams } = useWillSearchParams();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();
  const { otherOptions, setOtherOptions } = useDisplayOtherPetOption(pets);

  const defaultObject = {
    pets: pets.map((item) => ({
      ...item,
      petType: item.petType || '',
    })),
    isPet,
  };
  const methods = useForm<FormData>({
    resolver: zodResolver(petsSchema),
    defaultValues: { ...defaultObject },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'pets',
  });

  const {
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const handleIconClick = (i: number) => {
    setIsOpenSelect(true);
    setOtherOptions(
      otherOptions.map((item) =>
        item.index === i ? { ...item, isOther: false } : item,
      ),
    );
  };

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();

    const preparedKids: FamilyMember[] = children.map((child, i) => ({
      ...child,
      guardian: children[i]?.guardian ? [children[i].guardian] : [],
      petType: '',
    }));

    const preparedPets: FamilyMember[] = data.pets.map((pet, i) => ({
      ...pet,
      guardian: pets[i]?.guardian ? [pets[i].guardian] : [],
      birthday: '',
      type: 'pet',
    }));

    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      family: [...preparedKids, ...preparedPets],
      isPet: data.isPet,
      isCompletedFamilySection: !!(!data.pets.length && !data.isPet),
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, bodyForRequest);
      } else {
        await willAPI.createWill(bodyForRequest);
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

    if (!isValid) {
      return;
    }

    setIsNextClicked(true);

    const petsFromForm = getValues('pets');
    const preparedPets: Pet[] = petsFromForm.map((pet, i) => ({
      ...pet,
      guardian: pets[i]?.guardian,
      type: 'pet',
    }));

    const handleStep = () => {
      if (petsFromForm.length) {
        setSubStep(3);
      } else {
        setIsCompletedFamilySection(true);
        setWillMainStep(1);
        setSubStep(0);
        updateSearchParams('estate');
      }
    };

    if (!shouldCallAPI(getValues(), defaultObject)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updatePets(preparedPets);
        setIsPet(getValues('isPet'));
        handleStep();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      handleStep();
    }
  };

  const handleBack = () => {
    if (children.length) {
      decreaseSubStep();
    } else {
      setSubStep(0);
    }
  };

  const removeAllPets = () => {
    const indices = fields.map((_, index) => index);
    remove(indices);
  };

  const onSubmit = async (data: FormData) => {
    if (isNextClicked) return;
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>Do you have pets?</h2>
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
              <div className='mb-8 lg:mb-9'>
                <RadioFieldBoolean
                  methods={methods}
                  name='isPet'
                  handleClickYes={() => append({ fullName: '', petType: '' })}
                  handleClickNo={removeAllPets}
                />
              </div>

              {watch('isPet') && (
                <div className='space-y-6'>
                  <h3 className='h3'>My Pets</h3>

                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={methods.control}
                        name={`pets.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem className='mb-6'>
                            <Label className='flex items-center justify-between text-xs'>
                              What is your pets name?
                              {!index || (
                                <Button
                                  className='h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
                                  variant='ghost'
                                  onClick={() => remove(index)}
                                >
                                  <DeleteFillIcon className='mr-1' />
                                  Delete
                                </Button>
                              )}
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                className={`mt-2 h-12 border-[#8D9395] bg-[#F3F3F3] ${errors.pets?.[index]?.fullName && 'focus:ring-danger-outline'}`}
                                placeholder='My pets name is...'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name={`pets.${index}.petType`}
                        render={({ field }) => {
                          const handleValueChange = (value: string) => {
                            if (value === 'Other') {
                              setOtherOptions(
                                otherOptions.map((item) =>
                                  item.index === index
                                    ? { ...item, isOther: true }
                                    : item,
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
                                What kind of animal?
                              </Label>
                              <FormControl>
                                {otherOptions[index]?.isOther ? (
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      ref={inputRef}
                                      className={`h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.pets?.[index]?.petType && 'focus:ring-danger-outline'}`}
                                      placeholder='Type of animal'
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
                                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.pets?.[index]?.petType ? 'custom-outline' : undefined}`}
                                    >
                                      <SelectValue placeholder='Type of animal' />
                                      <SelectContent>
                                        <SelectGroup>
                                          {petsTypeOptions.map((item) => (
                                            <SelectItem
                                              className={
                                                item === 'Other'
                                                  ? 'text-[16px] font-semibold'
                                                  : undefined
                                              }
                                              key={item}
                                              value={item}
                                            >
                                              <div className='flex items-center'>
                                                {item === 'Other' && (
                                                  <Plus className='mr-1' />
                                                )}
                                                {item}
                                              </div>
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

                      {index !== fields.length - 1 && <Separator />}
                    </Fragment>
                  ))}

                  <Button
                    className='!mt-6 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
                    variant='ghost'
                    onClick={() => append({ fullName: '', petType: '' })}
                  >
                    <CrossIcon className='mr-1 h-[22px] w-[22px]' />
                    Add a pet
                  </Button>
                </div>
              )}
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PetsForm;
