/**
 * Quotation Service Layer (Firebase Firestore Ready)
 */
export const quotationService = {
  async getQuotations() {
    return [];
  },
  async createQuotationRecord(data) {
    console.log('[QuotationService] Recording quotation:', data);
    return { id: `quote-${Date.now()}`, ...data };
  },
};
