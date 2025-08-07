'use client';

import React from 'react';

import { useProgressStepStore } from '@/store/progress-steps';

import SpecificWishes from '../living-will/SpecificWishes';
import WishesForm from '../living-will/WishesForm';

function WishesSpecificWishes() {
  const { wishesStep } = useProgressStepStore();

  if (!wishesStep) {
    return <WishesForm isCombined />;
  }

  return <SpecificWishes isCombined />;
}

export default WishesSpecificWishes;
