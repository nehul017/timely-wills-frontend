export interface BeneficiaryForGift {
  id: string | number;
  giftId: string | number;
  fullName: string;
  personType: string;
  email: string | null;
  address: string | null;
  giftType: string;
  message: string;
  giftDescription: string | null;
  money: string | null;
}

export interface GiftsData {
  beneficiaryForGift: BeneficiaryForGift[];
  isGifts: boolean | null;
  isCompletedGiftsSection: boolean | null;
}

export interface GiftsState {
  selectedGiftId: string | number;
  isGifts: boolean | null;
  beneficiaryForGift: BeneficiaryForGift[];
  isCompletedGiftsSection: boolean | null;
  setIsGifts: (value: boolean | null) => void;
  addBeneficiary: (data: BeneficiaryForGift) => void;
  deleteBeneficiary: (id: string | number) => void;
  setSelectedGiftId: (id: string | number) => void;
  setEntireBeneficiaryForGift: (data: GiftsData) => void;
  resetEntireBeneficiaryForGift: () => void;
  removeAllGifts: () => void;
  setIsCompletedGiftsSection: (value: boolean) => void;
}
