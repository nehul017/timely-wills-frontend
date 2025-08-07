'use client';

import { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useLivingWillRequestBody from '@/hooks/living-will/use-living-will-request-body';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import useMedicalPOAReview from '@/hooks/medical-poa/useMedicalPOAReview';
import healthCareAPI from '@/services/health-care-directive';
import livingWillAPI from '@/services/living-will';
import { LivingWillGetResponse } from '@/services/living-will/types';
import medicalPoaAPI from '@/services/medical-poa';
import { MedicalPoaGetResponse } from '@/services/medical-poa/types';
import { useHealthCareStore } from '@/store/health-care';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';

import AgentsPreviewCard from '../medical-poa/AgentsPreviewCard';
import GuardianPreviewCard from '../medical-poa/GuardianPreviewCard';
import PrimaryPhysicianPreviewCard from '../medical-poa/PrimaryPhysicianPreviewCard';
import SubmitDialog from '../SubmitDialog';

function MedicalPOALivingWillReview() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    increaseMedicalStep,
    decreaseMedicalStep,
    setMedicalStep,
    setCurrentWishesStep,
  } = useMedicalPOAReview();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const { livingWillBody, livingWillId } = useLivingWillRequestBody();
  const { specificWishes, wishes } = useLivingWillWishesStore();
  const { id: healthCareId, setHealthCare } = useHealthCareStore();
  const { updateUrl } = useMedicalPOAAgentStore();

  const handleBack = () => {
    decreaseMedicalStep();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      let medical: MedicalPoaGetResponse | null = null;
      let livingWill: LivingWillGetResponse | null = null;

      const res = await Promise.all([
        livingWillAPI.getLivingWill(),
        medicalPoaAPI.getMedicalPOA(),
      ]);

      if (res[1]) {
        medical = await medicalPoaAPI.updateMedicalPOA(
          medicalId as number,
          medicalBody,
        );
      } else {
        medical = await medicalPoaAPI.createtMedicalPOA(medicalBody);
      }

      if (res[0]) {
        livingWill = await livingWillAPI.updateLivingWill(
          livingWillId,
          livingWillBody,
        );
      } else {
        livingWill = await livingWillAPI.createLivingWill(livingWillBody);
      }

      if (healthCareId) {
        const res = await healthCareAPI.updateHealthCare(
          healthCareId as number,
          {
            livingWill: livingWill.id,
            medicalPoa: medical.id,
          },
        );

        const fileUrl = await medicalPoaAPI.generateFile(medical.id as number);

        setHealthCare({ id: res.id, url: fileUrl });
        updateUrl(fileUrl);
      } else {
        await healthCareAPI.createHealthCare({
          livingWill: livingWill.id,
          medicalPoa: medical.id,
        });
        const fileUrl = await medicalPoaAPI.generateFile(medical.id as number);

        updateUrl(fileUrl);
      }

      increaseMedicalStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className='w-full text-[#010D04] lg:w-[690px]'>
        <p className='h2 mb-6'>Let’s review your answers quickly</p>

        <AgentsPreviewCard
          handleClickAgent={() => setMedicalStep(0)}
          handleClickPower={() => setMedicalStep(1)}
        />

        <GuardianPreviewCard handleClick={() => setMedicalStep(2)} />

        <article className='mb-6'>
          <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>Wishes</h2>

          <div className='rounded-lg border border-[#8D9395] p-5'>
            <div className='mb-[14px]'>
              <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
                Terminal Condition
                <Button
                  onClick={() => setMedicalStep(3)}
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
                    {wishes.isTerminalArtificialNutritionHydration
                      ? 'Yes'
                      : 'No'}
                  </span>
                </p>
              </div>

              <Separator />
            </div>

            <div className='mb-[14px]'>
              <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
                Permanent Unconsciousness
                <Button
                  onClick={() => setMedicalStep(3)}
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
                  onClick={() => setMedicalStep(3)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </h3>

              <div className='flex flex-col space-y-4'>
                <p className='flex flex-col space-y-1'>
                  <span className='text-sm'>
                    Do you want to authorize treatment of alleviation from pain
                    or discomfort, even if it results in the hastening of your
                    death?
                  </span>
                  <span className='text-[16px] font-semibold'>
                    {wishes.isAuthorizePainAlleviationTreatment ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>

              <Separator className='mb-[14px] mt-5' />
            </div>

            <div>
              <p className='flex flex-col space-y-1'>
                <span className='flex justify-between gap-[14px]'>
                  <span className='max-w-[614px] text-sm'>
                    Do you want to donate your organs?
                  </span>
                  <span className='flex justify-between text-sm'>
                    <Button
                      onClick={() => {
                        setMedicalStep(3);
                        setCurrentWishesStep(1);
                      }}
                      variant='ghost'
                      className='h-fit w-fit p-0'
                    >
                      <PencillFillIcon />
                    </Button>
                  </span>
                </span>
                <span className='text-[16px] font-semibold'>
                  {specificWishes.isOrganDonation ? 'Yes' : 'No'}
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
                      onClick={() => {
                        setMedicalStep(3);
                        setCurrentWishesStep(1);
                      }}
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
                      onClick={() => {
                        setMedicalStep(3);
                        setCurrentWishesStep(1);
                      }}
                      variant='ghost'
                      className='h-fit w-fit p-0'
                    >
                      <PencillFillIcon />
                    </Button>
                  </span>
                </span>
                <span className='text-[16px] font-semibold'>
                  {specificWishes.additionalWishes || 'No'}
                </span>
              </p>
            </div>
          </div>
        </article>

        <PrimaryPhysicianPreviewCard handleClick={() => setMedicalStep(4)} />

        <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
          <Button
            type='button'
            onClick={handleBack}
            variant='outline'
            className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
          >
            <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
            Back
          </Button>

          <SubmitDialog
            document='Medical'
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}

export default MedicalPOALivingWillReview;
