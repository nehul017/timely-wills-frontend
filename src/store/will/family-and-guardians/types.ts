export interface Guardian {
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string;
  personType: string;
}

export interface Child {
  fullName: string;
  birthday: string | null;
  type: 'child';
  guardian: Guardian | null;
}

export interface Pet {
  fullName: string;
  type: 'pet';
  petType: string | null;
  guardian: Guardian | null;
}

export interface FamilyData {
  children: Child[];
  pets: Pet[];
  isChildren: boolean | null;
  isPet: boolean | null;
  isCompletedFamilySection: boolean | null;
}

export interface FamilyGuardiansState {
  children: Child[];
  pets: Pet[];
  isChildren: boolean | null;
  isPet: boolean | null;
  isCompletedFamilySection: boolean | null;
  updateChildren: (data: Child[]) => void;
  updatePets: (data: Pet[]) => void;
  setEntireFamily: (data: FamilyData) => void;
  setIsChildren: (data: boolean | null) => void;
  setIsPet: (data: boolean | null) => void;
  resetEntireFamily: () => void;
  setIsCompletedFamilySection: (value: boolean) => void;
}
