'use client';

import { useProgressStepStore } from '@/store/progress-steps';

import Backups from './Backups';
import Inheritors from './Inheritors';

function EstateSection() {
  const { subStep } = useProgressStepStore();

  return (
    <>
      {!subStep && <Inheritors />}
      {subStep === 1 && <Backups />}
    </>
  );
}

export default EstateSection;
