'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import SaveIcon from '@/assets/icons/save-icon';
import { Button } from '@/components/ui/button';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import estateAPI from '@/services/estate';
import willAPI from '@/services/will';
import { WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useEstateState } from '@/store/will/estate';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';

import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryList from './BeneficiaryList';
import CharityForm from './CharityForm';
import DialogForm from './DialogForm';
import EstateDialog from './EstateDialog';
import WillTopHeading from '../WillTopHeading';

function Inheritors() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenPersonForm, setIsOpenPersonForm] = useState(false);
  const [isOpenChariryForm, setIsOpenChariryForm] = useState(false);
  const { increaseSubStep, setWillMainStep, decreaseWillMainStep, setSubStep } =
    useProgressStepStore();
  const { beneficiaries, setEntireBeneficiaries, setIsCompletedEstateSection } =
    useEstateState();
  const { pets } = useFamilyMembersState();
  const { updateSearchParams } = useWillSearchParams();
  const { willRequestBody } = useWillRequestBody();

  const router = useRouter();

  const isAllCharity = beneficiaries.every((item) => item.type === 'charity');
  const isAllWithBackup = beneficiaries
    .filter((b) => b.type === 'person')
    .every((b) => b.backupType);
  const totalEstate = Math.round(
    beneficiaries.reduce((curr, accum) => curr + accum.percent, 0),
  );

  const checkValidation = () => {
    const isAllHasEstate = beneficiaries.some((item) => !item.percent);

    if (!beneficiaries.length) {
      setErrorMessage('Must add at least 1 beneficiary.');
      return false;
    }

    if (totalEstate > 100 || totalEstate < 99.9) {
      setErrorMessage('The total for all beneficiaries should add up to 100%.');
      return false;
    }

    if (isAllHasEstate) {
      setErrorMessage('Each beneficiary should have estate.');
      return false;
    }

    return true;
  };

  const handleDistribute = () => {
    const percent = Math.round((100 / beneficiaries.length) * 100) / 100;
    const updatedBeneficiaries = beneficiaries.map((item) => ({
      ...item,
      percent,
    }));

    setEntireBeneficiaries(updatedBeneficiaries);
  };

  const handleNext = async () => {
    if (checkValidation()) {
      try {
        await Promise.all(
          beneficiaries.map((item) =>
            estateAPI.update(item.id, { percent: item.percent }),
          ),
        );

        if (isAllCharity) {
          setWillMainStep(2);
          updateSearchParams('gifts');
          setIsCompletedEstateSection(true);
        } else {
          increaseSubStep();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBack = () => {
    decreaseWillMainStep();
    setSubStep(pets.length ? 3 : 2);
    updateSearchParams('family');
  };

  const onSubmit = async () => {
    if (checkValidation()) {
      setIsLoading(true);

      const body: WillRequestBody = {
        ...willRequestBody,
        isCompletedEstateSection: isAllCharity && isAllWithBackup,
      };

      try {
        await Promise.all(
          beneficiaries.map((item) =>
            estateAPI.update(item.id, { percent: item.percent }),
          ),
        );

        const res = await willAPI.getWill();

        if (res) {
          await willAPI.updateWill(res.id, body);
        } else {
          await willAPI.createWill(body);
        }

        router.push('/');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='w-full'>
      <WillTopHeading
        heading='Who would you like to inherit your estate?'
        description='Add people or charities who will receive a percentage of your estate and use the percentage field to adjust how much each beneficiary will receive. The total for all beneficiaries should add up to 100%.'
      />

      <EstateDialog />

      <div className='lg:max-w-[690px]'>
        {!beneficiaries.length || (
          <div className='mt-6 rounded-lg border border-[#8D9395]'>
            <div
              className={`flex h-fit flex-col rounded-t-lg lg:h-[99px] lg:flex-row lg:items-center lg:justify-between ${totalEstate >= 99.9 && totalEstate <= 100 ? 'bg-[#DBFFE5B2]' : 'bg-[#F7F7F7]'} p-5`}
            >
              <div>
                <span
                  className={`h3 mb-2 ${totalEstate > 100 ? 'text-danger' : 'text-bright'}`}
                >{`${Math.round(totalEstate)}%`}</span>
                <h2
                  className={`text-sm ${totalEstate > 100 ? 'text-danger' : undefined}`}
                >
                  The total for all beneficiaries should add up to 100%.
                </h2>
              </div>

              {beneficiaries.length > 1 && (
                <Button
                  onClick={handleDistribute}
                  variant='link'
                  className='mt-2 h-fit w-fit p-0 text-[16px] font-semibold text-bright hover:no-underline lg:mt-0'
                >
                  Distribute Equally
                </Button>
              )}
            </div>

            <BeneficiaryList beneficiaries={beneficiaries} />
          </div>
        )}

        <DialogForm
          title='Add a person'
          isOpen={isOpenPersonForm}
          openDialog={setIsOpenPersonForm}
        >
          <BeneficiaryForm
            setErrorMessage={setErrorMessage}
            setIsOpenForm={setIsOpenPersonForm}
          />
        </DialogForm>

        <DialogForm
          title='Add a charity'
          isOpen={isOpenChariryForm}
          openDialog={setIsOpenChariryForm}
        >
          <CharityForm
            setErrorMessage={setErrorMessage}
            setIsOpenForm={setIsOpenChariryForm}
          />
        </DialogForm>

        {errorMessage && (
          <p className='mt-2 text-xs text-danger'>{errorMessage}</p>
        )}

        <div className='mt-8 flex justify-between gap-2 lg:mt-9'>
          <Button
            type='button'
            onClick={handleBack}
            variant='outline'
            className='h-[52px] w-full text-lg font-semibold lg:w-[140px]'
          >
            <ArrowRightIcon className='mr-1 rotate-180' fill='#010D04' />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[200px]'
          >
            Next
          </Button>
        </div>

        <Button
          isLoading={isLoading}
          onClick={onSubmit}
          className='mt-6 min-h-[40px] min-w-[140px] border-none p-0 text-lg font-semibold text-bright hover:bg-white'
          variant='outline'
        >
          <SaveIcon className='mr-1' /> Save and exit
        </Button>
      </div>
    </div>
  );
}

export default Inheritors;
