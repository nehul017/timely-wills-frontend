import { useCallback, useMemo } from 'react';

import willAPI from '@/services/will';
import { useEstateState } from '@/store/will/estate';
import { Beneficiary } from '@/store/will/estate/types';
import { useExecutorsState } from '@/store/will/executor';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { useGiftsState } from '@/store/will/gifts';
import { useWillInfoState } from '@/store/will/will-info';
import { getSeparateKidsAndPets } from '@/utils';

const useFetchWill = () => {
  const { setEntireFamily } = useFamilyMembersState();
  const { setEntireEstate } = useEstateState();
  const { setEntireBeneficiaryForGift } = useGiftsState();
  const { setEntireExecutorsState } = useExecutorsState();
  const { setEntireWillInfo } = useWillInfoState();

  const fetchWill = useCallback(async () => {
    const response = await willAPI.getWill();
    const {
      family,
      backupExecutor,
      primaryExecutor,
      isWishes,
      wishes,
      compensation,
      isChildren,
      isPet,
      exclusions,
      isExclusions,
      isGifts,
      beneficiaryForGift,
      id,
      url,
      isNotarization,
      isSelfProvingAffidavit,
      isCompletedEstateSection,
      isCompletedExecutorsSection,
      isCompletedFamilySection,
      isCompletedGiftsSection,
    } = response;

    if (response) {
      const { children, pets } = getSeparateKidsAndPets(family);
      const beneficiaries: Beneficiary[] = response.beneficiaries
        .filter((item) => !item.isBackup)
        .map((item) => ({
          isBackup: item.isBackup,
          percent: item.percent,
          address: item.address || '',
          email: item.email || '',
          websiteLink: item.websiteLink || '',
          phoneNumber: item.phoneNumber || '',
          backupType: item.backupType || '',
          fullName: item.fullName || '',
          personType: item.personType || '',
          id: item.id,
          type: item.type,
          backupBeneficiaries: item.backupBeneficiaries?.map((item) => ({
            percent: item?.percent || 0,
            address: item?.address || '',
            phoneNumber: item?.phoneNumber || '',
            websiteLink: item?.websiteLink || '',
            email: item?.email || '',
            id: item?.id,
            backupType: item?.backupType,
            fullName: item?.fullName || '',
            type: item?.type,
            personType: item?.personType,
            isBackup: item?.isBackup,
          })),
        }));

      setEntireEstate({
        beneficiaries,
        exclusions,
        isExclusions,
        isCompletedEstateSection,
      });
      setEntireFamily({
        children,
        pets,
        isChildren,
        isPet,
        isCompletedFamilySection,
      });
      setEntireWillInfo(id, url);
      setEntireBeneficiaryForGift({
        isGifts,
        beneficiaryForGift,
        isCompletedGiftsSection,
      });
      setEntireExecutorsState({
        backupExecutor,
        primaryExecutor,
        isWishes,
        specialWishes: wishes,
        compensation,
        isNotarization,
        isSelfProvingAffidavit,
        isCompletedExecutorsSection,
      });
    }
  }, []);

  return useMemo(() => ({ fetchWill }), []);
};

export default useFetchWill;
