import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from './NotificationContext';

const CRMContext = createContext();

const INITIAL_EMPLOYEES = [
  { id: 'emp-1', name: 'Sanjay Verma', role: 'Managing Director & Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', email: 'sanjay@pepsoftware.com', phone: '+91 98200 11223' },
  { id: 'emp-2', name: 'Rohan Sharma', role: 'Sales Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', email: 'rohan@pepsoftware.com', phone: '+91 98200 44556' },
  { id: 'emp-3', name: 'Pooja Nair', role: 'Project Manager', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', email: 'pooja@pepsoftware.com', phone: '+91 98200 77889' },
  { id: 'emp-4', name: 'Vishal Kumar', role: 'Fullstack Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', email: 'vishal@pepsoftware.com', phone: '+91 98200 99001' },
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
    stage: 'discussion',
    source: 'Website Form',
    service: 'Website Development',
    assignedTo: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    createdDate: '2026-03-01',
    expectedClose: '2026-04-15',
    notes: 'Inquiry for patient appointment portal and OPD management web application.',
    history: [
      { id: 'h1', date: '2026-03-01 10:30 AM', author: 'Rohan Sharma', text: 'Lead created via Website Form inquiry for OPD portal.' },
      { id: 'h2', date: '2026-03-05 02:15 PM', author: 'Rohan Sharma', text: 'Discovery call completed. Sent technical capability deck.' },
    ],
  },
  {
    id: 'lead-1',
    name: 'NextGen Digital Solutions',
    contact: 'Ananya Deshmukh',
    role: 'VP Tech',
    email: 'ananya@nexgendigital.com',
    phone: '+91 98201 44521',
    value: 1850000,
    stage: 'proposal',
    source: 'Referral',
    service: 'Custom Software Development',
    assignedTo: { name: 'Sanjay Verma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    createdDate: '2026-02-14',
    expectedClose: '2026-03-30',
    notes: 'Requirement for custom multi-tenant distributor commerce suite.',
    history: [
      { id: 'h1', date: '2026-02-14 11:00 AM', author: 'Sanjay Verma', text: 'Lead introduced via BNI referral.' },
      { id: 'h2', date: '2026-02-28 04:00 PM', author: 'Sanjay Verma', text: 'Presented architecture design proposal.' },
    ],
  },
  {
    id: 'lead-2',
    name: 'QuickBite FoodTech',
    contact: 'Simran Khurana',
    role: 'CEO',
    email: 'simran@quickbiteapp.com',
    phone: '+91 98765 43210',
    value: 850000,
    stage: 'contacted',
    source: 'LinkedIn',
    service: 'Mobile App Development',
    assignedTo: { name: 'Pooja Nair', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    createdDate: '2026-02-22',
    expectedClose: '2026-04-10',
    notes: 'Flutter delivery rider mobile application revamp.',
    history: [
      { id: 'h1', date: '2026-02-22 03:20 PM', author: 'Pooja Nair', text: 'Inbound message on LinkedIn regarding rider app UI redesign.' },
    ],
  },
  {
    id: 'lead-3',
    name: 'Apex Health Logistics',
    contact: 'Dr. Rahul Kapoor',
    role: 'COO',
    email: 'rahul@apexhealthlog.in',
    phone: '+91 98450 12890',
    value: 2400000,
    stage: 'won',
    source: 'Cold Call',
    service: 'Mobile App Development',
    assignedTo: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    createdDate: '2026-01-20',
    expectedClose: '2026-03-25',
    notes: 'Bluetooth BLE cold chain temperature monitor app.',
    history: [
      { id: 'h1', date: '2026-01-20 01:00 PM', author: 'Rohan Sharma', text: 'Outreach call initiated with Dr. Rahul.' },
      { id: 'h2', date: '2026-03-01 11:30 AM', author: 'Rohan Sharma', text: 'Contract signed! Won lead & converted to customer.' },
    ],
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
    service: 'Custom Software Development',
    assignedTo: { name: 'Vishal Kumar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    createdDate: '2026-01-10',
    expectedClose: '2026-02-26',
    notes: 'Enterprise Multi-tenant Cloud Management Console.',
    history: [
      { id: 'h1', date: '2026-01-10 10:00 AM', author: 'Vishal Kumar', text: 'Website inquiry registered.' },
    ],
  },
];

const INITIAL_FOLLOWUPS = [
  {
    id: 'fol-1',
    leadId: 'lead-abc',
    clientName: 'ABC Hospital',
    title: 'Initial Scope & Requirements Discovery Call',
    date: '2026-03-16',
    time: '11:00 AM',
    type: 'Call',
    assignedTo: 'Rohan Sharma',
    status: 'Pending',
    notes: 'Review OPD workflow requirements and patient appointment portal specifications.',
  },
  {
    id: 'fol-2',
    leadId: 'lead-1',
    clientName: 'NextGen Digital Solutions',
    title: 'Architecture Review Session & Budget Discussion',
    date: '2026-03-14',
    time: '02:30 PM',
    type: 'Meeting',
    assignedTo: 'Sanjay Verma',
    status: 'Overdue',
    notes: 'Discuss SAP legacy DB connector specs and pricing schedule.',
  },
  {
    id: 'fol-3',
    leadId: 'lead-2',
    clientName: 'QuickBite FoodTech',
    title: 'WhatsApp Demo Link Follow-up',
    date: '2026-03-18',
    time: '04:00 PM',
    type: 'WhatsApp',
    assignedTo: 'Pooja Nair',
    status: 'Pending',
    notes: 'Share Flutter mobile app demo video and confirm tech stack.',
  },
  {
    id: 'fol-4',
    leadId: 'lead-3',
    clientName: 'Apex Health Logistics',
    title: 'Kickoff Agreement Confirmation',
    date: '2026-03-01',
    time: '11:00 AM',
    type: 'Email',
    assignedTo: 'Rohan Sharma',
    status: 'Completed',
    outcome: 'Client signed agreement & sent advance payment copy.',
    notes: 'Confirm project start date with technical team.',
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    company: 'Apex Health Logistics',
    contactPerson: 'Dr. Rahul Kapoor',
    role: 'COO',
    email: 'rahul@apexhealthlog.in',
    phone: '+91 98450 12890',
    totalSpent: 2400000,
    serviceUsed: 'Mobile App Development',
    status: 'Active',
    joinedDate: '2026-03-01',
    notes: 'Bluetooth BLE cold chain temperature monitor app project.',
  },
  {
    id: 'cust-2',
    company: 'CloudScale Enterprise',
    contactPerson: 'Rajeev Malhotra',
    role: 'Head of IT',
    email: 'r.malhotra@cloudscale.io',
    phone: '+91 98112 34567',
    totalSpent: 1250000,
    serviceUsed: 'Custom Software Development',
    status: 'Active',
    joinedDate: '2026-02-26',
    notes: 'Enterprise Multi-tenant Cloud Management Console.',
  },
];

export const CRMProvider = ({ children }) => {
  const { addNotification } = useNotifications();

  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [followups, setFollowups] = useState(INITIAL_FOLLOWUPS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);

  const [companySettings, setCompanySettings] = useState({
    name: 'Pep Software',
    email: 'contact@pepsoftware.com',
    phone: '+91 98765 00000',
    website: 'https://pepsoftware.com',
    address: 'Mumbai, Maharashtra, India',
    services: [
      'Website Development',
      'Mobile App Development',
      'Custom Software Development',
      'E-commerce Development',
    ],
  });

  // --- ACTIONS ---

  // Add Lead
  const addLead = (leadData) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const created = {
      id: `lead-${Date.now()}`,
      name: leadData.name || 'New Lead Company',
      contact: leadData.contact || 'Contact Person',
      role: leadData.role || 'Decision Maker',
      email: leadData.email || 'lead@company.com',
      phone: leadData.phone || '+91 98000 00000',
      value: Number(leadData.value) || 500000,
      stage: leadData.stage || 'new',
      source: leadData.source || 'Website Form',
      service: leadData.service || 'Website Development',
      assignedTo: typeof leadData.assignedTo === 'object'
        ? leadData.assignedTo
        : { name: leadData.assignedTo || 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      createdDate: todayStr,
      expectedClose: leadData.expectedClose || '2026-05-15',
      notes: leadData.notes || 'Registered in CRM.',
      history: [
        {
          id: `h-${Date.now()}`,
          date: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          author: leadData.assignedTo?.name || 'Rohan Sharma',
          text: `Lead created from source: ${leadData.source || 'Website Form'}. Notes: ${leadData.notes || 'None'}`,
        },
      ],
    };

    setLeads((prev) => [created, ...prev]);

    // If initial follow-up date specified, schedule follow-up
    if (leadData.nextFollowupDate) {
      addFollowup({
        leadId: created.id,
        clientName: created.name,
        title: `Follow-up with ${created.contact}`,
        date: leadData.nextFollowupDate,
        time: leadData.nextFollowupTime || '11:00 AM',
        type: leadData.nextFollowupType || 'Call',
        assignedTo: created.assignedTo.name,
        notes: 'Initial scheduled follow-up',
      });
    }

    addNotification({
      title: 'New Lead Created',
      description: `Lead registered for ${created.name} (${created.service})`,
      category: 'purple',
      relatedRecord: created.name,
    });

    return created;
  };

  const updateLead = (leadId, updatedFields) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            ...updatedFields,
            assignedTo: typeof updatedFields.assignedTo === 'string'
              ? { name: updatedFields.assignedTo, avatar: l.assignedTo?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
              : (updatedFields.assignedTo || l.assignedTo),
          };
        }
        return l;
      })
    );
  };

  const deleteLead = (leadId) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setFollowups((prev) => prev.filter((f) => f.leadId !== leadId));
    addNotification({
      title: 'Lead Deleted',
      description: 'Lead and associated follow-ups removed',
      category: 'orange',
    });
  };

  const addNoteToLead = (leadId, noteText, authorName = 'Sanjay Verma') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newHistory = [
            {
              id: `h-${Date.now()}`,
              date: `${todayStr} ${timeStr}`,
              author: authorName,
              text: noteText,
            },
            ...(l.history || []),
          ];
          return { ...l, history: newHistory };
        }
        return l;
      })
    );
  };

  const convertLeadToCustomer = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    // Update lead stage to won
    updateLead(leadId, { stage: 'won' });

    // Check if customer exists
    if (!customers.some((c) => c.company.toLowerCase() === lead.name.toLowerCase())) {
      const newCust = {
        id: `cust-${Date.now()}`,
        company: lead.name,
        contactPerson: lead.contact,
        role: lead.role,
        email: lead.email,
        phone: lead.phone,
        totalSpent: lead.value,
        serviceUsed: lead.service,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: `Converted from lead (${lead.source}). ${lead.notes || ''}`,
      };

      setCustomers((prev) => [newCust, ...prev]);

      addNotification({
        title: 'Customer Converted!',
        description: `${lead.name} has been added to Customers roster`,
        category: 'green',
        relatedRecord: lead.name,
      });

      return newCust;
    }
    return null;
  };

  // Follow-ups
  const addFollowup = (folData) => {
    const fol = {
      id: `fol-${Date.now()}`,
      leadId: folData.leadId || null,
      clientName: folData.clientName || 'Client',
      title: folData.title || `Follow-up call with ${folData.clientName || 'Client'}`,
      date: folData.date || new Date().toISOString().split('T')[0],
      time: folData.time || '11:00 AM',
      type: folData.type || 'Call',
      assignedTo: folData.assignedTo || 'Rohan Sharma',
      status: folData.status || 'Pending',
      notes: folData.notes || '',
    };

    setFollowups((prev) => [fol, ...prev]);

    // Append to lead history if leadId provided
    if (fol.leadId) {
      addNoteToLead(
        fol.leadId,
        `Follow-up scheduled: "${fol.title}" on ${fol.date} at ${fol.time} (${fol.type})`,
        fol.assignedTo
      );
    }

    addNotification({
      title: 'Follow-up Scheduled',
      description: `Follow-up set for ${fol.clientName} on ${fol.date}`,
      category: 'amber',
      relatedRecord: fol.clientName,
    });

    return fol;
  };

  const completeFollowup = (id, outcomeNote = 'Completed successfully', nextFollowupDate = null) => {
    let targetFol = null;
    setFollowups((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          targetFol = f;
          return { ...f, status: 'Completed', outcome: outcomeNote };
        }
        return f;
      })
    );

    if (targetFol && targetFol.leadId) {
      addNoteToLead(
        targetFol.leadId,
        `Completed Follow-up: "${targetFol.title}". Outcome: ${outcomeNote}`,
        targetFol.assignedTo
      );

      // If next follow-up requested
      if (nextFollowupDate) {
        addFollowup({
          leadId: targetFol.leadId,
          clientName: targetFol.clientName,
          title: `Next follow-up after ${targetFol.title}`,
          date: nextFollowupDate,
          time: '11:00 AM',
          type: 'Call',
          assignedTo: targetFol.assignedTo,
          notes: `Follow-up continuation. Previous outcome: ${outcomeNote}`,
        });
      }
    }

    addNotification({
      title: 'Follow-up Completed',
      description: `Outcome logged for ${targetFol?.clientName || 'Client'}`,
      category: 'green',
    });
  };

  const deleteFollowup = (id) => {
    setFollowups((prev) => prev.filter((f) => f.id !== id));
  };

  const updateCompanySettings = (newSettings) => {
    setCompanySettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <CRMContext.Provider
      value={{
        companySettings,
        updateCompanySettings,
        employees,
        setEmployees,
        leads,
        followups,
        customers,
        clients: customers, // alias for backward compatibility

        // Handlers
        addLead,
        updateLead,
        deleteLead,
        addNoteToLead,
        convertLeadToCustomer,
        addFollowup,
        completeFollowup,
        deleteFollowup,
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

export default CRMContext;
