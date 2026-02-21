export interface MidtransTransactionResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  signature_key: string;
}

export interface MidtransSnapCallbacks {
  onSuccess?: (result: MidtransTransactionResult) => void;
  onPending?: (result: MidtransTransactionResult) => void;
  onError?: (result: MidtransTransactionResult) => void;
  onClose?: () => void;
}

export interface MidtransSnap {
  pay: (snapToken: string, callbacks?: MidtransSnapCallbacks) => void;
  hide: () => void;
  show: () => void;
}

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}

export {};
