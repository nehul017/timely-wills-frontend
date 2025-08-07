'use client';

import { Check } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import useDurableCompleted from '@/hooks/durable-poa/use-durable-completed';
import useMedicalCompleted from '@/hooks/medical-poa/use-medical-completed';
import { cn } from '@/lib/utils';
import { useProgressStepStore } from '@/store/progress-steps';
import { Step, StepTitle } from '@/types';

type Props = {
  steps: Step[];
  documentType?: 'medical' | 'durable';
  isHealthCare?: boolean;
};

function Stepper({ steps, documentType, isHealthCare }: Props) {
  const { medicalStep, durableStep, setMedicalStep, setDurableStep } =
    useProgressStepStore();
  const {
    isCompletedAgentPowersSection: isDurableCompletedAgentPowersSection,
    isCompletedAgentSection: isDurableCompletedAgentSection,
    isCompletedSigningSection: isDurableCompletedSigningSection,
  } = useDurableCompleted();
  const {
    isCompletedAgentSection: isMedicalCompletedAgentSection,
    isCompletedAgentPowersSection: isMedicalCompletedAgentPowersSection,
    isCompletedGuardianSection,
    isCompletedPrimaryPhysicianSection,
    isCompletedSigningSection: isMedicalCompletedSigningSection,
    isCompletedWishesSection,
  } = useMedicalCompleted();

  const [divWidth, setDivWidth] = useState(375);
  const divRef = useRef<HTMLDivElement>(null);

  const isDurableDocument = documentType === 'durable';
  const mainStep = isDurableDocument ? durableStep : medicalStep;
  const setStep = isDurableDocument ? setDurableStep : setMedicalStep;

  const checkDurableClick = (title: StepTitle) => {
    const isAllCompleted =
      isDurableCompletedAgentPowersSection &&
      isDurableCompletedAgentSection &&
      isDurableCompletedSigningSection;

    switch (title) {
      case 'Designated Agent':
        return isDurableCompletedAgentSection;

      case 'Signing':
        return isDurableCompletedSigningSection;

      case 'Powers you wish to grant':
        return isDurableCompletedAgentPowersSection;

      default:
        return isAllCompleted;
    }
  };

  const checkMedicalClick = (title: StepTitle) => {
    const isAllCompleted =
      isMedicalCompletedAgentPowersSection &&
      isMedicalCompletedAgentSection &&
      isCompletedGuardianSection &&
      isCompletedPrimaryPhysicianSection &&
      isCompletedWishesSection &&
      isMedicalCompletedSigningSection;

    switch (title) {
      case 'Designated Agent':
        return isMedicalCompletedAgentSection;

      case 'Signing':
        return isMedicalCompletedSigningSection;

      case 'Agent Powers':
        return isMedicalCompletedAgentPowersSection;

      case 'Guardian':
        return isCompletedGuardianSection;

      case 'Primary Physician':
        return isCompletedPrimaryPhysicianSection;

      case 'Wishes':
        return isCompletedWishesSection;

      default:
        return isAllCompleted;
    }
  };

  const functionToClick = isDurableDocument
    ? checkDurableClick
    : checkMedicalClick;

  const updateDivWidth = () => {
    setDivWidth(divRef.current?.offsetWidth as number);
  };

  useEffect(() => {
    if (!divRef.current) return;

    const handleResize = () => {
      updateDivWidth();
    };

    window.addEventListener('resize', handleResize);

    setDivWidth(divRef.current.offsetWidth);

    return () => window.removeEventListener('resize', handleResize);
  }, [steps.length]);

  useEffect(() => {
    if (mainStep > 5 && !isHealthCare) {
      setMedicalStep(5);
    }
  }, []);

  const setClassName = (i: number) => {
    switch (true) {
      case i < mainStep:
        return 'bg-[#DBFFE5]';

      case i === mainStep:
        return 'text-white bg-bright';

      default:
        return 'border border-[#010D04] bg-white';
    }
  };

  return (
    <div
      className='border-b pb-6 lg:border-b-0 lg:border-r lg:pb-0'
      ref={divRef}
    >
      <div className='lg:w-[276px]'>
        <div className='mb-4 text-lg font-semibold text-bright lg:mb-0 lg:hidden'>
          {steps[mainStep]?.title}
        </div>
        <div className='flex lg:flex-col'>
          {steps.map(({ step, title }, index) => (
            <div className='flex lg:flex-col' key={step}>
              <div className='flex max-h-11 items-center gap-[20px]'>
                <div
                  aria-hidden
                  onClick={
                    functionToClick(title) ? () => setStep(step - 1) : undefined
                  }
                  className={cn(
                    'flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-bright text-sm font-medium lg:h-11 lg:w-11 lg:text-lg',
                    setClassName(index),
                  )}
                >
                  {index < mainStep ? (
                    <Check className='h-5 w-5' color='#25D998' />
                  ) : (
                    step
                  )}
                </div>

                <div
                  aria-hidden
                  onClick={
                    functionToClick(title) ? () => setStep(step - 1) : undefined
                  }
                  className={`hidden cursor-pointer text-lg lg:block ${index === mainStep ? 'font-semibold text-bright' : 'text-sm'}`}
                >
                  {title}
                </div>
              </div>

              {index !== steps.length - 1 && (
                <div
                  style={{
                    width: `${(divWidth - steps.length * 36) / (steps.length - 1)}px`,
                  }}
                  className='mt-[18px] h-[1px] bg-[#DEE0DF] lg:hidden'
                />
              )}
              {index !== steps.length - 1 && (
                <div className='ml-[22px] hidden h-8 w-[1px] bg-[#DEE0DF] lg:inline-flex' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stepper;
