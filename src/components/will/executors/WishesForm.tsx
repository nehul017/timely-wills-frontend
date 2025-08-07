import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FormWrapper from '@/components/FormWrapper';
import RadioFieldBoolean from '@/components/power-of-attorney/RadioFieldBoolean';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { wishesSchema } from '@/schemas/will/executors';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useExecutorsState } from '@/store/will/executor';
import { shouldCallAPI } from '@/utils';

import WillTopHeading from '../WillTopHeading';

type FormData = z.infer<typeof wishesSchema>;

function WishesForm() {
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { decreaseSubStep, increaseWillMainStep } = useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const {
    specialWishes,
    isWishes,
    setWishesData,
    isNotarization,
    isSelfProvingAffidavit,
    setIsCompletedExecutorsSection,
  } = useExecutorsState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const defaultData = {
    isWishes,
    specialWishes: specialWishes || '',
    isNotarization,
    isSelfProvingAffidavit,
  };
  const methods = useForm<FormData>({
    resolver: zodResolver(wishesSchema),
    defaultValues: { ...defaultData },
  });

  const {
    getValues,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();
    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      wishes: data.specialWishes || null,
      isWishes: data.isWishes,
      isNotarization: data.isNotarization,
      isSelfProvingAffidavit: data.isSelfProvingAffidavit,
      isCompletedExecutorsSection: true,
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

    if (!isValid) return;

    setIsNextClicked(true);

    const { isWishes, specialWishes, isNotarization, isSelfProvingAffidavit } =
      getValues();

    if (!shouldCallAPI(getValues(), defaultData)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        setWishesData({
          isWishes,
          specialWishes: specialWishes || '',
          isNotarization,
          isSelfProvingAffidavit,
        });
        increaseWillMainStep();
        setIsCompletedExecutorsSection(true);
        updateSearchParams('review');
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      updateSearchParams('review');
      increaseWillMainStep();
    }
  };

  const handleBack = () => {
    decreaseSubStep();
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
      <WillTopHeading
        heading='Do you have any special wishes?'
        description="Special wishes can be used to express sentiments to loved ones, share personal philosophies or values, or provide any other guidance that reflects your personal wishes and doesn’t fall under the typical categories of a will. It ensures that any unique desires are documented and considered, even if they don't have a direct legal or financial impact."
      />

      <div className='mt-6 w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
            >
              <RadioFieldBoolean
                methods={methods}
                labelYes='Yes, I have special wishes'
                labelNo="No, I don't have special wishes"
                handleClickNo={() => setValue('specialWishes', '')}
                name='isWishes'
              />

              {watch('isWishes') && (
                <FormField
                  control={methods.control}
                  name='specialWishes'
                  render={({ field }) => (
                    <FormItem className='mt-6'>
                      <Label className='text-xs'>My special wishes...</Label>
                      <FormControl>
                        <Textarea
                          className={`h-[108px] ${errors.specialWishes && 'focus:ring-danger-outline'}`}
                          placeholder=''
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className='mt-8 w-full lg:max-w-[690px]'>
                <h2 className='h3 mb-2'>Notarization</h2>

                <p className='mb-6 text-sm'>
                  Notarizing your Last Will and Testament adds an additional
                  layer of legal validation by confirming the authenticity of
                  your signature and the signatures of your witnesses. While
                  notarization is not required in all states, it can provide
                  greater assurance that your will is valid and reduce the
                  chance of legal disputes.
                </p>

                <RadioFieldBoolean
                  methods={methods}
                  labelYes='Yes, I will be notarizing my Will'
                  labelNo='No, I won’t be notarizing my Will'
                  name='isNotarization'
                />
              </div>

              <div className='mt-8 text-sm lg:mt-9'>
                <h2 className='h3 mb-2'>Self Proving Affidavit</h2>
                <p className='mb-6'>
                  A self-proving affidavit is a notarized statement that
                  simplifies the probate process by confirming that your will
                  was properly executed. It allows the court to accept your will
                  without requiring your witnesses to testify after your
                  passing, which can save time and potential complications.
                  Including a self-proving affidavit makes the probate process
                  easier and more efficient for your loved ones.
                </p>

                <p className='mb-6'>
                  <strong>Note:</strong> You can always come back and retrieve
                  the self proving affidavit template at a later time.
                </p>

                <RadioFieldBoolean
                  methods={methods}
                  labelYes='Yes, I would like to add a self proving affidavit '
                  labelNo='No, I would not like to add a self proving affidavit'
                  name='isSelfProvingAffidavit'
                />
              </div>
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default WishesForm;
