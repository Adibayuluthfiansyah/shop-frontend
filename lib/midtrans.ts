export const MIDTRANS_CONFIG = {
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
  environment: (process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
} as const;


export function getMidtransSnapUrl(): string {
  return MIDTRANS_CONFIG.environment === 'production'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
}

export function isMidtransConfigured(): boolean {
  return Boolean(MIDTRANS_CONFIG.clientKey && MIDTRANS_CONFIG.clientKey !== 'your-midtrans-client-key-here');
}


export function isValidMidtransClientKey(key: string): boolean {
  // Midtrans client keys typically start with "SB-" for sandbox or "Mid-" for production
  return /^(SB-|Mid-)/.test(key);
}
