/**
 * Payment verification result model returned by the backend when verifying
 * a payment session. Keep this lightweight and extend as needed.
 */
export interface PaymentVerificationResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  message?: string;
  // additional optional fields from backend
  [key: string]: any;
}
