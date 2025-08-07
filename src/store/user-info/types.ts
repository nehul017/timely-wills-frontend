export interface Subscription {
  status: string;
  expiresAt: string;
  subscription_id: string;
  isExpired: boolean;
}

export interface Payment {
  id: number;
  products: {
    isPoa: boolean;
    isSub: boolean;
    isWill: boolean;
    isPoaCouple: boolean;
    isWillCouple: boolean;
  };
  isPartnerInvited: boolean | null;
  paymentIntent_id: string;
}

export interface Product {
  id: number;
  product_type: 'WILL' | 'POA';
  isUsed: boolean;
  document_id: null | number;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  subscription: null | Subscription;
  payments: Payment[];
  products: Product[];
  createdAt: string;
}

export interface UserData {
  jwt: string;
  user: UserInfo;
}

export interface AuthState {
  userInfo: null | UserInfo;
  setUserInfo: (data: UserInfo) => void;
  removeUserInfo: () => void;
}
