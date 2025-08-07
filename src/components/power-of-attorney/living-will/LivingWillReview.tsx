'use client';

import React, { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useLivingWillRequestBody from '@/hooks/living-will/use-living-will-request-body';
import livingWillAPI from '@/services/living-will';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useProgressStepStore } from '@/store/progress-steps';

import SubmitDialog from '../SubmitDialog';

function LivingWillReview() {
  const [isLoading, setIsLoading] = useState(false);
  const { setMedicalStep, decreaseMedicalStep, increaseMedicalStep } =
    useProgressStepStore();
  const { specificWishes, wishes, updateUrl } = useLivingWillWishesStore();
  const { livingWillBody, livingWillId } = useLivingWillRequestBody();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let fileUrl: string | null = null;
      const res = await livingWillAPI.getLivingWill();

      if (res) {
        const result = await Promise.all([
          livingWillAPI.updateLivingWill(
            livingWillId as number,
            livingWillBody,
          ),
          livingWillAPI.generateFile(livingWillId as number),
        ]);

        fileUrl = result[1];
      } else {
        const res = await livingWillAPI.createLivingWill(livingWillBody);

        if (res) {
          fileUrl = await livingWillAPI.generateFile(res.id);
        }
      }

      updateUrl(fileUrl);
      increaseMedicalStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full text-[#010D04] lg:w-[690px]'>
      <p className='h2 mb-6'>Let’s review your answers quickly</p>

      <article className='mb-6'>
        <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>Wishes</h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          <div className='mb-[14px]'>
            <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
              Terminal Condition
              <Button
                onClick={() => setMedicalStep(0)}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </h3>

            <div className='mb-5 flex flex-col space-y-4'>
              <p className='flex flex-col space-y-1'>
                <span className='text-sm'>
                  Do you want life-sustaining measures to be administered?
                </span>
                <span className='text-[16px] font-semibold'>
                  {wishes.isTerminalLifeSustainingMeasures ? 'Yes' : 'No'}
                </span>
              </p>
              <p className='flex flex-col space-y-1'>
                <span className='text-sm'>
                  Do you want to receive artificial nutrition or hydration?
                </span>
                <span className='text-[16px] font-semibold'>
                  {wishes.isTerminalArtificialNutritionHydration ? 'Yes' : 'No'}
                </span>
              </p>
            </div>

            <Separator />
          </div>

          <div className='mb-[14px]'>
            <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
              Permanent Unconsciousness
              <Button
                onClick={() => setMedicalStep(0)}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </h3>

            <div className='mb-5 flex flex-col space-y-4'>
              <p className='flex flex-col space-y-1'>
                <span className='text-sm'>
                  Do you want life-sustaining measures to be administered?
                </span>
                <span className='text-[16px] font-semibold'>
                  {wishes.isPermanentLifeSustainingMeasures ? 'Yes' : 'No'}
                </span>
              </p>
              <p className='flex flex-col space-y-1'>
                <span className='text-sm'>
                  Do you want to receive artificial nutrition or hydration?
                </span>
                <span className='text-[16px] font-semibold'>
                  {wishes.isPermanentArtificialNutritionHydration
                    ? 'Yes'
                    : 'No'}
                </span>
              </p>
            </div>

            <Separator />
          </div>

          <div>
            <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
              Pain Management
              <Button
                onClick={() => setMedicalStep(0)}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </h3>

            <div className='flex flex-col space-y-4'>
              <p className='flex flex-col space-y-1'>
                <span className='text-sm'>
                  Do you want to authorize treatment of alleviation from pain or
                  discomfort, even if it results in the hastening of your death?
                </span>
                <span className='text-[16px] font-semibold'>
                  {wishes.isAuthorizePainAlleviationTreatment ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className='mb-6'>
        <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>
          Specific Wishes
        </h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          <p className='flex flex-col space-y-1'>
            <span className='flex justify-between gap-[14px]'>
              <span className='max-w-[614px] text-sm'>
                Do you want to donate your organs?
              </span>
              <span className='flex justify-between text-sm'>
                <Button
                  onClick={() => setMedicalStep(1)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </span>
            </span>
            <span className='text-[16px] font-semibold'>
              {specificWishes.isOrganDonation
                ? 'Yes, I want to be an organ donor'
                : 'No, I don’t want to be an organ donor'}
            </span>
          </p>

          <Separator className='mb-[14px] mt-5' />

          <p className='flex flex-col space-y-1'>
            <span className='flex justify-between gap-[14px]'>
              <span className='max-w-[614px] text-sm'>
                Where would you like to receive end of life care?
              </span>
              <span className='flex justify-between text-sm'>
                <Button
                  onClick={() => setMedicalStep(1)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </span>
            </span>
            <span className='text-[16px] font-semibold capitalize'>
              {specificWishes.endOfLifeCareLocation}
            </span>
          </p>

          <Separator className='mb-[14px] mt-5' />

          <p className='flex flex-col space-y-1'>
            <span className='flex justify-between gap-[14px]'>
              <span className='max-w-[614px] text-sm'>
                Are there any other wishes you’d like to include in this
                directive?
              </span>
              <span className='flex justify-between text-sm'>
                <Button
                  onClick={() => setMedicalStep(1)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </span>
            </span>
            <span className='text-[16px] font-semibold capitalize'>
              {specificWishes.additionalWishes || 'No'}
            </span>
          </p>
        </div>
      </article>

      <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
        <Button
          type='button'
          onClick={decreaseMedicalStep}
          variant='outline'
          className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
        >
          <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
          Back
        </Button>

        <SubmitDialog
          handleSubmit={handleSubmit}
          document='Living Will'
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}

export default LivingWillReview;
