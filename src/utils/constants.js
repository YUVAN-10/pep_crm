import {
  LayoutDashboard,
  UsersRound,
  TrendingUp,
  Clock,
  Building2,
  FileText,
  FileCheck,
  FolderKanban,
  CheckSquare,
  CreditCard,
  BarChart3,
  UserCog,
} from 'lucide-react';

export const APP_NAME = 'PEP CRM';
export const COMPANY_NAME = 'Pep Software';
export const APP_VERSION = 'V1.0';
export const APP_YEAR = '2026';

export const SERVICES = [
  'Website Development',
  'Mobile App Development',
  'Customized Software Development',
  'E-commerce Development',
];

export const NAV_SECTIONS = [
  {
    title: 'MAIN MENU',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
      { name: 'Leads', path: '/leads', icon: UsersRound, badge: '3' },
      { name: 'Opportunities', path: '/opportunities', icon: TrendingUp, badge: null },
      { name: 'Follow-ups', path: '/follow-ups', icon: Clock, badge: '2' },
      { name: 'Customers', path: '/customers', icon: Building2, badge: null },
      { name: 'Requirements', path: '/requirements', icon: FileText, badge: null },
      { name: 'Quotations', path: '/quotations', icon: FileCheck, badge: null },
    ],
  },
  {
    title: 'PROJECT MANAGEMENT',
    items: [
      { name: 'Projects', path: '/projects', icon: FolderKanban, badge: null },
      { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: '3' },
    ],
  },
  {
    title: 'BUSINESS',
    items: [
      { name: 'Payments', path: '/payments', icon: CreditCard, badge: null },
      { name: 'Reports', path: '/reports', icon: BarChart3, badge: null },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { name: 'Employees', path: '/employees', icon: UserCog, badge: null },
    ],
  },
];

// Flat array for quick lookups
export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export const LEAD_STATUSES = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'contacted', name: 'Contacted', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'discussion', name: 'Requirement Discussion', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'qualified', name: 'Qualified', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'quotation', name: 'Quotation', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'won', name: 'Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'lost', name: 'Lost', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'on_hold', name: 'On Hold', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export const PIPELINE_STAGES = LEAD_STATUSES;

export const LEAD_SOURCES = [
  'BNI',
  'Referral',
  'Website',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'Google',
  'WhatsApp',
  'Existing Customer',
  'Cold Call',
  'Networking',
  'Other',
];

export const OPPORTUNITY_STAGES = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-700' },
  { id: 'contacted', name: 'Contacted', color: 'bg-purple-100 text-purple-700' },
  { id: 'requirement', name: 'Requirement', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'quotation_sent', name: 'Quotation Sent', color: 'bg-amber-100 text-amber-700' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
  { id: 'won', name: 'Won', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'lost', name: 'Lost', color: 'bg-rose-100 text-rose-700' },
  { id: 'on_hold', name: 'On Hold', color: 'bg-slate-100 text-slate-700' },
];

export const FOLLOWUP_TYPES = ['Call', 'WhatsApp', 'Email', 'Meeting', 'Other'];

export const REQUIREMENT_STATUSES = [
  'Initial Discussion',
  'Requirement Collected',
  'Confirmed',
  'Ready for Quotation',
];

export const QUOTATION_STATUSES = [
  { id: 'draft', name: 'Draft', color: 'bg-slate-100 text-slate-700' },
  { id: 'sent', name: 'Sent', color: 'bg-blue-100 text-blue-700' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-100 text-amber-700' },
  { id: 'accepted', name: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'rejected', name: 'Rejected', color: 'bg-rose-100 text-rose-700' },
  { id: 'expired', name: 'Expired', color: 'bg-slate-200 text-slate-600' },
];

export const PROJECT_TYPES = [
  'Website',
  'Mobile App',
  'Custom Software',
  'E-commerce',
  'Other',
];

export const PROJECT_STATUSES = [
  { id: 'planning', name: 'Planning', color: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', name: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  { id: 'review', name: 'Review', color: 'bg-amber-100 text-amber-700' },
  { id: 'completed', name: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'on_hold', name: 'On Hold', color: 'bg-rose-100 text-rose-700' },
];

export const TASK_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-slate-300' },
  { id: 'in_progress', title: 'In Progress', color: 'border-purple-400' },
  { id: 'blocked', title: 'Blocked', color: 'border-rose-400' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-400' },
];

export const PRIORITIES = [
  { id: 'low', name: 'Low', color: 'bg-slate-100 text-slate-700' },
  { id: 'medium', name: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { id: 'high', name: 'High', color: 'bg-amber-100 text-amber-700' },
  { id: 'critical', name: 'Critical', color: 'bg-rose-100 text-rose-700' },
];

export const PAYMENT_STATUSES = [
  { id: 'not_due', name: 'Not Due', color: 'bg-slate-100 text-slate-700' },
  { id: 'due_soon', name: 'Due Soon', color: 'bg-amber-100 text-amber-700' },
  { id: 'due', name: 'Due', color: 'bg-orange-100 text-orange-700' },
  { id: 'overdue', name: 'Overdue', color: 'bg-rose-100 text-rose-700' },
  { id: 'paid', name: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
];

export const PAYMENT_MILESTONES = [
  'Advance',
  'UI Approval',
  'Beta',
  'Final Payment',
];

export const SETTINGS_MASTERS = [
  'Employees',
  'Roles',
  'Services',
  'Lead Sources',
  'Opportunity Stages',
  'Project Types',
  'Project Stages',
  'Task Statuses',
  'Priorities',
  'Lost Reasons',
  'Payment Statuses',
];

