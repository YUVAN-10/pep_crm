import {
  LayoutDashboard,
  UsersRound,
  Clock,
  Building2,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';

export const APP_NAME = 'PEP CRM';
export const COMPANY_NAME = 'Pep Software';
export const APP_VERSION = 'V1.0';
export const APP_YEAR = '2026';

export const SERVICES = [
  'Website Development',
  'Mobile App Development',
  'Custom Software Development',
  'E-commerce Development',
];

export const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
      { name: 'Leads', path: '/leads', icon: UsersRound, badge: null },
      { name: 'Follow-ups', path: '/follow-ups', icon: Clock, badge: null },
      { name: 'Customers', path: '/customers', icon: Building2, badge: null },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { name: 'Reports', path: '/reports', icon: BarChart3, badge: null },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { name: 'Settings', path: '/settings', icon: SettingsIcon, badge: null },
    ],
  },
];

// Flat array for quick lookups
export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export const LEAD_STATUSES = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800' },
  { id: 'discussion', name: 'Requirement Discussion', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800' },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' },
  { id: 'won', name: 'Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'lost', name: 'Lost', color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800' },
];

export const LEAD_SOURCES = [
  'BNI',
  'Referral',
  'Website Form',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'Google Search',
  'WhatsApp',
  'Existing Customer',
  'Cold Call',
  'Networking',
  'Other',
];

export const FOLLOWUP_TYPES = ['Call', 'WhatsApp', 'Email', 'Meeting', 'Other'];

export const PRIORITIES = [
  { id: 'low', name: 'Low', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'medium', name: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300' },
  { id: 'high', name: 'High', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300' },
  { id: 'urgent', name: 'Urgent', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300' },
];
