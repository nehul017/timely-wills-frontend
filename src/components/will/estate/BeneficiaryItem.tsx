import { Minus, Plus } from 'lucide-react';
import React, { memo, ReactNode, useState } from 'react';

import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEstateState } from '@/store/will/estate';
import { Beneficiary } from '@/store/will/estate/types';

import BeneficiaryForm from './BeneficiaryForm';
import CharityForm from './CharityForm';

type Props = {
  beneficiary: Beneficiary;
  children?: ReactNode;
};

function BeneficiaryItem({ beneficiary, children }: Props) {
  const [isOpenForm, setIsOpenForm] = useState(false);

  const { updateBeneficiaries, setBeneficiaryToUpdate } = useEstateState();
  const { fullName, percent, type } = beneficiary;

  const handleAdd = () => {
    if (percent >= 100) return;

    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      percent: percent + 5,
    };

    updateBeneficiaries(newBeneficiary);
  };

  const handleSubtract = () => {
    if (percent - 5 < 0) return;

    const newBeneficiary = {
      ...beneficiary,
      percent: percent - 5,
    };

    updateBeneficiaries({ ...newBeneficiary });
  };

  const handleUpdate = () => {
    setBeneficiaryToUpdate({ ...beneficiary });
  };

  return (
    <li className='flex items-center justify-between'>
      <span className='text-[16px] font-semibold lg:text-lg'>{fullName}</span>

      <div className='flex items-center gap-[14px] lg:gap-8'>
        <div className='flex items-center justify-between gap-2 rounded-lg bg-[#F7F7F7] px-2 py-1'>
          <Button
            onClick={handleSubtract}
            variant='ghost'
            className='h-fit w-fit p-0'
            isDisable={!!children}
          >
            <Minus className='h-[22px] w-[22px]' />
          </Button>
          <span className='block w-fit rounded-sm border border-[#DEE0DF] bg-white px-[14px] py-[6px] text-[16px] font-semibold'>
            {`${Math.round(100 * percent) / 100}%`}
          </span>
          <Button
            onClick={handleAdd}
            variant='ghost'
            className='h-fit w-fit p-0'
            isDisable={!!children}
          >
            <Plus className='h-[22px] w-[22px]' />
          </Button>
        </div>

        {!children ? (
          <Dialog onOpenChange={setIsOpenForm} open={isOpenForm}>
            <DialogTrigger onClick={handleUpdate} className='h-fit w-fit p-0'>
              <PencillFillIcon />
            </DialogTrigger>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Update</DialogTitle>
              <DialogDescription className='sr-only'>
                Update your beneficiary
              </DialogDescription>
              {type === 'charity' ? (
                <CharityForm setIsOpenForm={setIsOpenForm} isDeleteButton />
              ) : (
                <BeneficiaryForm setIsOpenForm={setIsOpenForm} isDeleteButton />
              )}
            </DialogContent>
          </Dialog>
        ) : (
          children
        )}
      </div>
    </li>
  );
}

export default memo(BeneficiaryItem);
