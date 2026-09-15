/**
 * Realistic Mock Data for PEP Software CRM Suite
 */

export const mockDashboardData = {
  adminName: 'Sanjay Verma',
  adminRole: 'Managing Director',
  adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  stats: {
    totalClients: {
      value: 3,
      formatted: '3',
      growth: '+100%',
      isPositive: true,
      sparkline: [1, 1, 2, 2, 3, 3]
    },
    activeProjects: {
      value: 3,
      formatted: '3',
      growth: '+50%',
      isPositive: true,
      sparkline: [1, 1, 2, 2, 3, 3]
    },
    revenue: {
      value: 1982400,
      formatted: '₹19.8L',
      growth: '+35.4%',
      isPositive: true,
      sparkline: [4.5, 9.8, 14.2, 19.8]
    },
    pendingTasks: {
      value: 2,
      formatted: '2',
      growth: '-33.3%',
      isPositive: true,
      sparkline: [5, 4, 3, 3, 2, 2]
    }
  },
  revenueChart: [
    { month: 'Oct 2025', revenue: 450000, expenses: 180000, target: 400000 },
    { month: 'Nov 2025', revenue: 680000, expenses: 220000, target: 600000 },
    { month: 'Dec 2025', revenue: 980000, expenses: 310000, target: 850000 },
    { month: 'Jan 2026', revenue: 1350000, expenses: 420000, target: 1200000 },
    { month: 'Feb 2026', revenue: 1680000, expenses: 490000, target: 1500000 },
    { month: 'Mar 2026', revenue: 1982400, expenses: 540000, target: 1800000 },
  ],
  projectDistribution: [
    { name: 'Web Applications & APIs', value: 1, color: '#5B21B6' },
    { name: 'Mobile Apps (iOS/Android)', value: 1, color: '#7C3AED' },
    { name: 'Enterprise SaaS', value: 1, color: '#F59E0B' },
  ],
  todayMeetings: [
    {
      id: 'm-1',
      title: 'Enterprise ERP Discovery Call',
      client: 'NexGen Digital Solutions',
      time: '11:00 AM - 11:45 AM',
      type: 'Google Meet',
      participants: [
        { name: 'Sanjay V.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      ],
      isUrgent: true,
    },
    {
      id: 'm-2',
      title: 'Mobile App Sprint Review & Demo',
      client: 'Apex Health Logistics',
      time: '02:30 PM - 03:30 PM',
      type: 'Zoom Video',
      participants: [
        { name: 'Pooja Nair', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { name: 'Amit Gupta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      ],
      isUrgent: false,
    },
    {
      id: 'm-3',
      title: 'Zenith FinTech Architecture Deep-dive',
      client: 'Zenith Global FinTech',
      time: '04:30 PM - 05:15 PM',
      type: 'Client Office',
      participants: [
        { name: 'Sanjay V.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { name: 'Vikram Mehta', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      ],
      isUrgent: false,
    }
  ],
  recentActivities: [
    {
      id: 'act-1',
      user: 'Pooja Nair',
      action: 'completed task',
      target: 'Configure Razorpay webhook signatures validation',
      project: 'Zenith FinTech Neo-Banking Portal',
      time: '12 mins ago',
      type: 'task',
    },
    {
      id: 'act-2',
      user: 'Sanjay Verma',
      action: 'received payment of',
      target: '₹5,31,000 (Invoice #INV-2026-091)',
      project: 'NexGen B2B Distributor Commerce Suite',
      time: '1 hour ago',
      type: 'payment',
    },
    {
      id: 'act-3',
      user: 'Rohan Sharma',
      action: 'moved lead to Proposal stage',
      target: 'CloudScale Enterprise',
      project: 'Enterprise Cloud Migration',
      time: '3 hours ago',
      type: 'lead',
    }
  ]
};

export const mockClients = [
  {
    id: 'cli-1',
    company: 'NexGen Digital Solutions',
    logo: 'NG',
    logoBg: 'bg-purple-600',
    contactPerson: 'Ananya Deshmukh',
    role: 'VP Technology',
    email: 'ananya@nexgendigital.com',
    phone: '+91 98201 44521',
    website: 'https://nexgendigital.io',
    address: 'BKC, Mumbai, MH, India',
    industry: 'Enterprise SaaS',
    projectsCount: 3,
    activeProjects: 2,
    totalSpent: 1850000,
    status: 'Active',
    joinedDate: '2024-03-15',
    about: 'NexGen is a high-growth SaaS platform for retail distributors across India & SEA.',
    recentInvoice: 'INV-2026-091',
  },
  {
    id: 'cli-2',
    company: 'Apex Health Logistics',
    logo: 'AH',
    logoBg: 'bg-amber-600',
    contactPerson: 'Dr. Rahul Kapoor',
    role: 'Co-Founder & COO',
    email: 'rahul@apexhealthlog.in',
    phone: '+91 98450 12890',
    website: 'https://apexhealthlog.in',
    address: 'Indiranagar, Bengaluru, KA',
    industry: 'HealthTech & Supply Chain',
    projectsCount: 2,
    activeProjects: 1,
    totalSpent: 2400000,
    status: 'Active',
    joinedDate: '2023-11-20',
    about: 'Leading cold-chain temperature-monitored pharmaceutical logistics provider.',
    recentInvoice: 'INV-2026-088',
  },
  {
    id: 'cli-3',
    company: 'Zenith Global FinTech',
    logo: 'ZG',
    logoBg: 'bg-indigo-600',
    contactPerson: 'Vikramaditya Mehta',
    role: 'Director of Products',
    email: 'v.mehta@zenithglobal.co',
    phone: '+91 99100 87345',
    website: 'https://zenithglobal.co',
    address: 'Cyber City, Gurugram, HR',
    industry: 'Fintech & Lending',
    projectsCount: 4,
    activeProjects: 3,
    totalSpent: 4200000,
    status: 'Active',
    joinedDate: '2023-06-10',
    about: 'Tier-1 cross-border payment gateway and neo-banking infrastructure builder.',
    recentInvoice: 'INV-2026-084',
  }
];

export const mockLeads = [
  {
    id: 'lead-1',
    name: 'CloudScale Enterprise',
    contact: 'Rajeev Malhotra',
    role: 'Head of IT Infrastructure',
    email: 'r.malhotra@cloudscale.io',
    phone: '+91 98112 34567',
    value: 1250000,
    stage: 'proposal',
    source: 'Referral',
    assignedTo: {
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    createdDate: '2026-02-14',
    expectedClose: '2026-03-30',
    notes: 'Requirement for custom multi-tenant cloud management dashboard with AWS/GCP telemetry.',
    activityHistory: [
      { date: '2026-02-28', note: 'Sent revised technical proposal with milestone pricing.' },
      { date: '2026-02-20', note: 'Held architecture deep-dive with their VP Engineering.' },
      { date: '2026-02-14', note: 'Initial inquiry received via partner introduction.' },
    ]
  },
  {
    id: 'lead-2',
    name: 'QuickBite FoodTech Network',
    contact: 'Simran Khurana',
    role: 'Founder & CEO',
    email: 'simran@quickbiteapp.com',
    phone: '+91 98765 43210',
    value: 850000,
    stage: 'meeting',
    source: 'Website Form',
    assignedTo: {
      name: 'Pooja Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    createdDate: '2026-02-22',
    expectedClose: '2026-04-10',
    notes: 'Looking for a delivery rider app revamp on Flutter + backend node microservices.',
    activityHistory: [
      { date: '2026-02-25', note: 'Scheduled demo for next Monday 11:00 AM.' },
      { date: '2026-02-22', note: 'Lead qualified by SDR team.' }
    ]
  },
  {
    id: 'lead-3',
    name: 'Solace Pharma AI Analytics',
    contact: 'Dr. Arvind Swaminathan',
    role: 'R&D Technology Director',
    email: 'arvind@solacepharma.com',
    phone: '+91 94441 90812',
    value: 2800000,
    stage: 'won',
    source: 'LinkedIn InMail',
    assignedTo: {
      name: 'Sanjay Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    createdDate: '2026-01-10',
    expectedClose: '2026-02-26',
    activityHistory: [
      { date: '2026-02-26', note: 'Master Services Agreement signed. Advance payment invoice sent.' },
      { date: '2026-02-18', note: 'Legal review cleared without objections.' }
    ]
  }
];

export const mockOpportunities = [
  {
    id: 'opp-1',
    name: 'CloudScale Enterprise Portal',
    customer: 'CloudScale Enterprise',
    service: 'Customized Software Development',
    value: 1250000,
    probability: '80%',
    expectedClose: '2026-03-30',
    assignedTo: 'Rohan Sharma',
    stage: 'quotation_sent',
    nextAction: 'Follow up on technical proposal feedback',
  },
  {
    id: 'opp-2',
    name: 'QuickBite Rider App Revamp',
    customer: 'QuickBite FoodTech Network',
    service: 'Mobile App Development',
    value: 850000,
    probability: '60%',
    expectedClose: '2026-04-10',
    assignedTo: 'Pooja Nair',
    stage: 'requirement',
    nextAction: 'Schedule technical architecture demo',
  },
  {
    id: 'opp-3',
    name: 'Solace Pharma AI Engine',
    customer: 'Solace Pharma AI Analytics',
    service: 'Customized Software Development',
    value: 2800000,
    probability: '100%',
    expectedClose: '2026-02-26',
    assignedTo: 'Sanjay Verma',
    stage: 'won',
    nextAction: 'Contract signed. Initiating project setup',
  },
];

export const mockProjects = [
  {
    id: 'proj-1',
    title: 'Zenith FinTech Neo-Banking Portal',
    client: 'Zenith Global FinTech',
    clientId: 'cli-3',
    type: 'Web Application & APIs',
    status: 'in_progress',
    statusLabel: 'In Progress',
    priority: 'urgent',
    budget: 2800000,
    progress: 74,
    startDate: '2025-11-01',
    deadline: '2026-04-15',
    description: 'High-security multi-currency dashboard with KYC workflows and real-time transaction webhooks.',
    team: [
      { name: 'Pooja Nair', role: 'Lead Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { name: 'Amit Gupta', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { name: 'Neha Joshi', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    ],
    milestones: [
      { title: 'System Architecture & Data Modeling', status: 'completed', date: 'Dec 2025' },
      { title: 'Core Banking API Integration', status: 'completed', date: 'Jan 2026' },
      { title: 'Client Web Portal & Multi-Currency UX', status: 'in_progress', date: 'Mar 2026' },
      { title: 'Security Audit & Penetration Testing', status: 'upcoming', date: 'Apr 2026' },
    ],
    taskStats: { total: 42, completed: 31, inProgress: 8, pending: 3 }
  },
  {
    id: 'proj-2',
    title: 'Apex Cold-Chain Mobile App (iOS & Android)',
    client: 'Apex Health Logistics',
    clientId: 'cli-2',
    type: 'Mobile App',
    status: 'in_progress',
    statusLabel: 'In Progress',
    priority: 'high',
    budget: 1800000,
    progress: 88,
    startDate: '2025-10-15',
    deadline: '2026-03-25',
    description: 'Bluetooth BLE sensor integration for continuous temperature monitoring during pharmaceutical transit.',
    team: [
      { name: 'Amit Gupta', role: 'Mobile Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { name: 'Pooja Nair', role: 'QA Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ],
    milestones: [
      { title: 'Hardware BLE Protocol Driver', status: 'completed', date: 'Nov 2025' },
      { title: 'Cross-platform Mobile App Build', status: 'completed', date: 'Jan 2026' },
      { title: 'Field Driver Pilot Testing', status: 'in_progress', date: 'Mar 2026' },
      { title: 'App Store & Play Store Submissions', status: 'upcoming', date: 'Mar 2026' },
    ],
    taskStats: { total: 28, completed: 25, inProgress: 2, pending: 1 }
  },
  {
    id: 'proj-3',
    title: 'NexGen B2B Distributor Commerce Suite',
    client: 'NexGen Digital Solutions',
    clientId: 'cli-1',
    type: 'Enterprise SaaS',
    status: 'review',
    statusLabel: 'Under Review',
    priority: 'medium',
    budget: 1450000,
    progress: 95,
    startDate: '2025-08-01',
    deadline: '2026-03-15',
    description: 'Bulk ordering, credit line management, and automated GST e-invoicing for 5,000+ retail stores.',
    team: [
      { name: 'Rohan Sharma', role: 'Fullstack Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Neha Joshi', role: 'Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    ],
    milestones: [
      { title: 'Order Management Engine', status: 'completed', date: 'Oct 2025' },
      { title: 'GST Billing Microservice', status: 'completed', date: 'Dec 2025' },
      { title: 'UAT & Client Approval', status: 'in_progress', date: 'Mar 2026' },
    ],
    taskStats: { total: 36, completed: 34, inProgress: 2, pending: 0 }
  }
];

export const mockTasks = [
  {
    id: 'task-101',
    title: 'Configure Razorpay webhook signatures validation',
    columnId: 'in_progress',
    project: 'Zenith FinTech Neo-Banking Portal',
    priority: 'urgent',
    dueDate: '2026-03-18',
    label: 'Backend',
    assignedTo: {
      name: 'Amit Gupta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    commentsCount: 4,
    attachmentsCount: 1,
    progress: 60
  },
  {
    id: 'task-103',
    title: 'Build vector embedding generation worker with Qdrant',
    columnId: 'todo',
    project: 'Aura Lifestyle AI Search',
    priority: 'medium',
    dueDate: '2026-03-28',
    label: 'AI / ML',
    assignedTo: {
      name: 'Pooja Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    commentsCount: 2,
    attachmentsCount: 0,
    progress: 0
  },
  {
    id: 'task-106',
    title: 'Complete security audit response for SOC2 Type II cert',
    columnId: 'completed',
    project: 'Zenith FinTech Neo-Banking Portal',
    priority: 'urgent',
    dueDate: '2026-03-05',
    label: 'Security',
    assignedTo: {
      name: 'Sanjay Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    commentsCount: 12,
    attachmentsCount: 4,
    progress: 100
  }
];

export const mockEmployees = [
  {
    id: 'emp-1',
    name: 'Sanjay Verma',
    role: 'Managing Director & Solutions Architect',
    department: 'Executive / Leadership',
    email: 'sanjay@pepsoftwares.com',
    phone: '+91 98200 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    status: 'Active',
    joinDate: '2021-01-15',
    location: 'Mumbai Office',
    skills: ['Enterprise Architecture', 'SaaS Strategy', 'Cloud Infrastructure', 'Team Mentorship'],
    activeProjects: 4,
    completedTasks: 184,
    rating: '4.9/5.0',
    attendance: '98.5%'
  },
  {
    id: 'emp-2',
    name: 'Pooja Nair',
    role: 'Lead AI Engineer & Technical PM',
    department: 'Artificial Intelligence',
    email: 'pooja.n@pepsoftwares.com',
    phone: '+91 98451 99201',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    status: 'Active',
    joinDate: '2022-04-10',
    location: 'Bengaluru Office',
    skills: ['Python', 'PyTorch', 'Vector DBs', 'LLM Fine-Tuning', 'FastAPI'],
    activeProjects: 3,
    completedTasks: 215,
    rating: '5.0/5.0',
    attendance: '99.0%'
  },
  {
    id: 'emp-3',
    name: 'Rohan Sharma',
    role: 'Senior Fullstack Engineer',
    department: 'Web & Cloud',
    email: 'rohan.s@pepsoftwares.com',
    phone: '+91 99102 77334',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    status: 'Active',
    joinDate: '2022-08-01',
    location: 'Pune Office',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Next.js', 'Docker', 'GraphQL'],
    activeProjects: 2,
    completedTasks: 198,
    rating: '4.8/5.0',
    attendance: '97.2%'
  }
];

export const mockInvoices = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-091',
    client: 'NexGen Digital Solutions',
    project: 'NexGen B2B Distributor Commerce Suite',
    amount: 450000,
    tax: 81000,
    total: 531000,
    status: 'Paid',
    issueDate: '2026-02-15',
    dueDate: '2026-03-01',
    paidDate: '2026-02-28',
    paymentMethod: 'HDFC Direct NEFT',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-092',
    client: 'Zenith Global FinTech',
    project: 'Zenith FinTech Neo-Banking Portal',
    amount: 850000,
    tax: 153000,
    total: 1003000,
    status: 'Pending',
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    paidDate: null,
    paymentMethod: 'Pending via Wire Transfer',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-093',
    client: 'Apex Health Logistics',
    project: 'Apex Cold-Chain Mobile App',
    amount: 380000,
    tax: 68400,
    total: 448400,
    status: 'Paid',
    issueDate: '2026-02-10',
    dueDate: '2026-02-25',
    paidDate: '2026-02-24',
    paymentMethod: 'ICICI RTGS',
  }
];

export const mockMeetings = [
  {
    id: 'meet-1',
    title: 'Enterprise ERP Discovery Call',
    client: 'NexGen Technologies',
    date: '2026-03-15',
    time: '11:00 AM - 11:45 AM',
    platform: 'Google Meet',
    link: 'https://meet.google.com/pep-nexgen-erp',
    agenda: 'Review database schema requirements, legacy SAP sync endpoints, and cloud tenancy architecture.',
    host: 'Sanjay Verma',
    attendees: ['sanjay@pepsoftwares.com', 'ananya@nexgendigital.com', 'rohan.s@pepsoftwares.com'],
    status: 'Scheduled'
  },
  {
    id: 'meet-2',
    title: 'Mobile App Sprint Review & Demo',
    client: 'Apex Health Logistics',
    date: '2026-03-15',
    time: '02:30 PM - 03:30 PM',
    platform: 'Zoom',
    link: 'https://zoom.us/j/9820129381',
    agenda: 'Demonstrate live Bluetooth sensor reading under simulated low-connectivity offline mode.',
    host: 'Amit Gupta',
    attendees: ['amit.g@pepsoftwares.com', 'pooja.n@pepsoftwares.com', 'rahul@apexhealthlog.in'],
    status: 'Scheduled'
  },
  {
    id: 'meet-3',
    title: 'Zenith FinTech Architecture Deep-dive',
    client: 'Zenith Global FinTech',
    date: '2026-03-16',
    time: '10:30 AM - 11:30 AM',
    platform: 'In-person / BKC Office',
    link: null,
    agenda: 'Finalize PCI-DSS compliance encryption keys vault and multi-region failover cluster setup.',
    host: 'Sanjay Verma',
    attendees: ['sanjay@pepsoftwares.com', 'v.mehta@zenithglobal.co'],
    status: 'Scheduled'
  }
];

export const mockReportsData = {
  revenueGrowth: [
    { period: 'Oct 2025', revenue: 5800000, newClients: 4, projectsCompleted: 3 },
    { period: 'Nov 2025', revenue: 6400000, newClients: 6, projectsCompleted: 4 },
    { period: 'Dec 2025', revenue: 7100000, newClients: 5, projectsCompleted: 5 },
    { period: 'Jan 2026', revenue: 7800000, newClients: 8, projectsCompleted: 4 },
    { period: 'Feb 2026', revenue: 8100000, newClients: 7, projectsCompleted: 6 },
    { period: 'Mar 2026', revenue: 8450000, newClients: 9, projectsCompleted: 5 },
  ],
  topClients: [
    { name: 'Zenith Global FinTech', revenue: '₹42,00,000', projects: 4, growth: '+28%' },
    { name: 'BlueOrbit Media & OTT', revenue: '₹31,00,000', projects: 2, growth: '+15%' },
    { name: 'Apex Health Logistics', revenue: '₹24,00,000', projects: 2, growth: '+19%' },
  ],
  topEmployees: [
    { name: 'Pooja Nair', role: 'Lead AI Engineer', tasks: 215, onTime: '99%', rating: '5.0' },
    { name: 'Rohan Sharma', role: 'Senior Fullstack', tasks: 198, onTime: '97%', rating: '4.8' },
    { name: 'Amit Gupta', role: 'Lead Mobile Dev', tasks: 174, onTime: '96%', rating: '4.7' },
  ]
};
