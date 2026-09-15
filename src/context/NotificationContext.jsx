import React, { createContext, useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    category: 'purple', // Purple — New Lead
    categoryLabel: 'New Lead',
    title: 'New Inbound Inquirer',
    description: 'CloudScale Enterprise submitted custom multi-tenant portal inquiry.',
    timestamp: '5 mins ago',
    relatedRecord: 'CloudScale Enterprise',
    relatedPath: '/leads',
    unread: true,
  },
  {
    id: 'n-2',
    category: 'orange', // Orange — Follow-up Reminder
    categoryLabel: 'Follow-up',
    title: 'Scheduled Client Call',
    description: 'Discovery Call with NexGen Digital Solutions scheduled for 11:00 AM.',
    timestamp: '30 mins ago',
    relatedRecord: 'NexGen Digital Solutions',
    relatedPath: '/follow-ups',
    unread: true,
  },
  {
    id: 'n-3',
    category: 'amber', // Amber — Requirement Ready
    categoryLabel: 'Requirement Ready',
    title: 'Scope Confirmed',
    description: 'Apex Health Logistics BLE Sensor App scope marked Ready for Quotation.',
    timestamp: '2 hours ago',
    relatedRecord: 'Apex Health Logistics',
    relatedPath: '/requirements',
    unread: true,
  },
  {
    id: 'n-4',
    category: 'green', // Green — Quotation Accepted
    categoryLabel: 'Quotation Accepted',
    title: 'Proposal Approved',
    description: 'Zenith Global FinTech accepted formal quotation QT-2026-041 (₹18.5L).',
    timestamp: '4 hours ago',
    relatedRecord: 'Zenith Global FinTech',
    relatedPath: '/quotations',
    unread: false,
  },
  {
    id: 'n-5',
    category: 'red', // Red — Payment Overdue
    categoryLabel: 'Payment Overdue',
    title: 'Invoice Payment Overdue',
    description: 'Invoice #INV-2026-092 (₹10.03L) payment date passed.',
    timestamp: '1 day ago',
    relatedRecord: 'Zenith Global FinTech',
    relatedPath: '/payments',
    unread: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const showSuccess = (msg) => {
    toast.success(msg, {
      style: {
        borderRadius: '14px',
        background: '#5B21B6',
        color: '#fff',
        fontWeight: '600',
        fontSize: '13px',
      },
      iconTheme: {
        primary: '#F59E0B',
        secondary: '#5B21B6',
      },
    });
  };

  const showError = (msg) => {
    toast.error(msg, {
      style: {
        borderRadius: '14px',
        background: '#EF4444',
        color: '#fff',
        fontWeight: '600',
        fontSize: '13px',
      },
    });
  };

  const showInfo = (msg) => {
    toast(msg, {
      style: {
        borderRadius: '14px',
        background: '#0F172A',
        color: '#fff',
        fontWeight: '600',
        fontSize: '13px',
      },
      icon: '🔔',
    });
  };

  const addNotification = (item) => {
    const created = {
      id: `n-${Date.now()}`,
      category: item.category || 'purple',
      categoryLabel: item.categoryLabel || 'CRM Update',
      title: item.title || 'Workflow Event',
      description: item.description || '',
      timestamp: 'Just now',
      relatedRecord: item.relatedRecord || 'PEP CRM',
      relatedPath: item.relatedPath || '/dashboard',
      unread: true,
    };
    setNotifications((prev) => [created, ...prev]);
    showSuccess(`${created.title}: ${created.description}`);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showSuccess,
        showError,
        showInfo,
        addNotification,
        markAllAsRead,
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
