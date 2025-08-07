'use client';

import { useProgressStepStore } from '@/store/progress-steps';

import BackupExecutor from './BackupExecutor';
import CompensationForm from './CompensationForm';
import PrimaryExecutor from './PrimaryExecutor';
import WishesForm from './WishesForm';

function ExecutorsSection() {
  const { subStep } = useProgressStepStore();

  return (
    <>
      {subStep === 0 && <PrimaryExecutor />}
      {subStep === 1 && <BackupExecutor />}
      {subStep === 2 && <CompensationForm />}
      {subStep === 3 && <WishesForm />}
    </>
  );
}

export default ExecutorsSection;
