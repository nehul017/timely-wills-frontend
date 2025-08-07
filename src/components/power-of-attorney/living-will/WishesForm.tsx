'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { livingWillWishesSchema } from '@/schemas/poa/living-will';
import livingWillAPI from '@/services/living-will';
import { LivingWillBody } from '@/services/living-will/types';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useProgressStepStore } from '@/store/progress-steps';
import { LivingWillWishesForm } from '@/types';
import { shouldCallAPI } from '@/utils';

import RadioFieldBoolean from '../RadioFieldBoolean';

type Props = {
  isCombined?: boolean;
};

function WishesForm({ isCombined }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { wishes, updateWishes, setLivingWillId } = useLivingWillWishesStore();
  const {
    medicalStep,
    decreaseMedicalStep,
    increaseMedicalStep,
    increaseWishesStep,
  } = useProgressStepStore();
  const router = useRouter();
  const methods = useForm<LivingWillWishesForm>({
    resolver: zodResolver(livingWillWishesSchema),
    defaultValues: {
      ...wishes,
    },
  });

  const { getValues, trigger, reset } = methods;

  useEffect(() => {
    reset(wishes);
  }, [reset, wishes]);

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const submitData = async (
    data: LivingWillWishesForm,
    isNotRedirect?: boolean,
  ) => {
    const {
      isAuthorizePainAlleviationTreatment,
      isPermanentArtificialNutritionHydration,
      isPermanentLifeSustainingMeasures,
      isTerminalArtificialNutritionHydration,
      isTerminalLifeSustainingMeasures,
    } = data;
    const body: Partial<LivingWillBody> = {
      doYouConserntToEuthanasia: isAuthorizePainAlleviationTreatment,
      permanentCondition: {
        doYouWantArtificialNutritionAndHydration:
          isPermanentArtificialNutritionHydration as boolean,
        doYouWantLifeSustainingMeasures:
          isPermanentLifeSustainingMeasures as boolean,
      },
      terminalCondition: {
        doYouWantArtificialNutritionAndHydration:
          isTerminalArtificialNutritionHydration as boolean,
        doYouWantLifeSustainingMeasures:
          isTerminalLifeSustainingMeasures as boolean,
      },
    };

    let result = await livingWillAPI.getLivingWill();

    try {
      if (result) {
        await livingWillAPI.updateLivingWill(result.id, body);
      } else {
        result = await livingWillAPI.createLivingWill(body);
      }

      if (!isNotRedirect) {
        router.push('/Power-of-attorney');
      }

      setLivingWillId(result.id);
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const increaseStep = isCombined ? increaseWishesStep : increaseMedicalStep;

    if (!shouldCallAPI(getValues(), { ...wishes })) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updateWishes({
          ...getValues(),
        });
        increaseStep();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseStep();
    }
  };

  const onSubmit = async (data: LivingWillWishesForm) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full lg:max-w-[690px]'>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h2 mb-2'>What are your wishes?</h2>
            <p className='mb-6 text-sm'>
              Here you can specify your end-of-life care preferences in the
              following situations: (1) you have a terminal condition expected
              to result in death within a short period, (2) you are permanently
              unconscious, or (3) the potential risks of pain management.
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h2 mb-2'>Terminal Condition</h2>
            <p className='mb-6 text-sm'>
              A terminal condition is an incurable condition which, to a
              reasonable degree of medical certainty, is likely to result in
              death in the near future.
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Do you want life-sustaining measures to be{' '}
              <span className='relative'>
                administered?
                <QuestionDialig question='What is life-sustaining support?'>
                  Life-sustaining treatment refers to any medical procedure that
                  uses mechanical or medically administered means to maintain,
                  restore, or support a vital function, solely to prolong the
                  process of dying or sustain a state of permanent
                  unconsciousness.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isTerminalLifeSustainingMeasures'
            />
          </div>

          <div className='mb-8'>
            <h3 className='h3 mb-6'>
              Do you want to receive artificial nutrition or{' '}
              <span className='relative'>
                hydration?
                <QuestionDialig question='What is artificial hydration?'>
                  Artificial nutrition and hydration involve invasive procedures
                  to deliver nutrition and/or fluids when a person cannot
                  naturally ingest them. Tube feeding is an example of
                  artificial nutrition or hydration.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isTerminalArtificialNutritionHydration'
            />

            <Separator className='mt-6' />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h2 mb-2'>Permanent Unconsciousness</h2>
            <p className='mb-6 text-sm'>
              Permanent unconsciousness is a long-term condition where, to a
              reasonable medical certainty, the person has no neocortical
              function and only retains involuntary vegetative or primitive
              reflexes managed by the brain stem.
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Do you want life-sustaining measures to be{' '}
              <span className='relative'>
                administered?
                <QuestionDialig question='What is life-sustaining support?'>
                  Life-sustaining treatment refers to any medical procedure that
                  uses mechanical or medically administered means to maintain,
                  restore, or support a vital function, solely to prolong the
                  process of dying or sustain a state of permanent
                  unconsciousness.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isPermanentLifeSustainingMeasures'
            />
          </div>

          <div className='mb-8'>
            <h3 className='h3 mb-6'>
              Do you want to receive artificial nutrition or{' '}
              <span className='relative'>
                hydration?
                <QuestionDialig question='What is artificial hydration?'>
                  Artificial nutrition and hydration involve invasive procedures
                  to deliver nutrition and/or fluids when a person cannot
                  naturally ingest them. Tube feeding is an example of
                  artificial nutrition or hydration.
                </QuestionDialig>
              </span>
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isPermanentArtificialNutritionHydration'
            />

            <Separator className='mt-6' />
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h2 className='h2 mb-2'>Pain Management</h2>
            <p className='mb-6 text-sm'>
              If you are in a terminal or permanently unconscious condition,
              experiencing severe pain, and unable to communicate, would you
              prefer to receive any and all pain medication, even if it may
              cause permanent physical damage, addiction, or hasten your death?
            </p>
          </div>

          <div className='mb-8 lg:mb-[36px]'>
            <h3 className='h3 mb-6'>
              Do you want to authorize treatment of alleviation from pain or
              discomfort, even if it results in the hastening of your death?
            </h3>

            <RadioFieldBoolean
              methods={methods}
              name='isAuthorizePainAlleviationTreatment'
            />
          </div>

          <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
            <Button
              onClick={handleBack}
              type='button'
              variant='outline'
              className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
            >
              <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
              isLoading={isNextLoading}
            >
              Next
            </Button>
          </div>

          <Button
            isLoading={isLoading}
            className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
            type='submit'
            variant='outline'
          >
            <SaveIcon className='mr-1' /> Save and exit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default WishesForm;
