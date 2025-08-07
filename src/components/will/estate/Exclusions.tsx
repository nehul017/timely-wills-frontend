'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import CrossIcon from '@/assets/icons/cross-icon';
import DeleteFillIcon from '@/assets/icons/delete-fill-icon';
import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
import RadioFieldBoolean from '@/components/power-of-attorney/RadioFieldBoolean';
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
import { Separator } from '@/components/ui/separator';
import Textarea from '@/components/ui/textarea';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { exlusionsSchema } from '@/schemas/will/estate';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';

type FormData = z.infer<typeof exlusionsSchema>;

function Exclusions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const { exclusions, isExclusions, updateExclusions, beneficiaries } =
    useEstateState();
  const { decreaseSubStep, setSubStep } = useProgressStepStore();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: zodResolver(exlusionsSchema),
    defaultValues: {
      exclusions,
      isExclusions,
    },
  });

  const {
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'exclusions',
  });

  const removeAllExclusions = () => {
    const indices = fields.map((_, index) => index);
    remove(indices);
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    setIsNextClicked(true);

    const { exclusions, isExclusions } = getValues();

    updateExclusions(exclusions, isExclusions);
    router.push('/will/gifts');
  };

  const handleBack = () => {
    const isAllCharity = beneficiaries.every((item) => item.type === 'charity');

    if (isAllCharity) {
      setSubStep(0);
    } else {
      decreaseSubStep();
    }
  };

  const onSubmit = async ({ exclusions, isExclusions }: FormData) => {
    if (isNextClicked) return;
    setIsLoading(true);

    const res = await willAPI.getWill();
    const body: WillRequestBody = {
      ...willRequestBody,
      exclusions,
      isExclusions,
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, body);
      } else {
        await willAPI.createWill(body);
      }

      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>
          Would you like to exclude anyone specific out of your will?
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
            >
              <RadioFieldBoolean
                handleClickYes={() =>
                  append({ fullName: '', whyIsExcluded: '' })
                }
                handleClickNo={removeAllExclusions}
                methods={methods}
                name='isExclusions'
              />

              {watch('isExclusions') && (
                <div className='mt-8 space-y-6 lg:mt-9'>
                  <h3 className='h3'>Exclusions</h3>

                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={methods.control}
                        name={`exclusions.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem className='mb-6'>
                            <Label className='flex items-center justify-between text-xs'>
                              <div>
                                Full legal name
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
                                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.exclusions?.[index]?.fullName && 'focus:ring-danger-outline'}`}
                                placeholder='Full legal name'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name={`exclusions.${index}.whyIsExcluded`}
                        render={({ field }) => (
                          <FormItem>
                            <Label className='text-xs'>
                              Would you like to specify why? (optional)
                            </Label>
                            <FormControl>
                              <Textarea
                                className={`mt-2 h-[154px] lg:h-[108px] ${errors.exclusions?.[index]?.whyIsExcluded && 'focus:ring-danger-outline'}`}
                                placeholder='Would you like to specify why?'
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {index !== fields.length - 1 && <Separator />}
                    </Fragment>
                  ))}

                  <Button
                    className='!mt-6 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
                    variant='ghost'
                    onClick={() => append({ fullName: '', whyIsExcluded: '' })}
                  >
                    <CrossIcon className='mr-1 h-[22px] w-[22px]' />
                    Add Exclusion
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

export default Exclusions;
