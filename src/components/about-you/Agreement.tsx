import ArrowRightIcon from '@/assets/icons/arrow-right';
import SuccessIcon from '@/assets/icons/success';
import { agreementListItems } from '@/constant/about';
import { useProgressStepStore } from '@/store/progress-steps';

import AgreeDialog from './AgreeDialog';
import ComplexNeedDialog from './ComplexNeedDialog';
import { Button } from '../ui/button';

function Agreement() {
  const { setCurrentAboutStep } = useProgressStepStore();
  return (
    <div>
      <Button
        onClick={() => setCurrentAboutStep(2)}
        variant='ghost'
        className='h-fit w-fit p-0 text-[16px] hover:bg-white'
      >
        <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
        Back
      </Button>

      <div className='mx-auto max-w-[900px]'>
        <h2 className='h2 mt-12'>Key Points to Consider When Using Timely</h2>

        <ul className='mt-[18px] space-y-2'>
          {agreementListItems.map((item) => (
            <li
              className='flex text-[16px] leading-6 text-[#010D0499] lg:items-center'
              key={item}
            >
              <SuccessIcon className='mr-[6px] shrink-0' />
              {item}
            </li>
          ))}
        </ul>

        <p className='mt-[18px] text-[#010D0499]'>
          <ComplexNeedDialog /> to see examples of a complex need
        </p>

        <AgreeDialog />
      </div>
    </div>
  );
}

export default Agreement;
