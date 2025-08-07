'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import Footer from '@/components/Footer';
import POATopHeading from '@/components/power-of-attorney/POATopHeading';
import QuestionDialig from '@/components/QuestionDialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import withAuth from '@/components/withAuth';
import useMedicalCompleted from '@/hooks/medical-poa/use-medical-completed';
import { cn } from '@/lib/utils';
import { useProgressStepStore } from '@/store/progress-steps';

function HealthCarePage() {
  const [isBoth, setIsBoth] = useState<boolean | null>(null);
  const { medicalStep, setMedicalStep } = useProgressStepStore();
  const { isCompletedWishesSection } = useMedicalCompleted();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleClick = () => {
    if (isBoth === null) {
      setError('Please select a section');
      return;
    }

    if (!isCompletedWishesSection && medicalStep > 3) {
      setMedicalStep(3);
    }

    router.push(
      `/Power-of-attorney/Health-Care-Directives/${isBoth ? 'Medical-POA-and-Living-Will' : 'Medical-POA'}`,
    );
  };

  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <POATopHeading>
          <span className='text-bright'>Health Care</span> Directives
        </POATopHeading>
      </section>

      <section className='py-12'>
        <article className='mx-auto max-w-[1200px] px-6 xl:px-0'>
          <div className='lg:max-w-[600px]'>
            <h2 className='mb-6 text-[22px] font-bold lg:text-2xl'>
              Would you like to add a living will to your medical{' '}
              <span className='relative'>
                POA?
                <QuestionDialig question='Difference between a living will & medical POA'>
                  <span className='flex flex-col space-y-6 text-[#010D0499]'>
                    <span>
                      A Living Will and a Medical Power of Attorney are distinct
                      legal documents, each with a specific function. A Living
                      Will enables you to decide in advance about receiving
                      life-sustaining medical treatment if there is no chance of
                      recovery, such as in cases of brain death. It also allows
                      you to appoint a patient advocate to ensure your wishes
                      outlined in the Living Will are followed.
                    </span>
                    <span>
                      A Medical Power of Attorney, also referred to as a Health
                      Care Power of Attorney, allows you to designate someone to
                      make health care decisions on your behalf if you are
                      unable to do so, whether temporarily or permanently. The
                      authority of the Medical Power of Attorney remains in
                      effect only during your incapacity.
                    </span>
                    <span>
                      If you choose to have both, then they will be combined
                      into one document referred to as your{' '}
                      <span className='font-bold'>Health Care Directive</span>.
                    </span>
                  </span>
                </QuestionDialig>
              </span>
            </h2>

            <div className='flex flex-col space-y-6 text-[16px] font-semibold'>
              <div
                className={cn(
                  'flex min-h-[105px] cursor-pointer items-center justify-between rounded-lg border border-[#8D9395] p-5 text-base font-semibold hover:no-underline lg:max-w-[420px]',
                  isBoth ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined,
                )}
                onClick={() => setIsBoth(true)}
                aria-hidden
              >
                <div>
                  <div className='border-gradient m-0 mb-2 h-[33px]'>
                    <span className='block w-[130px] rounded-md bg-[#DBFFE5] px-0 py-[6px] text-center text-sm font-semibold'>
                      Most Common
                    </span>
                  </div>
                  Yes, I&apos;d like to add a living will.
                </div>

                <RadioGroup>
                  <RadioGroupItem
                    checked={isBoth === true}
                    value='option-one'
                  />
                </RadioGroup>
              </div>

              <div
                className={cn(
                  'flex min-h-[64px] cursor-pointer items-center justify-between rounded-lg border border-[#8D9395] p-5 text-base font-semibold hover:no-underline lg:max-w-[420px]',
                  isBoth === false
                    ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]'
                    : undefined,
                )}
                onClick={() => setIsBoth(false)}
                aria-hidden
              >
                No, I would not like to add a living will.
                <RadioGroup>
                  <RadioGroupItem
                    checked={isBoth === false}
                    value='option-two'
                  />
                </RadioGroup>
              </div>
            </div>

            {error && <p className='mt-2 text-xs text-danger'>{error}</p>}

            <div className='mt-8 flex justify-between gap-2 lg:mt-9'>
              <Link
                href='/Power-of-attorney'
                className='flex h-[52px] w-full items-center justify-center rounded-lg border text-lg font-semibold lg:w-[140px]'
              >
                <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
                Back
              </Link>

              <Button
                onClick={handleClick}
                className='flex h-[52px] w-full items-center justify-center rounded-lg bg-bright text-lg font-semibold text-white lg:w-[200px]'
              >
                Next
              </Button>
            </div>
          </div>
        </article>
      </section>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(HealthCarePage);
