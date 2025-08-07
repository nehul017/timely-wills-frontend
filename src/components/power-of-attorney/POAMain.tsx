'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import DocumentIcon from '@/assets/icons/document-icon';
import { accordionOptions } from '@/constant/poa';
import useFetchDurablePOA from '@/hooks/durable-poa/use-fetch-durable-poa';
import useFetchHealthCare from '@/hooks/health-care/use-fetch-health-care';
import useFetchLivingWill from '@/hooks/living-will/use-fetch-living-will';
import useFetchMedicalPOA from '@/hooks/medical-poa/use-fetch-medical-poa';
import { useAboutStore } from '@/store/about';

import DocumentCards from './DocumentCards';
import Footer from '../Footer';
import InfoPopup from '../InfoPopup';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';

function POAMain() {
  const { fetchDurable } = useFetchDurablePOA();
  const { fetchLivingWill } = useFetchLivingWill();
  const { fetchMedicalPOA } = useFetchMedicalPOA();
  const { fetchHealthCare } = useFetchHealthCare();
  const { firstName } = useAboutStore();
  const router = useRouter();

  useEffect(() => {
    fetchDurable();
    fetchLivingWill();
    fetchMedicalPOA();
    fetchHealthCare();
  }, []);

  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <article className='mt-12 lg:flex lg:justify-between'>
          <div>
            <h2 className='mb-3 text-4xl font-bold'>
              <span className='text-bright'>Hey</span>{' '}
              {`${firstName || 'user'}!`}
            </h2>

            <p className='text-[16px] lg:font-medium'>
              Here’s an overview of your Power of Attorneys
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
              onClick={() => router.push('/digital-vault')}
              variant='outline'
              className='h-[52px] w-full border-[#8D9395] bg-transparent text-lg font-semibold lg:w-[259px]'
            >
              <DocumentIcon className='mr-1 h-[18px] w-[15px]' />
              Created documents
            </Button>
          </div>

          <DocumentCards />
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

export default memo(POAMain);
