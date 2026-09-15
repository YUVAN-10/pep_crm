/**
 * Customer Service Layer (Firebase Firestore Ready)
 */
import { mockClients } from '../utils/mockData';

export const customerService = {
  async getCustomers() {
    return mockClients;
  },
  async getCustomerById(id) {
    return mockClients.find((c) => c.id === id) || mockClients[0];
  },
  async createCustomer(data) {
    console.log('[CustomerService] Creating customer:', data);
    return { id: `cli-${Date.now()}`, ...data };
  },
};
