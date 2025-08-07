'use client';

import React, { useEffect } from 'react';

import Stepper from '@/components/Stepper';
import { medicalPOALivingWillSteps } from '@/constant/poa';
import useFetchHealthCare from '@/hooks/health-care/use-fetch-health-care';
import useFetchLivingWill from '@/hooks/living-will/use-fetch-living-will';
import useFetchMedicalPOA from '@/hooks/medical-poa/use-fetch-medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';

import MedicalPOALivingWillDownLoad from './MedicalPOALivingWillDownLoad';
import MedicalPOALivingWillReview from './MedicalPOALivingWillReview';
import WishesSpecificWishes from './WishesSpecificWishes';
import MedicalPOAAgentPowersForm from '../medical-poa/MedicalPOAAgentPowersForm';
import MedicalPOAFormAgent from '../medical-poa/MedicalPOAFormAgent';
import MedicalPOAGuardinForm from '../medical-poa/MedicalPOAGuardinForm';
import MedicalPOAPrimaryPhysicianForm from '../medical-poa/MedicalPOAPrimaryPhysicianForm';
import SigningMedicalForm from '../medical-poa/SigningMedicalForm';

function MedicalPOALivingWillSection() {
  const { medicalStep } = useProgressStepStore();
  const { fetchMedicalPOA } = useFetchMedicalPOA();
  const { fetchLivingWill } = useFetchLivingWill();
  const { fetchHealthCare } = useFetchHealthCare();

  useEffect(() => {
    fetchMedicalPOA();
    fetchLivingWill();
    fetchHealthCare();
  }, []);

  return (
    <>
      <Stepper
        isHealthCare
        documentType='medical'
        steps={medicalPOALivingWillSteps}
      />
      {!medicalStep && <MedicalPOAFormAgent isHealthCare />}
      {medicalStep === 1 && <MedicalPOAAgentPowersForm />}
      {medicalStep === 2 && <MedicalPOAGuardinForm />}
      {medicalStep === 3 && <WishesSpecificWishes />}
      {medicalStep === 4 && <MedicalPOAPrimaryPhysicianForm isHealthCare />}
      {medicalStep === 5 && <SigningMedicalForm isHealthCare />}
      {medicalStep === 6 && <MedicalPOALivingWillReview />}
      {medicalStep === 7 && <MedicalPOALivingWillDownLoad />}
    </>
  );
}

export default MedicalPOALivingWillSection;
