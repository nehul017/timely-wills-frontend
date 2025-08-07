import { useHealthCareStore } from '@/store/health-care';

import useResetAboutData from './about/use-reset-about-data';
import useResetDurableData from './durable-poa/use-reset-durable-data';
import useResetLivingWillData from './living-will/use-reset-living-will-data';
import useResetMedicalPoaData from './medical-poa/use-reset-medical-poa-data';
import useResetWillData from './will/use-reset-will-data';

const useResetAllGlobalData = () => {
  const { resetAllWillSectionData } = useResetWillData();
  const { resetAllDurableSectionData } = useResetDurableData();
  const { resetAllLivingWillSectionData } = useResetLivingWillData();
  const { resetAllMedicalPoaSectionData } = useResetMedicalPoaData();
  const { resetAllAboutSectionData } = useResetAboutData();
  const { resetHealthCare } = useHealthCareStore();

  const resetAllHealthCareSectionData = () => {
    resetAllLivingWillSectionData();
    resetAllMedicalPoaSectionData();
    resetHealthCare();
  };

  const resetAllGlobalData = () => {
    resetAllWillSectionData();
    resetAllDurableSectionData();
    resetAllLivingWillSectionData();
    resetAllMedicalPoaSectionData();
    resetAllAboutSectionData();
    resetHealthCare();
  };

  return {
    resetAllHealthCareSectionData,
    resetAllGlobalData,
    resetAllMedicalPoaSectionData,
    resetAllWillSectionData,
    resetAllDurableSectionData,
    resetAllLivingWillSectionData,
    resetAllAboutSectionData,
  };
};

export default useResetAllGlobalData;
