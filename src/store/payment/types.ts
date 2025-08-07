export interface Amount {
  willAmount: number;
  discount: number;
  isSubscription?: boolean;
  setDiscount: (data: number) => void;
  updateWillAmount: (data: number) => void;
  updateIsSubscription: (value?: boolean) => void;
}
