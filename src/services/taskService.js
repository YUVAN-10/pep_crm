/**
 * Task Service Layer (Firebase Firestore Ready)
 */
import { mockTasks } from '../utils/mockData';

export const taskService = {
  async getTasks() {
    return mockTasks;
  },
  async createTask(data) {
    console.log('[TaskService] Creating task:', data);
    return { id: `task-${Date.now()}`, ...data };
  },
  async updateTaskStatus(taskId, columnId) {
    console.log(`[TaskService] Moving task ${taskId} to column ${columnId}`);
    return true;
  },
};
