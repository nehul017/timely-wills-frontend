import { useAboutStore } from '@/store/about';

const useResetAboutData = () => {
  const { resetEntireAbout } = useAboutStore();

  const resetAllAboutSectionData = () => {
    resetEntireAbout();
  };

  return { resetAllAboutSectionData };
};

export default useResetAboutData;
