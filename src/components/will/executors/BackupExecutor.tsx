'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import CrossIcon from '@/assets/icons/cross-icon';
import FormWrapper from '@/components/FormWrapper';
import InfoPopup from '@/components/InfoPopup';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { executorSchema } from '@/schemas/will/executors';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useExecutorsState } from '@/store/will/executor';
import { ExecutorFormData } from '@/types';
import { shouldCallAPI } from '@/utils';

import ExecutorDescription from './ExecutorDescription';
import FormFields from './FormFields';

function BackupExecutor() {
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { increaseSubStep, decreaseSubStep } = useProgressStepStore();
  const { backupExecutor, setBackupExecutor } = useExecutorsState();
  const router = useRouter();

  const defaultData = {
    address: backupExecutor?.address || '',
    email: backupExecutor?.email || '',
    fullName: backupExecutor?.fullName || '',
    personType: backupExecutor?.personType || '',
    isOver18: !!backupExecutor?.fullName,
  };
  const methods = useForm<ExecutorFormData>({
    resolver: zodResolver(executorSchema),
    defaultValues: { ...defaultData },
  });

  const { getValues, trigger } = methods;

  const submitData = async (
    data: ExecutorFormData,
    isNotRedirect?: boolean,
  ) => {
    const res = await willAPI.getWill();
    const { isOver18, ...executor } = data;
    const bodyForRequest: Partial<WillRequestBody> = {
      backupExecutor: {
        ...executor,
        email: executor.email || null,
      },
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, bodyForRequest);
      } else {
        await willAPI.createWill(bodyForRequest);
      }

      if (!isNotRedirect) {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    const { isOver18, ...executor } = getValues();

    if (!shouldCallAPI(getValues(), defaultData)) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        setBackupExecutor({ ...executor, email: executor.email || null });
        increaseSubStep();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseSubStep();
    }
  };

  const handleBack = () => {
    decreaseSubStep();
  };

  const handleRemoveBackupExecutor = async () => {
    const res = await willAPI.getWill();

    if (res.backupExecutor) {
      try {
        await willAPI.updateWill(res.id, { backupExecutor: null });
      } catch (error) {
        console.error(error);
      }
    }

    increaseSubStep();
    setBackupExecutor(null);
  };

  const onSubmit = async (data: ExecutorFormData) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>Who do you choose as your backup executor?</h2>
        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <ExecutorDescription title='Backup executor’s are optional:'>
          <p className='text-sm text-[#010D0499] lg:ml-8'>
            In the unlikely event that your primary Executor passes away before
            you or is otherwise unable to fulfill their duties, a backup
            Executor can be designated in your Will to manage your estate.
            Appointing a backup Executor ensures the smooth administration of
            your estate under any circumstances.
          </p>
        </ExecutorDescription>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              isNextLoading={isNextLoading}
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
            >
              <h3 className='h3 mb-6 mt-8 lg:mt-9'>Backup executor</h3>

              <FormFields methods={methods} />

              <Button
                type='button'
                className='!mt-6 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:bg-transparent hover:text-bright'
                variant='ghost'
                onClick={handleRemoveBackupExecutor}
              >
                <CrossIcon className='mr-1 h-[22px] w-[22px] rotate-45' />I
                don’t want a backup executor
              </Button>
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BackupExecutor;
