import { useState } from 'react';

import { petsTypeOptions } from '@/constant/will';
import { Pet } from '@/store/will/family-and-guardians/types';

export interface OtherOptions {
  isOther: boolean;
  index: number;
}

const useDisplayOtherPetOption = (pets: Pet[]) => {
  const [otherOptions, setOtherOptions] = useState<OtherOptions[]>(
    pets.map((item, i) => ({
      isOther: !petsTypeOptions.includes(`${item?.petType}`),
      index: i,
    })),
  );

  return { otherOptions, setOtherOptions };
};

export default useDisplayOtherPetOption;
