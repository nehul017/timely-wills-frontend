import { Guardian } from '../family-and-guardians/types';

export interface Executor extends Omit<Guardian, 'phoneNumber'> {}

interface ExecutorData {
  primaryExecutor: Executor | null;
  backupExecutor: Executor | null;
  compensation: boolean | null;
  isWishes: boolean | null;
  specialWishes: string | null;
  isSelfProvingAffidavit: boolean | null;
  isNotarization: boolean | null;
  isCompletedExecutorsSection: boolean | null;
}

interface WishesData {
  isSelfProvingAffidavit: boolean | null;
  isNotarization: boolean | null;
  specialWishes: string;
  isWishes: boolean | null;
}

export interface ExecutorsState {
  primaryExecutor: Executor | null;
  backupExecutor: Executor | null;
  compensation: boolean | null;
  isWishes: boolean | null;
  specialWishes: string;
  isSelfProvingAffidavit: boolean | null;
  isNotarization: boolean | null;
  isCompletedExecutorsSection: boolean | null;
  setPrimaryExecutor: (data: Executor) => void;
  setBackupExecutor: (data: Executor | null) => void;
  setCompensation: (data: boolean | null) => void;
  setWishesData: (data: WishesData) => void;
  setEntireExecutorsState: (data: ExecutorData) => void;
  resetEntireExecutorsState: () => void;
  setIsCompletedExecutorsSection: (value: boolean) => void;
}
