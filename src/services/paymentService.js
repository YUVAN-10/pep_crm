/**
 * Payment Service Layer (Firebase Firestore Ready)
 */
import { mockInvoices } from '../utils/mockData';

export const paymentService = {
  async getPayments() {
    return mockInvoices;
  },
  async createPaymentMilestone(data) {
    console.log('[PaymentService] Creating payment record:', data);
    return { id: `inv-${Date.now()}`, ...data };
  },
};
