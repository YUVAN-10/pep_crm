import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from './NotificationContext';

const CRMContext = createContext();

const INITIAL_EMPLOYEES = [
  { id: 'emp-1', name: 'Sanjay Verma', role: 'Managing Director & Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'emp-2', name: 'Alice', role: 'Senior Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'emp-3', name: 'Rohan Sharma', role: 'Sales Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'emp-4', name: 'Pooja Nair', role: 'Project Manager', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'emp-5', name: 'Vishal Kumar', role: 'Fullstack Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
];

const INITIAL_LEADS = [
  {
    id: 'lead-abc',
    name: 'ABC Hospital',
    contact: 'Dr. Ramesh Sharma',
    role: 'Medical Director',
    email: 'ramesh@abchospital.org',
    phone: '+91 98230 11990',
    value: 1500000,
    stage: 'new',
    source: 'Website Form',
    service: 'Website Development',
    assignedTo: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    createdDate: '2026-03-01',
    expectedClose: '2026-04-15',
    notes: 'Inquiry for patient appointment portal and OPD management web application.',
  },
  {
    id: 'lead-1',
    name: 'NextGen Digital Solutions',
    contact: 'Ananya Deshmukh',
    role: 'VP Tech',
    email: 'ananya@nexgendigital.com',
    phone: '+91 98201 44521',
    value: 1850000,
    stage: 'meeting',
    source: 'Referral',
    service: 'Custom Software',
    assignedTo: { name: 'Sanjay Verma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    createdDate: '2026-02-14',
    expectedClose: '2026-03-30',
    notes: 'Requirement for custom multi-tenant distributor commerce suite.',
  },
  {
    id: 'lead-2',
    name: 'QuickBite FoodTech',
    contact: 'Simran Khurana',
    role: 'CEO',
    email: 'simran@quickbiteapp.com',
    phone: '+91 98765 43210',
    value: 850000,
    stage: 'proposal',
    source: 'LinkedIn InMail',
    service: 'Mobile App',
    assignedTo: { name: 'Pooja Nair', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    createdDate: '2026-02-22',
    expectedClose: '2026-04-10',
    notes: 'Flutter delivery rider mobile application revamp.',
  },
  {
    id: 'lead-3',
    name: 'Apex Health Logistics',
    contact: 'Dr. Rahul Kapoor',
    role: 'COO',
    email: 'rahul@apexhealthlog.in',
    phone: '+91 98450 12890',
    value: 2400000,
    stage: 'qualified',
    source: 'Cold Outreach',
    service: 'Mobile App',
    assignedTo: { name: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    createdDate: '2026-01-20',
    expectedClose: '2026-03-25',
    notes: 'Bluetooth BLE cold chain temperature monitor app.',
  },
  {
    id: 'lead-4',
    name: 'CloudScale Enterprise',
    contact: 'Rajeev Malhotra',
    role: 'Head of IT',
    email: 'r.malhotra@cloudscale.io',
    phone: '+91 98112 34567',
    value: 1250000,
    stage: 'won',
    source: 'Website Form',
    service: 'Custom Software',
    assignedTo: { name: 'Vishal Kumar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    createdDate: '2026-01-10',
    expectedClose: '2026-02-26',
    notes: 'Enterprise Multi-tenant Cloud Management Console.',
  },
];

const INITIAL_FOLLOWUPS = [
  {
    id: 'fol-1',
    leadId: 'lead-abc',
    clientName: 'ABC Hospital',
    title: 'Initial Discovery Call',
    date: '2026-03-16',
    time: '11:00 AM',
    assignedTo: 'Rohan Sharma',
    status: 'Pending', // Pending | Completed | Overdue
    notes: 'Review OPD workflow requirements',
  },
  {
    id: 'fol-2',
    leadId: 'lead-1',
    clientName: 'NextGen Digital Solutions',
    title: 'Architecture Review Session',
    date: '2026-03-14',
    time: '02:30 PM',
    assignedTo: 'Sanjay Verma',
    status: 'Overdue',
    notes: 'Discuss SAP legacy DB connector specs',
  }
];

const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-1',
    name: 'CloudScale Enterprise Portal',
    customer: 'CloudScale Enterprise',
    service: 'Custom Software',
    value: 1250000,
    probability: '80%',
    expectedClose: '2026-03-30',
    assignedTo: 'Vishal Kumar',
    stage: 'quotation_sent',
    nextAction: 'Follow up on technical proposal feedback',
  },
  {
    id: 'opp-2',
    name: 'QuickBite Rider App Revamp',
    customer: 'QuickBite FoodTech',
    service: 'Mobile App',
    value: 850000,
    probability: '60%',
    expectedClose: '2026-04-10',
    assignedTo: 'Pooja Nair',
    stage: 'requirement',
    nextAction: 'Schedule technical architecture demo',
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'NextGen B2B Distributor Commerce Suite',
    client: 'NextGen Digital Solutions',
    type: 'Custom Software',
    status: 'in_progress',
    budget: 1850000,
    progress: 75,
    startDate: '2026-01-15',
    deadline: '2026-04-30',
    team: ['Sanjay Verma', 'Alice', 'Vishal Kumar'],
    tasksCount: 5,
    completedTasksCount: 3,
  }
];

const INITIAL_TASKS = [
  {
    id: 'tsk-1',
    projectId: 'proj-1',
    title: 'Design Database Schema for B2B Bulk Orders',
    columnId: 'completed',
    assignedTo: 'Alice',
    priority: 'urgent',
    dueDate: '2026-02-15',
  },
  {
    id: 'tsk-2',
    projectId: 'proj-1',
    title: 'Build GST E-Invoicing Webhook Engine',
    columnId: 'in_progress',
    assignedTo: 'Vishal Kumar',
    priority: 'high',
    dueDate: '2026-03-20',
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    user: 'Sanjay Verma',
    action: 'initialized Testing Mode',
    target: 'PEP CRM System',
    time: 'Just now',
    type: 'system',
  },
  {
    id: 'act-2',
    user: 'Rohan Sharma',
    action: 'created Lead',
    target: 'ABC Hospital',
    time: '10 mins ago',
    type: 'lead',
  }
];

const INITIAL_REQUIREMENTS = [
  {
    id: 'req-1',
    customer: 'ABC Hospital',
    projectType: 'Healthcare Portal',
    businessRequirement: 'Hospital Management & Patient OPD Portal with WhatsApp API notifications.',
    modules: 'OPD Booking, Billing, WhatsApp Alerts',
    userTypes: 'Doctor, Patient, Admin',
    integrations: 'HMIS REST APIs, WhatsApp Cloud API',
    hosting: 'Cloud VPS',
    domain: 'abchospital.in',
    timeline: '2 Months',
    referenceLinks: 'https://abchospital.in',
    notes: 'Initial requirement documented for ABC Hospital.',
    status: 'Ready for Quotation',
  },
  {
    id: 'req-2',
    customer: 'NexGen Digital Solutions',
    projectType: 'E-commerce',
    businessRequirement: 'B2B Distributor Commerce Portal with bulk e-invoicing and GST calculation.',
    modules: 'Catalog, Cart, GST Engine, Credit Line Tracker, Order Dispatcher',
    userTypes: 'Super Admin, Distributor, Retailer, Finance Clerk',
    integrations: 'Razorpay, ICICI Bank Webhook, Tally ERP API',
    hosting: 'AWS EC2 + Cloudflare CDN',
    domain: 'b2b.nexgendigital.io',
    timeline: '3 Months',
    referenceLinks: 'https://figma.com/file/sample-nexgen-b2b',
    notes: 'Must support mobile viewport for distributors in field.',
    status: 'Ready for Quotation',
  },
  {
    id: 'req-3',
    customer: 'Apex Health Logistics',
    projectType: 'Mobile App',
    businessRequirement: 'Cold-chain BLE temperature monitoring driver mobile app on iOS/Android.',
    modules: 'BLE Scanner, Background GPS, Offline SQLite Sync, Alert Push Notification',
    userTypes: 'Truck Driver, Logistics Manager, Warehouse Operator',
    integrations: 'Firebase Cloud Messaging, AWS IoT Core',
    hosting: 'Firebase Hosting + Google Cloud Functions',
    domain: 'app.apexhealthlog.in',
    timeline: '2.5 Months',
    referenceLinks: 'https://github.com/apex-sensor-spec',
    notes: 'BLE sensor polling frequency every 30 seconds.',
    status: 'Confirmed',
  },
];

const INITIAL_QUOTATIONS = [
  {
    id: 'quote-1',
    quotationNumber: 'QT-2026-041',
    customer: 'NexGen Digital Solutions',
    opportunity: 'NexGen B2B Distributor Commerce Suite',
    amount: 1850000,
    quotationDate: '2026-02-10',
    sentDate: '2026-02-12',
    validUntil: '2026-03-31',
    status: 'Accepted',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-041',
    notes: 'Quotation accepted after volume discount approval.',
  },
  {
    id: 'quote-2',
    quotationNumber: 'QT-2026-044',
    customer: 'QuickBite FoodTech Network',
    opportunity: 'QuickBite Rider App Revamp',
    amount: 850000,
    quotationDate: '2026-02-28',
    sentDate: '2026-03-01',
    validUntil: '2026-04-15',
    status: 'Sent',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-044',
    notes: 'Awaiting client board review.',
  },
  {
    id: 'quote-3',
    quotationNumber: 'QT-2026-045',
    customer: 'Apex Health Logistics',
    opportunity: 'Apex Cold-Chain Mobile App',
    amount: 1200000,
    quotationDate: '2026-01-15',
    sentDate: '2026-01-16',
    validUntil: '2026-02-15',
    status: 'Expired',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-045',
    notes: 'Expired proposal.',
  },
  {
    id: 'quote-4',
    quotationNumber: 'QT-2026-046',
    customer: 'CloudScale Enterprise',
    opportunity: 'Cloud Management Dashboard',
    amount: 1400000,
    quotationDate: '2026-03-10',
    sentDate: '2026-03-10',
    validUntil: '2026-04-10',
    status: 'Draft',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-046',
    notes: 'Draft quotation under internal review.',
  },
];

export const CRMProvider = ({ children }) => {
  const { addNotification } = useNotifications();

  const [isTestingMode, setIsTestingMode] = useState(true);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [followups, setFollowups] = useState(INITIAL_FOLLOWUPS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [clients, setClients] = useState([
    { id: 'cli-1', company: 'NextGen Digital Solutions', contactPerson: 'Ananya Deshmukh', totalSpent: 1850000, activeProjects: 1, status: 'Active' },
    { id: 'cli-2', company: 'Apex Health Logistics', contactPerson: 'Dr. Rahul Kapoor', totalSpent: 2400000, activeProjects: 1, status: 'Active' }
  ]);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [invoices, setInvoices] = useState([
    { id: 'inv-1', invoiceNumber: 'INV-2026-001', client: 'NextGen Digital Solutions', amount: 450000, total: 531000, status: 'Paid', issueDate: '2026-02-01', dueDate: '2026-02-15' },
    { id: 'inv-2', invoiceNumber: 'INV-2026-002', client: 'Apex Health Logistics', amount: 850000, total: 1003000, status: 'Pending', issueDate: '2026-03-01', dueDate: '2026-03-20' }
  ]);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // QA Checklist Tracking
  const [qaChecklist, setQaChecklist] = useState({
    Navigation: true,
    Leads: true,
    Followups: true,
    Opportunity: true,
    Requirement: true,
    Quotation: true,
    Customer: true,
    Project: true,
    Tasks: true,
    Payments: true,
    Reports: true,
    Notifications: true,
    Timeline: true,
  });

  const logActivity = (user, action, target, type = 'general') => {
    const act = {
      id: `act-${Date.now()}`,
      user,
      action,
      target,
      time: 'Just now',
      type,
    };
    setActivities((prev) => [act, ...prev]);
  };

  const markQaPassed = (moduleName) => {
    setQaChecklist((prev) => ({ ...prev, [moduleName]: true }));
  };

  // --- ACTIONS ---

  // STEP 1: Add Lead
  const addLead = (leadData) => {
    const created = {
      id: `lead-${Date.now()}`,
      name: leadData.name || 'New Lead',
      contact: leadData.contact || 'Contact Person',
      role: leadData.role || 'Decision Maker',
      email: leadData.email || 'lead@company.com',
      phone: leadData.phone || '+91 98000 00000',
      value: Number(leadData.value) || 1000000,
      stage: leadData.stage || 'new',
      source: leadData.source || 'Website Form',
      service: leadData.service || 'Custom Software',
      assignedTo: {
        name: leadData.assignedTo || 'Rohan Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      createdDate: new Date().toISOString().split('T')[0],
      expectedClose: leadData.expectedClose || '2026-04-30',
      notes: leadData.notes || 'Registered in CRM.',
    };

    setLeads((prev) => [created, ...prev]);
    logActivity('Rohan Sharma', 'created Lead', created.name, 'lead');
    addNotification({
      title: 'New Lead Added',
      description: `Lead registered for ${created.name} (${created.service})`,
      category: 'purple',
      relatedRecord: created.name,
    });
    markQaPassed('Leads');
    return created;
  };

  // STEP 2 & 3: Followups
  const addFollowup = (folData) => {
    const fol = {
      id: `fol-${Date.now()}`,
      leadId: folData.leadId || 'lead-abc',
      customer: folData.customer || folData.clientName || 'ABC Hospital',
      clientName: folData.customer || folData.clientName || 'ABC Hospital',
      title: folData.title || `Follow up call with ${folData.customer || folData.clientName || 'Client'}`,
      date: folData.date || new Date().toISOString().split('T')[0],
      time: folData.time || '11:00 AM',
      type: folData.type || 'Call',
      assignedTo: folData.assignedTo || 'Rohan Sharma',
      status: folData.status || 'Today',
      notes: folData.notes || 'Discuss project scope & OPD requirements',
      relatedModule: folData.relatedModule || 'Lead Record',
      relatedPath: folData.relatedPath || '/leads',
    };
    setFollowups((prev) => [fol, ...prev]);
    logActivity(fol.assignedTo, 'scheduled Follow-up', `${fol.title} with ${fol.clientName}`, 'followup');
    addNotification({
      title: 'Follow-up Scheduled',
      description: `Follow-up scheduled with ${fol.clientName} for ${fol.date}`,
      category: 'amber',
      relatedRecord: fol.clientName,
    });
    markQaPassed('Followups');
    return fol;
  };

  const completeFollowup = (id, note = 'Client Interested') => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Completed', outcome: note } : f))
    );
    logActivity('Rohan Sharma', 'completed Follow-up', `Outcome: ${note}`, 'followup');
    addNotification({
      title: 'Follow-up Completed',
      description: `Follow-up completed: ${note}`,
      category: 'orange',
      relatedRecord: 'Follow-up Record',
    });
    markQaPassed('Followups');
  };

  // STEP 4: Convert Lead to Opportunity
  const convertLeadToOpportunity = (lead) => {
    const opp = {
      id: `opp-${Date.now()}`,
      name: `${lead.name} Deal`,
      customer: lead.name,
      service: lead.service || 'Website Development',
      value: lead.value || 1500000,
      probability: '60%',
      expectedClose: lead.expectedClose || '2026-05-15',
      assignedTo: typeof lead.assignedTo === 'object' ? lead.assignedTo.name : (lead.assignedTo || 'Rohan Sharma'),
      stage: 'new', // Matches OPPORTUNITY_STAGES id 'new'
      nextAction: 'Collect detailed business requirement scope',
    };

    setOpportunities((prev) => [opp, ...prev]);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage: 'qualified' } : l)));
    logActivity('Rohan Sharma', 'converted Lead to Opportunity', lead.name, 'opportunity');
    addNotification({
      title: 'Opportunity Created',
      description: `Opportunity created for ${lead.name} (${formatCurrency(lead.value)})`,
      category: 'blue',
      relatedRecord: lead.name,
    });
    markQaPassed('Opportunity');
    return opp;
  };

  const updateOpportunity = (oppId, updatedFields) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, ...updatedFields } : o))
    );
    logActivity('Sanjay Verma', 'updated Opportunity parameters', oppId, 'opportunity');
  };

  const updateOpportunityStage = (oppId, newStage) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
    logActivity('Sanjay Verma', `moved Opportunity stage to ${newStage}`, oppId, 'opportunity');
    addNotification({
      title: 'Opportunity Stage Changed',
      description: `Deal moved to ${newStage.toUpperCase()} stage.`,
      category: 'purple',
    });
  };

  const deleteOpportunity = (oppId) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
    logActivity('Sanjay Verma', 'archived Opportunity', oppId, 'opportunity');
    addNotification({
      title: 'Opportunity Archived',
      description: 'Opportunity removed from pipeline.',
      category: 'orange',
    });
  };

  // STEP 5 & 6: Requirement
  const addRequirement = (reqData) => {
    const req = {
      id: `req-${Date.now()}`,
      oppId: reqData.oppId || 'opp-abc',
      customer: reqData.customer || 'ABC Hospital',
      scope: reqData.scope || 'OPD Booking, Patient Medical History & Doctor Schedule Portal',
      features: reqData.features || 'OTP Auth, Razorpay Payment Gateway, WhatsApp SMS Notification',
      timeline: reqData.timeline || '60 Days SLA',
      integrations: reqData.integrations || 'HMIS REST APIs, WhatsApp Cloud API',
      status: 'Draft',
    };
    setRequirements((prev) => [req, ...prev]);
    logActivity('Pooja Nair', 'added Requirement', req.customer, 'requirement');
    addNotification({
      title: 'Requirement Added',
      description: `Business scope collected for ${req.customer}`,
      category: 'amber',
      relatedRecord: req.customer,
    });
    markQaPassed('Requirement');
    return req;
  };

  const markRequirementReady = (reqId) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Ready for Quotation' } : r))
    );
    logActivity('Pooja Nair', 'marked Requirement Ready for Quotation', 'ABC Hospital', 'requirement');
    addNotification({
      title: 'Requirement Ready',
      description: 'Requirement approved & ready for quotation generation',
      category: 'amber',
      relatedRecord: 'ABC Hospital',
    });
    markQaPassed('Requirement');
  };

  // STEP 7 & 8: Quotation
  const addQuotation = (quoteData) => {
    const q = {
      id: `qt-${Date.now()}`,
      quotationNumber: quoteData.quotationNumber || `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: quoteData.customer || 'ABC Hospital',
      amount: Number(quoteData.amount) || 1500000,
      tax: (Number(quoteData.amount) || 1500000) * 0.18,
      total: (Number(quoteData.amount) || 1500000) * 1.18,
      status: 'Sent', // Draft | Sent | Accepted | Rejected
      zohoUrl: quoteData.zohoUrl || 'https://books.zoho.com/estimates/8901239',
      date: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [q, ...prev]);
    logActivity('Sanjay Verma', 'generated & sent Quotation', `${q.quotationNumber} (${q.customer})`, 'quotation');
    addNotification({
      title: 'Quotation Sent',
      description: `Quotation ${q.quotationNumber} sent to ${q.customer}`,
      category: 'green',
      relatedRecord: q.customer,
    });
    markQaPassed('Quotation');
    return q;
  };

  const acceptQuotation = (quoteId) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' } : q))
    );
    logActivity('Sanjay Verma', 'marked Quotation Accepted', 'ABC Hospital', 'quotation');
    addNotification({
      title: 'Quotation Accepted',
      description: 'Quotation accepted by ABC Hospital! Ready for Project conversion.',
      category: 'green',
      relatedRecord: 'ABC Hospital',
    });
    markQaPassed('Quotation');
  };

  // STEP 9: Convert to Project
  const convertOppToProject = (customerName = 'ABC Hospital', budget = 1500000) => {
    const proj = {
      id: `proj-${Date.now()}`,
      title: `${customerName} Software Implementation`,
      client: customerName,
      type: 'Custom Web Application',
      status: 'in_progress',
      statusLabel: 'In Progress',
      priority: 'high',
      budget: budget,
      progress: 5,
      startDate: new Date().toISOString().split('T')[0],
      deadline: '2026-06-30',
      description: `Custom software implementation built by PEP Software team for ${customerName}.`,
      team: [
        { name: 'Sanjay Verma', role: 'Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { name: 'Pooja Nair', role: 'AI Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      ],
      milestones: [
        { title: 'Project Kickoff & Specs', status: 'in_progress', date: 'Mar 2026' },
      ],
      taskStats: { total: 10, completed: 1, inProgress: 2, pending: 7 },
      tasksCount: 10,
      completedTasksCount: 1,
    };
    setProjects((prev) => [proj, ...prev]);

    // Ensure customer profile exists
    if (!clients.some((c) => c.company === customerName)) {
      setClients((prev) => [
        {
          id: `cli-${Date.now()}`,
          company: customerName,
          contactPerson: 'Decision Maker',
          totalSpent: budget,
          activeProjects: 1,
          status: 'Active',
        },
        ...prev,
      ]);
    }

    logActivity('Pooja Nair', 'converted Deal to Active Project', proj.title, 'project');
    addNotification({
      title: 'Project Created',
      description: `Project created: ${proj.title} (Budget: ${formatCurrency(budget)})`,
      category: 'green',
      relatedRecord: customerName,
    });
    markQaPassed('Project');
    markQaPassed('Customer');
    return proj;
  };

  // STEP 10: Task Management
  const addTask = (taskData) => {
    const t = {
      id: `tsk-${Date.now()}`,
      projectId: taskData.projectId || projects[0]?.id || 'proj-1',
      title: taskData.title || 'New Sprint Task',
      columnId: taskData.columnId || 'todo',
      assignedTo: taskData.assignedTo || 'Alice',
      priority: taskData.priority || 'high',
      dueDate: taskData.dueDate || '2026-04-15',
    };
    setTasks((prev) => [t, ...prev]);
    logActivity(t.assignedTo, 'created Sprint Task', t.title, 'task');
    addNotification({
      title: 'Task Assigned',
      description: `New task assigned to ${t.assignedTo}: ${t.title}`,
      category: 'blue',
      relatedRecord: t.title,
    });
    markQaPassed('Tasks');
    return t;
  };

  const completeTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, columnId: 'completed' } : t));
      
      // Auto recalculate project progress %
      const completedCount = updated.filter((t) => t.columnId === 'completed').length;
      const totalCount = updated.length;
      const calcProgress = Math.round((completedCount / (totalCount || 1)) * 100);

      setProjects((pPrev) =>
        pPrev.map((p) => ({ ...p, progress: calcProgress }))
      );

      return updated;
    });

    logActivity('Alice', 'completed Task', 'Sprint Task', 'task');
    addNotification({
      title: 'Task Completed',
      description: 'Sprint task marked completed. Project progress updated.',
      category: 'green',
      relatedRecord: 'Project Progress',
    });
    markQaPassed('Tasks');
  };

  // STEP 11: Payment Test
  const addPayment = (payData) => {
    const inv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      client: payData.client || 'ABC Hospital',
      amount: Number(payData.amount) || 500000,
      total: (Number(payData.amount) || 500000) * 1.18,
      status: 'Pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-04-01',
    };
    setInvoices((prev) => [inv, ...prev]);
    logActivity('Sanjay Verma', 'issued Invoice', `${inv.invoiceNumber} for ${inv.client}`, 'payment');
    markQaPassed('Payments');
    return inv;
  };

  const markPaymentPaid = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : i))
    );
    logActivity('Sanjay Verma', 'received Payment', 'Advance Invoice Cleared', 'payment');
    addNotification({
      title: 'Payment Received',
      description: 'Payment verified & cleared. Remaining balance recalculated.',
      category: 'green',
      relatedRecord: 'Payment Milestone',
    });
    markQaPassed('Payments');
  };

  // STEP 12: Project Completion
  const completeProject = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'completed', progress: 100 } : p))
    );
    logActivity('Pooja Nair', 'marked Project Completed', 'ABC Hospital Portal', 'project');
    addNotification({
      title: 'Project Completed Successfully',
      description: 'ABC Hospital Portal project delivered & completed!',
      category: 'emerald',
      relatedRecord: 'ABC Hospital',
    });
    markQaPassed('Project');
  };

  // AUTO SIMULATE FULL 12-STEP WORKFLOW
  const simulateFullWorkflow = () => {
    // Step 1: Lead
    const newLeadObj = addLead({
      name: 'ABC Hospital',
      contact: 'Dr. Ramesh Sharma',
      role: 'Medical Director',
      email: 'ramesh@abchospital.org',
      value: 1500000,
      service: 'Website Development',
      assignedTo: 'Rohan Sharma',
    });

    // Step 2 & 3: Followup
    const fol = addFollowup({
      leadId: newLeadObj.id,
      clientName: 'ABC Hospital',
      title: 'Discovery & Scope Call',
    });
    completeFollowup(fol.id, 'Client Approved Scope');

    // Step 4: Convert Opp
    const opp = convertLeadToOpportunity(newLeadObj);

    // Step 5 & 6: Requirement
    const req = addRequirement({
      oppId: opp.id,
      customer: 'ABC Hospital',
      scope: 'Patient OPD Portal & Appointment Scheduler',
    });
    markRequirementReady(req.id);

    // Step 7 & 8: Quotation
    const quote = addQuotation({
      customer: 'ABC Hospital',
      amount: 1500000,
    });
    acceptQuotation(quote.id);

    // Step 9: Project
    const proj = convertOppToProject('ABC Hospital', 1500000);

    // Step 10: Tasks
    const t1 = addTask({ projectId: proj.id, title: 'Database & OPD Schema Setup', assignedTo: 'Alice' });
    const t2 = addTask({ projectId: proj.id, title: 'Patient Appointment UI', assignedTo: 'Vishal Kumar' });
    const t3 = addTask({ projectId: proj.id, title: 'Razorpay Payment Gateway Integration', assignedTo: 'Pooja Nair' });
    const t4 = addTask({ projectId: proj.id, title: 'WhatsApp SMS Notification Webhook', assignedTo: 'Alice' });
    const t5 = addTask({ projectId: proj.id, title: 'UAT & Deployment', assignedTo: 'Vishal Kumar' });

    completeTask(t1.id);
    completeTask(t2.id);
    completeTask(t3.id);
    completeTask(t4.id);
    completeTask(t5.id);

    // Step 11: Payment
    const inv = addPayment({ client: 'ABC Hospital', amount: 1500000 });
    markPaymentPaid(inv.id);

    // Step 12: Complete Project
    completeProject(proj.id);
  };

  const seedDemoData = () => {
    setLeads(INITIAL_LEADS);
    setFollowups(INITIAL_FOLLOWUPS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setActivities(INITIAL_ACTIVITIES);
    addNotification({
      title: 'Demo Data Seeded',
      description: 'CRM seeded with 5 fresh leads, 5 employees, and active projects.',
      category: 'purple',
    });
  };

  const resetCRMData = () => {
    setLeads([]);
    setFollowups([]);
    setOpportunities([]);
    setRequirements([]);
    setQuotations([]);
    setProjects([]);
    setTasks([]);
    setInvoices([]);
    setActivities([]);
    addNotification({
      title: 'CRM Reset',
      description: 'All in-memory mock data reset.',
      category: 'orange',
    });
  };

  return (
    <CRMContext.Provider
      value={{
        isTestingMode,
        setIsTestingMode,
        employees: INITIAL_EMPLOYEES,
        leads,
        followups,
        opportunities,
        requirements,
        quotations,
        clients,
        projects,
        tasks,
        invoices,
        activities,
        qaChecklist,

        // Handlers
        addLead,
        addFollowup,
        completeFollowup,
        convertLeadToOpportunity,
        updateOpportunity,
        updateOpportunityStage,
        deleteOpportunity,
        addRequirement,
        markRequirementReady,
        addQuotation,
        acceptQuotation,
        convertOppToProject,
        addTask,
        completeTask,
        addPayment,
        markPaymentPaid,
        completeProject,
        simulateFullWorkflow,
        seedDemoData,
        resetCRMData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}
