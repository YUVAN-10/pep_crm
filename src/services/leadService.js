/**
 * Lead Service Layer (Firebase Firestore Ready)
 */
import { mockLeads } from '../utils/mockData';

export const leadService = {
  async getLeads() {
    return mockLeads;
  },
  async getLeadById(id) {
    return mockLeads.find((l) => l.id === id) || mockLeads[0];
  },
  async createLead(data) {
    console.log('[LeadService] Creating lead:', data);
    return { id: `lead-${Date.now()}`, ...data };
  },
  async updateLead(id, updates) {
    console.log('[LeadService] Updating lead:', id, updates);
    return { id, ...updates };
  },
};
