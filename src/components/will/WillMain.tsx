'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import BagIcon from '@/assets/icons/bag-icon';
import DocumentIcon from '@/assets/icons/document-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import WillIcon from '@/assets/icons/will-icon';
import Footer from '@/components/Footer';
import InfoPopup from '@/components/InfoPopup';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { accordionOptions } from '@/constant/will';
import useFetchAbout from '@/hooks/about/use-fetch-about';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useFetchWill from '@/hooks/will/use-fetch-will';
import useWillProgressInfo from '@/hooks/will/use-will-progress-info';
import { useAboutStore } from '@/store/about';
import { useAuthStore } from '@/store/user-info';

import InvitationFormDialog from './InvitationFormDialog';
import AboutYouSecondDialog from '../power-of-attorney/AboutYouSecondDialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio';

function WillMain() {
  const router = useRouter();
  const { fetchWill } = useFetchWill();
  const { userInfo } = useAuthStore();
  const { progress } = useWillProgressInfo();
  const { fetchAbout } = useFetchAbout();
  const { firstName } = useAboutStore();
  const { currentWillSection } = useWillSearchParams();

  const isBoughtWill = userInfo?.products?.some(
    (item) => item.product_type === 'WILL',
  );

  useEffect(() => {
    fetchWill();
    fetchAbout();
  }, []);

  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <InvitationFormDialog />

        <article className='mt-12 lg:flex lg:justify-between'>
          <div>
            <h2 className='mb-3 text-4xl font-bold'>
              <span className='text-bright'>Hey</span>{' '}
              {`${firstName || 'user'}!`}
            </h2>

            <p className='text-[16px] lg:font-medium'>
              Here’s an overview of your will questionnaire
            </p>
          </div>

          <InfoPopup />
        </article>

        <article className='mt-8 lg:mt-12'>
          <div className='mb-6 lg:mb-[18px] lg:flex lg:justify-between'>
            <h2 className='mb-[18px] self-end text-lg font-semibold lg:mb-0 lg:text-[22px]'>
              Documents
            </h2>

            <Button
              onClick={() =>
                router.push(
                  isBoughtWill
                    ? '/digital-vault'
                    : '/will/checkout?download=true',
                )
              }
              variant='outline'
              className='h-[52px] w-full border-[#8D9395] bg-transparent text-lg font-semibold lg:w-[259px]'
            >
              {isBoughtWill ? (
                <DocumentIcon className='mr-1 h-[18px] w-[15px]' />
              ) : (
                <BagIcon className='mr-1' />
              )}
              {isBoughtWill ? 'Created documents' : 'Go to checkout'}
            </Button>
          </div>

          <div className='card-wrapper flex w-full flex-col gap-[14px] hover:ring-2 hover:ring-[#25D99880] lg:flex-row lg:items-center lg:gap-[54px]'>
            <div className='flex max-w-[220px] items-center gap-6 lg:block lg:max-w-[192px]'>
              <WillIcon className='shrink-0 lg:mx-auto lg:mb-6 lg:h-[94px] lg:w-[77px]' />
              <p className='text-start text-[16px] font-semibold lg:text-center lg:text-lg'>
                {`${progress}% of your Will is complete`}
              </p>
            </div>

            <div className='max-w-[680px]'>
              <Progress className='mb-[14px] lg:mb-6' value={progress || 2} />
              <h3 className='mb-[10px] text-xl font-semibold leading-7 lg:text-[24px] lg:leading-9'>
                <span className='flex items-center'>
                  Your Will
                  {progress === 100 && (
                    <RadioGroup>
                      <RadioGroupItem
                        value='completed'
                        className='ml-1'
                        checked
                      />
                    </RadioGroup>
                  )}
                </span>
              </h3>
              <p className='mb-[14px] text-sm lg:mb-6'>
                We&apos;ll guide you through a list of simple questions crafted
                by US Attorneys to help you create your own Will. This process
                has been simplified, so that you can do it on any computer or
                even from your phone.
              </p>

              {firstName ? (
                <Link
                  href={
                    isBoughtWill
                      ? `/will?section=${currentWillSection}`
                      : `/will/checkout`
                  }
                  className='flex items-center'
                >
                  {progress === 100 && (
                    <PencillFillIcon fill='#25D998' className='mr-1' />
                  )}
                  <span className='block text-lg font-semibold text-bright'>
                    {progress < 100 && progress > 0
                      ? 'Continue Questionnaire'
                      : progress === 100
                        ? 'Edit Document'
                        : 'Create Document'}
                  </span>

                  {progress !== 100 && (
                    <ArrowRightIcon fill='#25D998' className='ml-1' />
                  )}
                </Link>
              ) : (
                <AboutYouSecondDialog />
              )}
            </div>
          </div>
        </article>

        <article className='mt-8 lg:mt-12'>
          <h2 className='text-[22px] font-semibold'>
            Frequently Asked Questions
          </h2>

          <div className='card-wrapper mt-[18px]'>
            <div className='max-w-[1114px]'>
              <Accordion
                className='flex flex-col gap-6 lg:gap-[14px]'
                type='multiple'
              >
                {accordionOptions.map(({ description, id, title }) => (
                  <AccordionItem
                    key={id}
                    value={`item-${id}`}
                    className={id === 2 ? 'border-none pb-0' : ''}
                  >
                    <AccordionTrigger>{title}</AccordionTrigger>

                    <AccordionContent className='max-w-[962px]'>
                      {description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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

export default WillMain;
