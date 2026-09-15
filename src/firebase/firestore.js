/**
 * Firestore Helper Wrappers Placeholder for PEP CRM V1
 * Collection Schemas:
 * - users, roles, leads, followups, opportunities, customers, requirements,
 * - quotations, projects, tasks, payments, activity_logs, external_links, settings
 */

export const COLLECTIONS = {
  USERS: 'users',
  ROLES: 'roles',
  LEADS: 'leads',
  FOLLOWUPS: 'followups',
  OPPORTUNITIES: 'opportunities',
  CUSTOMERS: 'customers',
  REQUIREMENTS: 'requirements',
  QUOTATIONS: 'quotations',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  PAYMENTS: 'payments',
  ACTIVITY_LOGS: 'activity_logs',
  EXTERNAL_LINKS: 'external_links',
  SETTINGS: 'settings',
};

export const getCollectionDocs = async (collectionName) => {
  console.log(`[Firestore Placeholder] Query collection: ${collectionName}`);
  return [];
};

export const addCollectionDoc = async (collectionName, data) => {
  console.log(`[Firestore Placeholder] Add doc to ${collectionName}:`, data);
  return { id: `doc_${Date.now()}`, ...data };
};
