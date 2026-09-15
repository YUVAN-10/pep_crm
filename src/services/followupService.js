/**
 * Follow-up Service Layer (Firebase Firestore Ready)
 */
import { mockMeetings } from '../utils/mockData';

export const followupService = {
  async getFollowups() {
    return mockMeetings;
  },
  async createFollowup(data) {
    console.log('[FollowupService] Scheduling follow-up:', data);
    return { id: `meet-${Date.now()}`, ...data };
  },
};
