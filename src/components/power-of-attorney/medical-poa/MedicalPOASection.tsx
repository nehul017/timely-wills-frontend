'use client';

import { useEffect } from 'react';

import Stepper from '@/components/Stepper';
import { medicalPOASteps } from '@/constant/poa';
import useFetchMedicalPOA from '@/hooks/medical-poa/use-fetch-medical-poa';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';
import { useProgressStepStore } from '@/store/progress-steps';

import MedicalPOAAgentPowersForm from './MedicalPOAAgentPowersForm';
import MedicalPOAFormAgent from './MedicalPOAFormAgent';
import MedicalPOAGuardinForm from './MedicalPOAGuardinForm';
import MedicalPOAPrimaryPhysicianForm from './MedicalPOAPrimaryPhysicianForm';
import MedicalPOAReview from './MedicalPOAReview';
import SigningMedicalForm from './SigningMedicalForm';
import DownloadDocument from '../DownloadDocument';

function MedicalPOASection() {
  const { medicalStep } = useProgressStepStore();
  const { fetchMedicalPOA } = useFetchMedicalPOA();
  const { url } = useMedicalPOAAgentStore();

  useEffect(() => {
    fetchMedicalPOA();
  }, []);

  return (
    <>
      <Stepper documentType='medical' steps={medicalPOASteps} />
      {!medicalStep && <MedicalPOAFormAgent />}
      {medicalStep === 1 && <MedicalPOAAgentPowersForm />}
      {medicalStep === 2 && <MedicalPOAGuardinForm />}
      {medicalStep === 3 && <MedicalPOAPrimaryPhysicianForm />}
      {medicalStep === 4 && <SigningMedicalForm />}
      {medicalStep === 5 && <MedicalPOAReview />}
      {medicalStep === 6 && (
        <DownloadDocument title='Medical POA' url={url || ''} editStep={5} />
      )}
    </>
  );
}

export default MedicalPOASection;
