'use client';

import React from 'react';

import { useProgressStepStore } from '@/store/progress-steps';

import AboutProgressBar from './AboutProgressBar';
import AddressForm from './AddressForm';
import MainInfoAboutForm from './MainInfoAboutForm';
import RelationshipForm from './RelationshipForm';

function AboutSection() {
  const { aboutStep } = useProgressStepStore();
  return (
    <>
      {aboutStep < 3 && <AboutProgressBar />}
      <MainInfoAboutForm />
      <AddressForm />
      <RelationshipForm />
    </>
  );
}

export default AboutSection;
