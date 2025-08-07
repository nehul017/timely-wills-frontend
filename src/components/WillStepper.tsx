'use client';

import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import useWillSearchParams from '@/hooks/use-will-search-params';
import useAllWillSections from '@/hooks/will/use-all-will-sections';
import { cn } from '@/lib/utils';
import { useProgressStepStore } from '@/store/progress-steps';
import { WillSection } from '@/types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export type WillStep = {
  step: number;
  title: string;
  subSteps: string[];
  isAccordion: boolean;
  subTitle: WillSection;
};

type Props = {
  steps: WillStep[];
};

type ClickProps = {
  mainStep: number;
  subStep: number;
};

function WillStepper({ steps }: Props) {
  const { willMainStep, subStep, setSubStep, setWillMainStep } =
    useProgressStepStore();
  const { updateSearchParams, willSections } = useWillSearchParams();
  const {
    isCompletedEstateSection,
    isCompletedExecutorsSection,
    isCompletedFamilySection,
    isCompletedGiftsSection,
  } = useAllWillSections();
  const [divWidth, setDivWidth] = useState(375);
  const divRef = useRef<HTMLDivElement>(null);

  const checkIfNeedAddClick = (value: WillSection) => {
    const isAllCompleted =
      isCompletedEstateSection &&
      isCompletedExecutorsSection &&
      isCompletedFamilySection &&
      isCompletedGiftsSection;

    switch (value) {
      case 'family':
        return isCompletedFamilySection;

      case 'estate':
        return isCompletedEstateSection;

      case 'executors':
        return isCompletedExecutorsSection;

      case 'gifts':
        return isCompletedGiftsSection;

      default:
        return isAllCompleted;
    }
  };

  const modifiedSteps = steps.map((step) => ({
    ...step,
    isClickable: checkIfNeedAddClick(step.subTitle),
  }));

  const handleClickSubStep = (data: ClickProps) => () => {
    const { mainStep, subStep } = data;

    setSubStep(subStep);
    setWillMainStep(mainStep);
    updateSearchParams(willSections[mainStep]);
  };

  const handleClickMainStep = (data: Omit<ClickProps, 'subStep'>) => () => {
    const { mainStep } = data;

    setWillMainStep(mainStep);
    updateSearchParams(willSections[mainStep]);

    if (subStep) {
      setSubStep(0);
    }
  };

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

  const setClassName = (i: number) => {
    switch (true) {
      case i < willMainStep:
        return 'bg-[#DBFFE5]';

      case i === willMainStep:
        return 'text-white bg-bright';

      default:
        return 'border border-[#010D04] bg-white';
    }
  };

  return (
    <div
      className='border-b pb-6 lg:block lg:border-b-0 lg:border-r lg:pb-0'
      ref={divRef}
    >
      <div className='lg:w-[276px]'>
        <div className='mb-4 text-lg font-semibold text-bright lg:mb-0 lg:hidden'>
          {steps[willMainStep].title}
        </div>

        <div className='flex lg:hidden'>
          {modifiedSteps.map(({ step, title, isClickable }, index) => (
            <div className='flex lg:flex-col' key={step}>
              <div
                aria-hidden
                onClick={
                  isClickable
                    ? handleClickMainStep({ mainStep: step - 1 })
                    : undefined
                }
                className='flex max-h-11 cursor-pointer items-center gap-[20px]'
              >
                <div
                  className={cn(
                    'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-bright text-sm font-medium lg:h-11 lg:w-11 lg:text-lg',
                    setClassName(index),
                  )}
                >
                  {index < willMainStep ? (
                    <Check className='h-5 w-5' color='#25D998' />
                  ) : (
                    step
                  )}
                </div>

                <div
                  className={`hidden text-lg lg:block ${index === willMainStep ? 'font-semibold text-bright' : 'text-sm'}`}
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

        <div className='hidden lg:flex lg:flex-col'>
          {modifiedSteps.map(
            ({ step, title, subSteps, isAccordion, isClickable }, index) =>
              isAccordion ? (
                <div className='flex lg:flex-col' key={step}>
                  <Accordion type='single' collapsible>
                    <AccordionItem
                      className='w-[228px] border-none'
                      value={`item-${step}`}
                    >
                      <AccordionTrigger
                        iconClass='w-[22px] h-[22px]]'
                        className='m-0'
                      >
                        <div className='flex max-h-11 items-center gap-[20px]'>
                          <div
                            className={cn(
                              'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-bright text-sm font-medium lg:h-11 lg:w-11 lg:text-lg',
                              setClassName(index),
                            )}
                          >
                            {index < willMainStep ? (
                              <Check className='h-5 w-5' color='#25D998' />
                            ) : (
                              step
                            )}
                          </div>

                          <div
                            className={`hidden text-lg lg:flex lg:items-center lg:justify-between ${index === willMainStep ? 'font-semibold text-bright' : 'text-sm font-normal'}`}
                          >
                            <span className='inline-flex max-w-[144px] text-lg'>
                              {title}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='border-l[#DEE0DF] ml-[22px] w-[166px] border-l pb-0 pl-[40px]'>
                        <div className='space-y-2 pt-[14px]'>
                          {subSteps.map((item, subIndex) => (
                            <p
                              aria-hidden
                              onClick={
                                isClickable
                                  ? handleClickSubStep({
                                      mainStep: step - 1,
                                      subStep: subIndex,
                                    })
                                  : undefined
                              }
                              className={`w-[166px] cursor-pointer text-sm ${subIndex === subStep && index === willMainStep ? 'font-semibold text-[#010D04]' : ''}`}
                              key={item}
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {index !== steps.length - 1 && (
                    <div
                      style={{
                        width: `${(divWidth - steps.length * 36) / (steps.length - 1)}px`,
                      }}
                      className='mt-[18px] h-[1px] bg-[#DEE0DF] lg:hidden'
                    />
                  )}
                  {index !== steps.length - 1 && (
                    <div className='ml-[22px] hidden min-h-8 w-[1px] bg-[#DEE0DF] lg:inline-flex' />
                  )}
                </div>
              ) : (
                <div className='flex lg:flex-col' key={step}>
                  <div
                    aria-hidden
                    onClick={
                      isClickable
                        ? handleClickMainStep({ mainStep: step - 1 })
                        : undefined
                    }
                    className='flex max-h-11 cursor-pointer items-center gap-[20px]'
                  >
                    <div
                      className={cn(
                        'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-bright text-sm font-medium lg:h-11 lg:w-11 lg:text-lg',
                        setClassName(index),
                      )}
                    >
                      {index < willMainStep ? (
                        <Check className='h-5 w-5' color='#25D998' />
                      ) : (
                        step
                      )}
                    </div>

                    <div
                      className={`hidden text-lg lg:block ${index === willMainStep && 'font-semibold text-bright'}`}
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
              ),
          )}
        </div>
      </div>
    </div>
  );
}

export default WillStepper;
