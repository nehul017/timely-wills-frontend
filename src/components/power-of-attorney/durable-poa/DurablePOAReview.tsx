'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { agentsPowersQuestions } from '@/constant/poa';
import useDurableRequestBody from '@/hooks/durable-poa/use-durable-request-body';
import durablePoaAPI from '@/services/durable-poa';
import {
  useDurablePOAAgentPowersStore,
  useDurablePOAdesignatedAgentStore,
} from '@/store/durable-poa';
import { useProgressStepStore } from '@/store/progress-steps';
import { getAgentOptions } from '@/utils';

import SubmitDialog from '../SubmitDialog';

function DurablePOAReview() {
  const [isLoading, setIsLoading] = useState(false);
  const { alternatedAgent, designetedAgent, becomeEffectivePOA, updateUrl } =
    useDurablePOAdesignatedAgentStore();
  const { durableBody, durableId } = useDurableRequestBody();
  const {
    durableStep,
    decreaseDurableStep,
    setDurableStep,
    increaseDurableStep,
  } = useProgressStepStore();
  const { powers } = useDurablePOAAgentPowersStore();
  const powersValues = Object.values(powers);
  const router = useRouter();

  const powersOptions = agentsPowersQuestions.map((item, i) => ({
    key: item,
    value: powersValues[i],
  }));

  const handleBack = () => {
    if (!durableStep) {
      router.back();
      return;
    }

    decreaseDurableStep();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let fileUrl: string | null = null;
      const res = await durablePoaAPI.getDurablePOA();

      if (res) {
        const result = await Promise.all([
          durablePoaAPI.updateDurablePOA(durableId as number, durableBody),
          durablePoaAPI.generateFile(durableId as number),
        ]);

        fileUrl = result[1];
      } else {
        const res = await durablePoaAPI.createDurablePOA(durableBody);

        if (res) {
          fileUrl = await durablePoaAPI.generateFile(res.id);
        }
      }

      updateUrl(fileUrl);
      increaseDurableStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full text-[#010D04] lg:w-[690px]'>
      <p className='mb-6 text-[22px] font-bold lg:text-2xl'>
        Let’s review your answers quickly
      </p>

      <article className='mb-[36px]'>
        <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>
          Designated Agent
        </h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          <div>
            <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
              Designated Agent
              <Button
                onClick={() => setDurableStep(0)}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </h3>

            <div className='mb-5 flex flex-col space-y-4'>
              {getAgentOptions(designetedAgent).map(({ id, key, value }) => (
                <p
                  key={id}
                  className={`${value ? 'flex flex-col space-y-1' : 'hidden'}`}
                >
                  <span className='text-sm'>{key}</span>
                  <span className='text-[16px] font-semibold'>{value}</span>
                </p>
              ))}
            </div>

            <Separator />
          </div>

          {alternatedAgent.fullName && (
            <div className='mt-[14px]'>
              <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
                Designated Alternate Agent
                <Button
                  onClick={() => setDurableStep(0)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </h3>

              <div className='mb-5 flex flex-col space-y-4'>
                {getAgentOptions(alternatedAgent).map(({ id, key, value }) => (
                  <p
                    key={id}
                    className={`${value ? 'flex flex-col space-y-1' : 'hidden'}`}
                  >
                    <span className='text-sm'>{key}</span>
                    <span className='text-[16px] font-semibold'>{value}</span>
                  </p>
                ))}
              </div>

              <Separator />
            </div>
          )}

          <div className='mt-[14px]'>
            <p className='flex flex-col space-y-1'>
              <span className='flex items-center justify-between text-sm'>
                When do you want this power of attorney to become effective?
                <Button
                  onClick={() => setDurableStep(0)}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </span>
              <span className='text-[16px] font-semibold'>
                {becomeEffectivePOA}
              </span>
            </p>
          </div>
        </div>
      </article>

      <article>
        <h2 className='mb-[14px] text-sm font-semibold lg:text-xl'>
          Powers you wish to grant
        </h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          {powersOptions.map(({ key, value }) => (
            <div key={key} className={`${value}` ? 'block' : 'hidden'}>
              <p className='mb-0 flex flex-col space-y-1'>
                <span className='flex justify-between gap-[14px]'>
                  <span className='max-w-[614px] text-sm'>{key}</span>
                  <span className='flex justify-between text-sm'>
                    <Button
                      onClick={() => setDurableStep(1)}
                      variant='ghost'
                      className='h-fit w-fit p-0'
                    >
                      <PencillFillIcon />
                    </Button>
                  </span>
                </span>
                <span className='text-[16px] font-semibold'>
                  {value ? 'Yes' : 'No'}
                </span>
              </p>
              <Separator className='mb-[14px] mt-5' />
            </div>
          ))}

          <p className='flex flex-col space-y-1'>
            <span className='flex items-center justify-between text-sm'>
              Would you like to put any restrictions on your agent(s)?
              <Button
                onClick={() => setDurableStep(1)}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </span>
            <span className='text-[16px] font-semibold'>
              {powers.restrictions || 'No'}
            </span>
          </p>

          {powers.guardian.fullName && (
            <Separator className='!mb-[14px] !mt-5 !h-[1px]' />
          )}

          {powers.guardian.fullName && (
            <div>
              <p className='mb-0 flex flex-col space-y-1'>
                <span className='flex justify-between gap-[14px]'>
                  <span className='max-w-[614px] text-sm'>
                    Would you like to nominate a guardian of your person and
                    estate?
                  </span>
                  <Button
                    onClick={() => setDurableStep(1)}
                    variant='ghost'
                    className='h-fit w-fit p-0'
                  >
                    <PencillFillIcon />
                  </Button>
                </span>
                <span className='text-[16px] font-semibold'>
                  {Object.values(powers.guardian)
                    .filter((item) => item)
                    .join(', ')}
                </span>
              </p>
            </div>
          )}
        </div>
      </article>

      <div className='mt-8 flex justify-between gap-2 lg:mt-[36px]'>
        <Button
          type='button'
          onClick={handleBack}
          variant='outline'
          className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
        >
          <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
          Back
        </Button>

        <SubmitDialog
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          document='Durable'
        />
      </div>
    </section>
  );
}

export default DurablePOAReview;
