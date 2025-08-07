import React, { useEffect } from 'react';
import { useIntercom } from 'react-use-intercom';

import CloseIcon from '@/assets/icons/close-icon';
import { useAboutStore } from '@/store/about';
import { useAuthStore } from '@/store/user-info';

import { Button } from './ui/button';
import { Separator } from './ui/separator';

type Props = {
  toggelOpen: () => void;
};

function InfoCard({ toggelOpen }: Props) {
  const { boot, shutdown, show } = useIntercom();
  const { firstName } = useAboutStore();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    if (userInfo && firstName) {
      boot({
        hideDefaultLauncher: true,
        userId: `${userInfo.id}`,
        email: userInfo.email,
        name: firstName,
      });
    }
    return () => {
      shutdown();
    };
  }, [boot, firstName, shutdown, userInfo]);

  const handleOpenIntercom = () => {
    show();
  };

  return (
    <div className='box-border w-[340px] space-y-2 rounded-[20px] border border-bright bg-[#DBFFE5] p-6 shadow-custom-shadow lg:w-[372px]'>
      <div className='flex justify-between'>
        <h4 className='!mb-[14px] text-[22px] font-bold'>Have questions?</h4>

        <Button
          onClick={toggelOpen}
          variant='ghost'
          className='h-fit w-fit p-0 hover:bg-[#DBFFE5]'
        >
          <CloseIcon fill='#636B65' className='h-[22px] w-[22px]' />
        </Button>
      </div>

      {/* <div className='text-[16px]'>
        <span className='font-semibold'>Live Chat: </span>
        <Button
          variant='link'
          className='h-fit w-fit p-0 font-normal'
          onClick={handleOpenIntercom}
        >
          (click here)
        </Button>
      </div> */}

      <div className='text-[16px]'>
        <span className='font-semibold'>Email us: </span>
        <span>support@withtimely.com</span>
      </div>

      {/* <div className='text-[16px]'>
        <span className='font-semibold'>Request a call: </span>
        <span>
          Schedule a{' '}
          <a
            href='https://calendly.com/withtimely-support/30min'
            className='underline'
            target='_blank'
            rel='noreferrer'
          >
            call here
          </a>
        </span>
      </div> */}

      <Separator className='bg-[#8D9395]' />

      <p className='text-[14px] font-normal'>
        Our business support hours are Monday - Friday,{' '}
        <span className='font-semibold'>11am-7pm EST</span>. We are available
        via phone, email, & chat during these hours.
      </p>
    </div>
  );
}

export default InfoCard;
