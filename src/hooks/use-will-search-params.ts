import { useRouter } from 'next/navigation';

import { useProgressStepStore } from '@/store/progress-steps';
import { WillSection } from '@/types';

const useWillSearchParams = () => {
  const { willMainStep } = useProgressStepStore();
  const router = useRouter();
  const willSections: WillSection[] = [
    'family',
    'estate',
    'gifts',
    'executors',
    'review',
    'download',
  ];

  const updateSearchParams = (value: WillSection) => {
    router.push(`?section=${value}`);
  };

  return {
    router,
    updateSearchParams,
    currentWillSection: willSections[willMainStep],
    willSections,
  };
};

export default useWillSearchParams;
