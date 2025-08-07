'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import aboutAPI from '@/services/about';
import { AboutBody } from '@/services/about/types';
import { useAboutStore } from '@/store/about';
import { useProgressStepStore } from '@/store/progress-steps';

import { Button } from '../ui/button';

function ReviewAbout() {
  const [isLoading, setIsloading] = useState(false);
  const { aboutStep, setCurrentAboutStep, decreaseAboutStep } =
    useProgressStepStore();
  const router = useRouter();
  const {
    address,
    birthday,
    firstName,
    lastName,
    partner,
    phoneNumber,
    status,
    id,
    middleName,
    state,
  } = useAboutStore();

  const answers = [
    { id: 1, step: 0, key: 'Full name:', value: `${firstName} ${lastName}` },
    { id: 2, step: 0, key: 'Phone number: ', value: phoneNumber },
    { id: 3, step: 1, key: 'Date of birth:', value: birthday },
    {
      id: 4,
      step: 2,
      key: 'Current Address:',
      value: Object.values(address)
        .filter((item) => item)
        .join(', '),
    },
    { id: 5, step: 3, key: 'Relationship status:', value: status },
    { id: 6, step: 3, key: 'Partners name:', value: partner.fullName },
  ];

  const onSubmit = async () => {
    setIsloading(true);

    const body: AboutBody = {
      address,
      county: address.county,
      dateOfBirth: dayjs(birthday).format('YYYY-MM-DD'),
      firstName,
      lastName,
      midleName: middleName,
      partnerEmail: partner.email || null,
      partnerName: partner.fullName || null,
      partnerStatus: status.toLowerCase(),
      phoneNumber,
      state,
    };

    try {
      const res = await aboutAPI.getAbout();

      if (res) {
        await aboutAPI.updateAbout(id as number, body);
      } else {
        await aboutAPI.createAbout(body);
      }

      router.push('/Power-of-attorney');
      setCurrentAboutStep(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  return aboutStep === 4 ? (
    <div className='lg:w-[690px]'>
      <h2 className='h2 mb-6 leading-8 lg:leading-9'>
        Let’s review your answers quickly
      </h2>

      <div className='space-y-6'>
        {answers.map(({ id, key, value, step }) => (
          <div
            key={id}
            className={`${value ? 'flex' : 'hidden'} items-center justify-between gap-5 rounded-lg border border-[#8D9395] p-5`}
          >
            <div>
              <h3 className='mb-1 text-sm'>{key}</h3>
              <p className='text-[16px] font-semibold leading-6'>{value}</p>
            </div>
            <Button
              onClick={() => setCurrentAboutStep(step)}
              variant='ghost'
              className='h-fit w-fit p-0'
            >
              <PencillFillIcon />
            </Button>
          </div>
        ))}
      </div>

      <div className='mt-8 flex justify-between gap-2 lg:mt-9'>
        <Button
          type='button'
          onClick={decreaseAboutStep}
          variant='outline'
          className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
        >
          <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
          Back
        </Button>

        <Button
          isLoading={isLoading}
          onClick={onSubmit}
          className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
        >
          Save & finish
        </Button>
      </div>
    </div>
  ) : null;
}

export default ReviewAbout;
