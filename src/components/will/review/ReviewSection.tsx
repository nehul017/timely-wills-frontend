'use client';

import { Fragment } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  ReviewAccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useWillSearchParams from '@/hooks/use-will-search-params';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';

import BeneficiaryReviewCard from './BeneficiaryReviewCard';
import ConfirmDialog from './ConfirmDialog';
import ExecutorReview from './ExecutorReview';
import FamilyReviewCard from './FamilyReviewCard';
import GiftReviewCard from './GiftReviewCard';
import GuardianReviewCard from './GuardianReviewCard';
import WillTopHeading from '../WillTopHeading';

function ReviewSection() {
  const { setWillMainStep, setSubStep, decreaseWillMainStep } =
    useProgressStepStore();
  const { children, pets } = useFamilyMembersState();
  const { beneficiaries } = useEstateState();
  const { beneficiaryForGift } = useGiftsState();
  const { updateSearchParams } = useWillSearchParams();
  const { backupExecutor, primaryExecutor, specialWishes } =
    useExecutorsState();

  const handleBack = () => {
    updateSearchParams('executors');
    decreaseWillMainStep();
  };

  return (
    <div className='w-full'>
      <WillTopHeading heading='Great job! You have finished filling out your will!' />

      <div className='mt-6 lg:mt-7 lg:max-w-[690px]'>
        <Accordion className='space-y-6' type='multiple'>
          <AccordionItem value='Family & Guardians'>
            <ReviewAccordionTrigger className='h3 mb-6 lg:font-bold'>
              Family & Guardians
            </ReviewAccordionTrigger>

            <AccordionContent className='max-w-[962px] text-[#010D04]'>
              <h2 className='mb-3 text-[16px] font-semibold leading-6'>
                Children Under 18
              </h2>

              {children.length ? (
                <div className='mb-8 rounded-lg border border-[#8D9395] p-5 lg:mb-9'>
                  {children.map(({ birthday, fullName, guardian }, index) => (
                    <Fragment key={`${fullName}-${index + 1}`}>
                      <FamilyReviewCard
                        subStep={0}
                        fullName={fullName}
                        birthday={birthday || ''}
                      />
                      <Separator className='mb-[14px] mt-5' />
                      <GuardianReviewCard
                        subStep={1}
                        familyMemberName={fullName}
                        guardian={guardian}
                      />
                      {children.length - 1 !== index && (
                        <Separator className='mb-[14px] mt-5' />
                      )}
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className='mb-8 text-sm'>You don&apos;t have children</p>
              )}

              <h2 className='mb-3 text-[16px] font-semibold leading-6'>Pets</h2>

              {pets.length ? (
                <div className='mb-8 rounded-lg border border-[#8D9395] p-5 lg:mb-9'>
                  {pets.map(({ fullName, guardian, petType }, index) => (
                    <Fragment key={`${fullName}-${index + 1}`}>
                      <FamilyReviewCard
                        subStep={2}
                        fullName={fullName}
                        petType={petType || ''}
                      />
                      <Separator className='mb-[14px] mt-5' />
                      <GuardianReviewCard
                        subStep={3}
                        familyMemberName={fullName}
                        guardian={guardian}
                      />
                      {pets.length - 1 !== index && (
                        <Separator className='mb-[14px] mt-5' />
                      )}
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className='mb-8 text-sm'>You don&apos;t have pets</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='Your Estate'>
            <ReviewAccordionTrigger className='h3 mb-6 lg:font-bold'>
              Your Estate
            </ReviewAccordionTrigger>

            <AccordionContent className='max-w-[962px] text-[#010D04]'>
              <h2 className='mb-3 text-[16px] font-semibold leading-6'>
                Beneficiaries
              </h2>

              {!beneficiaries.length || (
                <div className='rounded-lg border border-[#8D9395] p-5'>
                  {beneficiaries.map((item, index) => (
                    <Fragment key={`${item.fullName}-${item.id}`}>
                      <BeneficiaryReviewCard beneficiary={item} />

                      {beneficiaries.length - 1 !== index && (
                        <Separator className='mb-[14px] mt-5' />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='Leave Gifts'>
            <ReviewAccordionTrigger className='h3 mb-6 lg:font-bold'>
              Leave Gifts
            </ReviewAccordionTrigger>

            <AccordionContent className='max-w-[962px] text-[#010D04]'>
              <h2 className='mb-3 text-[16px] font-semibold leading-6'>
                Gifts
              </h2>

              {beneficiaryForGift.length ? (
                <div className='rounded-lg border border-[#8D9395] p-5'>
                  {beneficiaryForGift.map((item, index) => (
                    <Fragment key={`${item.fullName}-${item.id}`}>
                      <GiftReviewCard beneficiaryForGift={item} />

                      {beneficiaryForGift.length - 1 !== index && (
                        <Separator className='mb-[14px] mt-5' />
                      )}
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className='mb-8 text-sm'>You didn&apos;t add gifts</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className='border-none pb-0' value='Executors'>
            <ReviewAccordionTrigger className='h3 mb-6 lg:font-bold'>
              Executors
            </ReviewAccordionTrigger>

            <AccordionContent className='max-w-[962px] text-[#010D04]'>
              <h2 className='mb-3 text-[16px] font-semibold leading-6'>
                Executors
              </h2>

              {primaryExecutor?.fullName && (
                <div className='mb-8 rounded-lg border border-[#8D9395] p-5 lg:mb-9'>
                  {primaryExecutor?.fullName && (
                    <ExecutorReview
                      subStep={0}
                      fullName={primaryExecutor?.fullName}
                      type='Primary Executor'
                    />
                  )}

                  {backupExecutor?.fullName && (
                    <Separator className='mb-[14px] mt-5' />
                  )}

                  {backupExecutor?.fullName && (
                    <ExecutorReview
                      subStep={1}
                      fullName={backupExecutor?.fullName}
                      type='Backup Executor'
                    />
                  )}
                </div>
              )}

              <h2 className='mb-3 text-[16px] font-semibold leading-6'>
                Special wishes
              </h2>

              <div className='rounded-lg border border-[#8D9395] p-5'>
                <div>
                  <h3 className='mb-1 flex items-center justify-between text-sm'>
                    Do you have any special wishes?
                    <Button
                      onClick={() => {
                        setSubStep(3);
                        setWillMainStep(3);
                      }}
                      variant='ghost'
                      className='h-fit w-fit p-0'
                    >
                      <PencillFillIcon />
                    </Button>
                  </h3>

                  <p className='text-[16px] font-semibold leading-6'>
                    {specialWishes || "No, I don't have special wishes"}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='mt-8 flex justify-between gap-2 lg:mt-9'>
          <Button
            onClick={handleBack}
            variant='outline'
            className='h-[52px] w-[40%] text-lg font-semibold lg:w-[140px]'
          >
            <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
            Back
          </Button>

          <ConfirmDialog />
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;
