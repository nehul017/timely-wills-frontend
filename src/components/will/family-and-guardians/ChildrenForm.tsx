'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import CrossIcon from '@/assets/icons/cross-icon';
import DeleteFillIcon from '@/assets/icons/delete-fill-icon';
import FormWrapper from '@/components/FormWrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { familySchema } from '@/schemas/will/family';
import willAPI from '@/services/will';
import { FamilyMember, WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { Child } from '@/store/will/family-and-guardians/types';
import { useWillInfoState } from '@/store/will/will-info';
import { formatDate, shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../../power-of-attorney/RadioFieldBoolean';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import WillTopHeading from '../WillTopHeading';

type FormData = z.infer<typeof familySchema>;

function ChildrenForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { increaseSubStep, setSubStep } = useProgressStepStore();
  const { updateChildren, children, pets, isChildren, setIsChildren } =
    useFamilyMembersState();
  const { willRequestBody } = useWillRequestBody();
  const { setWillId } = useWillInfoState();

  const router = useRouter();

  const defaultObject = {
    children: children.map((item) => ({
      ...item,
      birthday: item.birthday || '',
    })),
    isChildren,
  };
  const methods = useForm<FormData>({
    resolver: zodResolver(familySchema),
    defaultValues: { ...defaultObject },
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'children',
  });

  const {
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setValue('isChildren', isChildren);
    setValue(
      'children',
      children.map((item) => ({
        ...item,
        birthday: item.birthday || '',
      })),
    );
  }, [isChildren, children]);

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const preparedKids: FamilyMember[] = data.children.map((child, i) => ({
      ...child,
      guardian: children[i]?.guardian ? [children[i].guardian] : [],
      type: 'child',
      petType: '',
    }));

    const preparedPets: FamilyMember[] = pets.map((pet, i) => ({
      ...pet,
      guardian: pets[i]?.guardian ? [pets[i].guardian] : [],
      birthday: '',
    }));

    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      family: [...preparedKids, ...preparedPets],
      isChildren: data.isChildren,
    };

    let res = await willAPI.getWill();

    try {
      if (res) {
        await willAPI.updateWill(res.id, bodyForRequest);
      } else {
        res = await willAPI.createWill(bodyForRequest);
      }

      setWillId(res.id);

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

    const childrenFromForm = getValues('children');
    const preparedKids: Child[] = childrenFromForm.map((child, i) => ({
      ...child,
      guardian: children[i]?.guardian,
      type: 'child',
    }));

    const goToNextSection = () => {
      if (childrenFromForm.length) {
        increaseSubStep();
      } else {
        setSubStep(2);
      }
    };

    if (!shouldCallAPI(getValues(), defaultObject)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        goToNextSection();
        setIsChildren(getValues('isChildren'));
        updateChildren(preparedKids);
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      goToNextSection();
    }
  };

  const handleBack = () => {
    router.back();
  };

  const removeAllChildren = () => {
    const indices = fields.map((_, index) => index);
    remove(indices);
  };

  const onSubmit = async (data: FormData) => {
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
      <WillTopHeading
        heading='Family & Guardians'
        description='Make plans for your family, pets, and guardians if you have children under 18.'
      />

      <div className='mt-8 w-full lg:mt-9 lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isNextLoading={isNextLoading}
              isLoading={isLoading}
              typeNextBtn='button'
            >
              <div className='mb-8 lg:mb-9'>
                <h2 className='h3 mb-2'>Do you have children under age 18?</h2>
                <p className='mb-6 text-sm'>
                  If you have any children under 18 years old you can nominate
                  guardians to look after them in this section. They must be
                  legally your children (step children typically are not legally
                  yours, unless you’ve gone through the adoption process).
                </p>

                <RadioFieldBoolean
                  methods={methods}
                  name='isChildren'
                  handleClickYes={() => append({ fullName: '', birthday: '' })}
                  handleClickNo={removeAllChildren}
                />
              </div>

              {watch('isChildren') && (
                <div className='space-y-6'>
                  <h3 className='h3'>My Children</h3>

                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={methods.control}
                        name={`children.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem className='mb-6'>
                            <Label className='flex items-center justify-between text-xs'>
                              <div>
                                Child’s legal full name
                                <span className='text-danger'>*</span>
                              </div>

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
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.children?.[index]?.fullName && 'focus:ring-danger-outline'}`}
                                placeholder='Child’s legal full name'
                              />
                            </FormControl>
                            <FormMessage className='text-xs font-normal' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name={`children.${index}.birthday`}
                        render={({ field }) => (
                          <FormItem>
                            <Label className='text-xs'>
                              Child’s date of birth
                              <span className='text-danger'>*</span>
                            </Label>
                            <FormControl>
                              <Input
                                {...field}
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.children?.[index]?.birthday && 'focus:ring-danger-outline'}`}
                                placeholder='mm/dd/yyyy'
                                onChange={(e) => {
                                  const formattedValue = formatDate(
                                    e.target.value,
                                  );
                                  field.onChange(formattedValue);
                                  trigger(`children.${index}.birthday`);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage className='text-xs font-normal' />
                          </FormItem>
                        )}
                      />

                      {index !== fields.length - 1 && <Separator />}
                    </Fragment>
                  ))}

                  <p className='!mt-2 text-xs'>
                    If your children has a disability or will need a guardian
                    after they turn 18, we recommend you seek specialist advice.
                  </p>

                  <Button
                    className='!mt-6 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
                    variant='ghost'
                    onClick={() => append({ fullName: '', birthday: '' })}
                  >
                    <CrossIcon className='mr-1 h-[22px] w-[22px]' />
                    Add a children
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

export default ChildrenForm;
