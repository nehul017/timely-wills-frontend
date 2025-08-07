import { useCallback, useMemo } from 'react';

import livingWillAPI from '@/services/living-will';
import { useLivingWillWishesStore } from '@/store/living-will';
import { useMedicalPOAAgentPowersStore } from '@/store/medical-poa';

const useFetchLivingWill = () => {
  const { setEntireLivingWill } = useLivingWillWishesStore();
  const { setIsCompletedWishesSection } = useMedicalPOAAgentPowersStore();

  const fetchLivingWill = useCallback(async () => {
    const response = await livingWillAPI.getLivingWill();

    if (response) {
      setEntireLivingWill(response);

      if (response.isCompletedWishesSection) {
        setIsCompletedWishesSection(response.isCompletedWishesSection);
      }
    }
  }, []);

  return useMemo(() => ({ fetchLivingWill }), []);
};

export default useFetchLivingWill;
