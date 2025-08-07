'use client';

import { useProgressStepStore } from '@/store/progress-steps';

import ChildrenForm from './ChildrenForm';
import GuardianChildForm from './GuardianChildForm';
import GuardianPetForm from './GuardianPetForm';
import PetsForm from './PetsForm';

function FamilySection() {
  const { subStep } = useProgressStepStore();

  return (
    <>
      {!subStep && <ChildrenForm />}
      {subStep === 1 && <GuardianChildForm />}
      {subStep === 2 && <PetsForm />}
      {subStep === 3 && <GuardianPetForm />}
    </>
  );
}

export default FamilySection;
