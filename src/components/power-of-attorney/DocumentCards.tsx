import Link from 'next/link';
import { useEffect } from 'react';

import HealthIcon from '@/assets/icons/health-icon';
import MoneyIcon from '@/assets/icons/money-icon';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import useFetchAbout from '@/hooks/about/use-fetch-about';
import { useAboutStore } from '@/store/about';
import { useDurablePOAdesignatedAgentStore } from '@/store/durable-poa';
import { useHealthCareStore } from '@/store/health-care';
import { useMedicalPOAAgentStore } from '@/store/medical-poa';

import AboutYouSecondDialog from './AboutYouSecondDialog';
import DurablePOADialog from './DurablePOADialog';
import HealthCareDialog from './HealthCareDialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio';

function DocumentCards() {
  const { url: durableUrl } = useDurablePOAdesignatedAgentStore();
  const { url: medicalUrl } = useMedicalPOAAgentStore();
  const { fetchAbout } = useFetchAbout();
  const { firstName } = useAboutStore();
  const { id: healthCareId } = useHealthCareStore();

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
      <div className='card-wrapper flex w-full flex-col gap-[14px] hover:ring-2 hover:ring-[#25D99880] lg:w-[584px] lg:flex-row lg:items-center lg:gap-[27px]'>
        <div className='order-2 w-full lg:order-1 lg:max-w-[370px]'>
          <h3 className='mb-[10px] flex items-center text-[20px] font-semibold lg:text-2xl'>
            Durable POA
            {durableUrl && (
              <RadioGroup>
                <RadioGroupItem value='completed' className='ml-1' checked />
              </RadioGroup>
            )}
          </h3>
          <p className='mb-[14px] text-sm lg:mb-6'>
            A Durable Financial Power of Attorney allows someone you trust to
            manage your financial affairs if you become unable to do so
            yourself.
          </p>

          {!firstName ? (
            <AboutYouSecondDialog />
          ) : !durableUrl ? (
            <DurablePOADialog />
          ) : (
            <Link
              href='/Power-of-attorney/Durable-POA'
              className='flex items-center text-lg font-semibold text-bright'
            >
              <PencillFillIcon className='mr-1' fill='#25D998' />
              Edit Document
            </Link>
          )}
        </div>

        <div className='order-1 lg:order-2'>
          <MoneyIcon className='h-[64px] w-[68px] lg:h-[94px] lg:w-[100px]' />
        </div>
      </div>

      <div className='card-wrapper flex w-full flex-col gap-[14px] hover:ring-2 hover:ring-[#25D99880] lg:w-[584px] lg:flex-row lg:items-center lg:gap-[27px]'>
        <div className='order-2 w-full lg:order-1 lg:max-w-[370px]'>
          <h3 className='mb-[10px] flex items-center text-[20px] font-semibold lg:text-2xl'>
            Health Care Directives
            {medicalUrl && (
              <RadioGroup>
                <RadioGroupItem value='completed' className='ml-1' checked />
              </RadioGroup>
            )}
          </h3>

          <p className='mb-[14px] text-sm lg:mb-6'>
            A Health Care Directive allows someone you trust to make medical
            decisions on your behalf if you become unable to do so yourself.
          </p>

          {!firstName ? (
            <AboutYouSecondDialog />
          ) : medicalUrl ? (
            <Link
              href={`/Power-of-attorney/Health-Care-Directives/${healthCareId ? 'Medical-POA-and-Living-Will' : 'Medical-POA'}`}
              className='flex items-center text-lg font-semibold text-bright'
            >
              <PencillFillIcon className='mr-1' fill='#25D998' />
              Edit Document
            </Link>
          ) : (
            <HealthCareDialog />
          )}
        </div>

        <div className='order-1 lg:order-2'>
          <HealthIcon className='h-[64px] w-[68px] lg:h-[94px] lg:w-[100px]' />
        </div>
      </div>
    </div>
  );
}

export default DocumentCards;
