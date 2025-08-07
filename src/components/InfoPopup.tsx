'use client';

import React, { useState } from 'react';
import { IntercomProvider } from 'react-use-intercom';

import QuestionMarkIcon from '@/assets/icons/question-icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import InfoCard from './InfoCard';

type Props = {
  isShownMobile?: boolean;
};

function InfoPopup({ isShownMobile }: Props) {
  const [isOpenInfoCard, setIsOpenInfoCard] = useState(false);

  const toggelOpen = () => {
    setIsOpenInfoCard((prev) => !prev);
  };

  return (
    <IntercomProvider appId={process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string}>
      <Popover open={isOpenInfoCard} onOpenChange={setIsOpenInfoCard}>
        <PopoverTrigger
          className={cn(
            'hidden h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[16px] bg-bright shadow-custom-shadow lg:flex',
            `${isShownMobile ? 'flex h-10 w-10 rounded-full lg:hidden' : 'hidden'}`,
          )}
        >
          <QuestionMarkIcon className={isShownMobile ? 'h-8 w-8' : undefined} />
        </PopoverTrigger>
        <PopoverContent
          className='!w-fit rounded-[20px] border-0 p-0'
          side='top'
          align='end'
          sideOffset={isShownMobile ? -40 : -80}
        >
          <InfoCard toggelOpen={toggelOpen} />
        </PopoverContent>
      </Popover>
    </IntercomProvider>
  );
}

export default InfoPopup;
