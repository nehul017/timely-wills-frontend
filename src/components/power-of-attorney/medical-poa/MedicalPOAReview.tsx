'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import { Button } from '@/components/ui/button';
import useMedicalRequestBody from '@/hooks/medical-poa/use-medical-request-body';
import useMedicalPOAReview from '@/hooks/medical-poa/useMedicalPOAReview';
import medicalPoaAPI from '@/services/medical-poa';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';

import AgentsPreviewCard from './AgentsPreviewCard';
import GuardianPreviewCard from './GuardianPreviewCard';
import PrimaryPhysicianPreviewCard from './PrimaryPhysicianPreviewCard';
import SubmitDialog from '../SubmitDialog';

function MedicalPOAReview() {
  const [isLoading, setIsloading] = useState(false);
  const {
    medicalStep,
    increaseMedicalStep,
    decreaseMedicalStep,
    setMedicalStep,
  } = useMedicalPOAReview();
  const { medicalBody, medicalId } = useMedicalRequestBody();
  const { updateUrl } = useMedicalPOAAgentStore();
  const router = useRouter();

  const handleBack = () => {
    if (!medicalStep) {
      router.back();
      return;
    }

    decreaseMedicalStep();
  };

  const handleSubmit = async () => {
    setIsloading(true);
    try {
      let fileUrl: string | null = null;
      const res = await medicalPoaAPI.getMedicalPOA();

      if (res) {
        const result = await Promise.all([
          medicalPoaAPI.updateMedicalPOA(medicalId as number, medicalBody),
          medicalPoaAPI.generateFile(medicalId as number),
        ]);

        fileUrl = result[1];
      } else {
        const res = await medicalPoaAPI.createtMedicalPOA(medicalBody);

        if (res) {
          fileUrl = await medicalPoaAPI.generateFile(res.id);
        }
      }

      updateUrl(fileUrl);
      increaseMedicalStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <section className='w-full text-[#010D04] lg:w-[690px]'>
      <p className='h2 mb-6'>Let’s review your answers quickly</p>

      <AgentsPreviewCard
        handleClickAgent={() => setMedicalStep(0)}
        handleClickPower={() => setMedicalStep(1)}
      />

      <GuardianPreviewCard handleClick={() => setMedicalStep(2)} />

      <PrimaryPhysicianPreviewCard handleClick={() => setMedicalStep(3)} />

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
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          document='Medical'
        />
      </div>
    </section>
  );
}

export default MedicalPOAReview;
