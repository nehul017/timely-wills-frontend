import React from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useMedicalPOAReview from '@/hooks/medical-poa/useMedicalPOAReview';
import { getAgentOptions } from '@/utils';

type Props = {
  handleClickAgent: () => void;
  handleClickPower: () => void;
};

function AgentsPreviewCard({ handleClickAgent, handleClickPower }: Props) {
  const {
    alternatedAgent,
    designetedAgent,
    powersOptions,
    secondAlternatedAgent,
  } = useMedicalPOAReview();

  return (
    <>
      <article className='mb-[36px]'>
        <h2 className='mb-[14px] text-lg font-semibold lg:text-xl'>
          Designated Agent
        </h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          <div>
            <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
              Designated Agent
              <Button
                onClick={handleClickAgent}
                variant='ghost'
                className='h-fit w-fit p-0'
              >
                <PencillFillIcon />
              </Button>
            </h3>

            <div className='flex flex-col space-y-4'>
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
            {alternatedAgent.fullName && (
              <Separator className='mb-[14px] mt-5' />
            )}
          </div>

          {alternatedAgent.fullName && (
            <div className='mt-[14px]'>
              <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
                Designated Alternate Agent
                <Button
                  onClick={handleClickAgent}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </h3>

              <div className='flex flex-col space-y-4'>
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
              {secondAlternatedAgent.fullName && (
                <Separator className='mb-[14px] mt-5' />
              )}
            </div>
          )}

          {secondAlternatedAgent.fullName && (
            <div className='mt-[14px]'>
              <h3 className='mb-[18px] flex items-center justify-between text-xl font-bold lg:text-[22px]'>
                Designated Alternate Agent #2
                <Button
                  onClick={handleClickAgent}
                  variant='ghost'
                  className='h-fit w-fit p-0'
                >
                  <PencillFillIcon />
                </Button>
              </h3>

              <div className='flex flex-col space-y-4'>
                {getAgentOptions(secondAlternatedAgent).map(
                  ({ id, key, value }) => (
                    <p
                      key={id}
                      className={`${value ? 'flex flex-col space-y-1' : 'hidden'}`}
                    >
                      <span className='text-sm'>{key}</span>
                      <span className='text-[16px] font-semibold'>{value}</span>
                    </p>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </article>

      <article className='mb-[36px]'>
        <h2 className='mb-[14px] text-sm font-semibold lg:text-xl'>
          Agent Powers
        </h2>

        <div className='rounded-lg border border-[#8D9395] p-5'>
          {powersOptions.map(({ answer, id, question }, i) => (
            <div key={id}>
              <p className='mb-0 flex flex-col space-y-1'>
                <span className='flex justify-between gap-[14px]'>
                  <span className='max-w-[614px] text-sm'>{question}</span>
                  <span className='flex justify-between text-sm'>
                    <Button
                      onClick={handleClickPower}
                      variant='ghost'
                      className='h-fit w-fit p-0'
                    >
                      <PencillFillIcon />
                    </Button>
                  </span>
                </span>
                <span className='text-[16px] font-semibold'>{answer}</span>
              </p>
              {i !== powersOptions.length - 1 && (
                <Separator className='mb-[14px] mt-5' />
              )}
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

export default AgentsPreviewCard;
