export interface WillInfoState {
  willId: number;
  willUrl: string | null;
  setWillId: (id: number) => void;
  setWillUrl: (url: string | null) => void;
  setEntireWillInfo: (id: number, url: string | null) => void;
  resetEntireWillInfo: () => void;
}
