'use client';

import React, { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import { Beneficiary } from '@/store/will/estate/types';

import BeneficiaryItem from './BeneficiaryItem';

type Props = {
  beneficiaries: Beneficiary[];
};

function BeneficiaryList({ beneficiaries }: Props) {
  return (
    <ul className='p-5'>
      {beneficiaries.map((item, index) => (
        <Fragment key={item.id}>
          <BeneficiaryItem beneficiary={item} />

          {index !== beneficiaries.length - 1 && (
            <Separator className='mb-[18px] mt-5' />
          )}
        </Fragment>
      ))}
    </ul>
  );
}

export default BeneficiaryList;
