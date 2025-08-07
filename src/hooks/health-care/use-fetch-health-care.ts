import { useCallback, useMemo } from 'react';

import healthCareAPI from '@/services/health-care-directive';
import { useHealthCareStore } from '@/store/health-care';

const useFetchHealthCare = () => {
  const { setHealthCare } = useHealthCareStore();

  const fetchHealthCare = useCallback(async () => {
    const response = await healthCareAPI.getHealthCare();

    if (response.id) {
      const data = {
        id: response.id,
        url: response.url,
      };

      setHealthCare(data);
    }
  }, []);

  return useMemo(() => ({ fetchHealthCare }), []);
};

export default useFetchHealthCare;
