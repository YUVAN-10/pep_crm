/**
 * Project Service Layer (Firebase Firestore Ready)
 */
import { mockProjects } from '../utils/mockData';

export const projectService = {
  async getProjects() {
    return mockProjects;
  },
  async getProjectById(id) {
    return mockProjects.find((p) => p.id === id) || mockProjects[0];
  },
  async createProject(data) {
    console.log('[ProjectService] Creating project:', data);
    return { id: `proj-${Date.now()}`, ...data };
  },
  async updateProject(id, updates) {
    console.log('[ProjectService] Updating project:', id, updates);
    return { id, ...updates };
  },
};
