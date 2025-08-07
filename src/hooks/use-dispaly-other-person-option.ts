import { useState } from 'react';

import { presonTypeOptions } from '@/constant/will';
import { Guardian } from '@/store/will/family-and-guardians/types';

import { OtherOptions } from './use-dispaly-other-pet-option';

const useDisplayOtherPersonOption = (guardian: Guardian[]) => {
  const [otherOptions, setOtherOptions] = useState<OtherOptions[]>(
    guardian.map((item, i) => ({
      isOther: item ? !presonTypeOptions.includes(`${item.personType}`) : false,
      index: i,
    })),
  );

  return { otherOptions, setOtherOptions };
};

export default useDisplayOtherPersonOption;
