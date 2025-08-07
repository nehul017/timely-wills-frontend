'use client';

import { useEffect } from 'react';

import Stepper from '@/components/Stepper';
import { durablePOASteps } from '@/constant/poa';
import useFetchDurablePOA from '@/hooks/durable-poa/use-fetch-durable-poa';
import { useDurablePOAdesignatedAgentStore } from '@/store/durable-poa';
import { useProgressStepStore } from '@/store/progress-steps';

import DurablePOAAgentPowersForm from './DurablePOAAgentPowersForm';
import DurablePOAFormAgent from './DurablePOAFormAgent';
import DurablePOAReview from './DurablePOAReview';
import SigningForm from './SigningForm';
import DownloadDocument from '../DownloadDocument';

function DurablePOASection() {
  const { durableStep } = useProgressStepStore();
  const { url } = useDurablePOAdesignatedAgentStore();
  const { fetchDurable } = useFetchDurablePOA();

  useEffect(() => {
    fetchDurable();
  }, []);

  return (
    <>
      <Stepper documentType='durable' steps={durablePOASteps} />
      {durableStep === 0 && <DurablePOAFormAgent />}
      {durableStep === 1 && <DurablePOAAgentPowersForm />}
      {durableStep === 2 && <SigningForm />}
      {durableStep === 3 && <DurablePOAReview />}
      {durableStep === 4 && (
        <DownloadDocument title='Durable POA' url={url || ''} editStep={3} />
      )}
    </>
  );
}

export default DurablePOASection;
