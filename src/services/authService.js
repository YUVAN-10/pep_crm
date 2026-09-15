/**
 * Auth Service Layer (Firebase Ready)
 */
import { mockEmployees } from '../utils/mockData';

export const authService = {
  async login(email, password) {
    console.log('[AuthService] Attempting login for:', email);
    const found = mockEmployees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    return found || mockEmployees[0];
  },
  async logout() {
    console.log('[AuthService] Logging out user');
    return true;
  },
};
