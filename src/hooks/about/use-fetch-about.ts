import { useCallback, useMemo } from 'react';

import aboutAPI from '@/services/about';
import { useAboutStore } from '@/store/about';

const useFetchAbout = () => {
  const { setEntireAbout } = useAboutStore();

  const fetchAbout = useCallback(async () => {
    const response = await aboutAPI.getAbout();

    if (response) {
      setEntireAbout(response);
    }
  }, []);

  return useMemo(() => ({ fetchAbout }), []);
};

export default useFetchAbout;
