import React, { useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import SearchBar from '../../components/forms/SearchBar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import EmptyState from '../../components/common/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import { useCRM } from '../../context/CRMContext';
import { mockClients, mockEmployees } from '../../utils/mockData';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Video,
  ExternalLink,
  Filter,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_FOLLOWUPS = [
  {
    id: 'fup-1',
    customer: 'NexGen Digital Solutions',
    phone: '+91 98201 44521',
    relatedModule: 'Lead: Enterprise ERP',
    relatedPath: '/leads/lead-1',
    date: '2026-03-15',
    time: '11:00 AM',
    type: 'Call',
    assignedTo: mockEmployees[0],
    notes: 'Discuss cloud hosting architecture and SAP legacy sync requirements.',
    status: 'Today',
  },
  {
    id: 'fup-2',
    customer: 'Apex Health Logistics',
    phone: '+91 98450 12890',
    relatedModule: 'Opportunity: Cold-Chain App',
    relatedPath: '/opportunities',
    date: '2026-03-15',
    time: '02:30 PM',
    type: 'Meeting',
    assignedTo: mockEmployees[1],
    notes: 'Demonstrate live BLE Bluetooth temperature sensor sync under low network connectivity.',
    status: 'Today',
  },
  {
    id: 'fup-3',
    customer: 'Zenith Global FinTech',
    phone: '+91 99100 87345',
    relatedModule: 'Customer: Zenith Portal',
    relatedPath: '/customers/cli-3',
    date: '2026-03-14',
    time: '04:00 PM',
    type: 'Email',
    assignedTo: mockEmployees[2],
    notes: 'Follow up on pending Q1 tax invoice payment (#INV-2026-092).',
    status: 'Overdue',
  },
  {
    id: 'fup-4',
    customer: 'QuickBite FoodTech Network',
    phone: '+91 98765 43210',
    relatedModule: 'Lead: Rider App Revamp',
    relatedPath: '/leads/lead-2',
    date: '2026-03-18',
    time: '03:00 PM',
    type: 'WhatsApp',
    assignedTo: mockEmployees[1],
    notes: 'Send updated wireframes for rider order acceptance screen.',
    status: 'Upcoming',
  },
  {
    id: 'fup-5',
    customer: 'Solace Pharma AI Analytics',
    phone: '+91 94441 90812',
    relatedModule: 'Quotation: MSA Agreement',
    relatedPath: '/quotations',
    date: '2026-03-10',
    time: '11:30 AM',
    type: 'Call',
    assignedTo: mockEmployees[0],
    notes: 'Confirmed Master Services Agreement execution and advance billing.',
    status: 'Completed',
  },
];

export const FollowupsPage = () => {
  const crm = useCRM();
  const followupsList = crm?.followups?.length > 0 ? crm.followups : INITIAL_FOLLOWUPS;
  const [activeTab, setActiveTab] = useState('Today'); // 'Today' | 'Upcoming' | 'Overdue' | 'Completed' | 'All'
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modals
  const [completeModal, setCompleteModal] = useState(null); // Complete modal
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFollowupForm, setNewFollowupForm] = useState({});

  const [completeForm, setCompleteForm] = useState({
    outcome: 'Positive Response',
    notes: '',
    scheduleNext: 'No',
  });

  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  // Handle Complete Submission
  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (completeModal && crm?.completeFollowup) {
      crm.completeFollowup(completeModal.id, `${completeForm.outcome}: ${completeForm.notes}`);
    }
    showSuccess('Follow-up marked as Completed!');
    setCompleteModal(null);

    if (completeForm.scheduleNext === 'Yes') {
      setIsAddModalOpen(true);
    }
  };

  // Handle Reschedule Submission
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (rescheduleItem && crm?.addFollowup) {
      crm.addFollowup({
        customer: rescheduleItem.customer,
        clientName: rescheduleItem.customer,
        date: rescheduleItem.newDate,
        time: rescheduleItem.newTime || rescheduleItem.time,
        status: 'Upcoming',
      });
    }
    showSuccess(`Follow-up rescheduled to ${rescheduleItem.newDate}!`);
    setRescheduleItem(null);
  };

  // Handle Add Followup Submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (crm?.addFollowup) {
      crm.addFollowup({
        customer: newFollowupForm.customer || 'Prospect Client',
        clientName: newFollowupForm.customer || 'Prospect Client',
        title: newFollowupForm.title || 'Client Follow-up Call',
        date: newFollowupForm.date || new Date().toISOString().split('T')[0],
        time: newFollowupForm.time || '11:00 AM',
        type: newFollowupForm.type || 'Call',
        notes: newFollowupForm.notes || 'Follow-up agenda.',
        status: 'Today',
      });
    }
    showSuccess('Follow-up created successfully!');
    setIsAddModalOpen(false);
    setNewFollowupForm({});
  };

  const normalizedFollowups = (crm?.followups?.length > 0 ? crm.followups : INITIAL_FOLLOWUPS).map((item) => ({
    ...item,
    customer: item.customer || item.clientName || 'Prospect Client',
    notes: item.notes || '',
    status: item.status || 'Today',
    type: item.type || 'Call',
    relatedModule: item.relatedModule || 'Lead Record',
    relatedPath: item.relatedPath || '/leads',
  }));

  const filteredFollowups = normalizedFollowups.filter((item) => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : (item.status || '').toLowerCase() === activeTab.toLowerCase() ||
          (activeTab === 'Today' && (item.status === 'Pending' || item.status === 'Today'));
    const matchesSearch =
      (item.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesTab && matchesSearch && matchesType;
  });

  const tabs = [
    { id: 'Today', label: 'Today', count: normalizedFollowups.filter((f) => f.status === 'Today' || f.status === 'Pending').length },
    { id: 'Upcoming', label: 'Upcoming', count: normalizedFollowups.filter((f) => f.status === 'Upcoming').length },
    { id: 'Overdue', label: 'Overdue', count: normalizedFollowups.filter((f) => f.status === 'Overdue').length },
    { id: 'Completed', label: 'Completed', count: normalizedFollowups.filter((f) => f.status === 'Completed').length },
    { id: 'All', label: 'All', count: normalizedFollowups.length },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Follow-ups & Touchpoints"
        subtitle="Track customer check-ins, phone calls, and automated follow-up schedules."
        actions={
          <PrimaryButton icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Follow-up
          </PrimaryButton>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer or notes..."
          className="max-w-md w-full"
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={['All', 'Call', 'WhatsApp', 'Email', 'Meeting']}
          className="w-40 py-1.5 text-xs"
        />
      </div>

      {/* Follow-up Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFollowups.map((item) => (
          <Card
            key={item.id}
            className={`flex flex-col justify-between transition-all ${
              item.status === 'Overdue'
                ? 'border-l-4 border-l-rose-500 bg-rose-50/20'
                : 'border-l-4 border-l-brand-primary'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  {item.date} • {item.time}
                </span>

                {item.status === 'Today' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                    Today
                  </span>
                ) : (
                  <Badge variant={item.status === 'Overdue' ? 'danger' : item.status === 'Completed' ? 'success' : 'info'}>
                    {item.status}
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">{item.customer}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{item.relatedModule}</p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs italic text-slate-700">
                "{item.notes}"
              </div>
            </div>

            {/* ACTION BUTTONS ON EVERY CARD */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                {/* Complete Button */}
                {item.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => setCompleteModal(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Complete
                  </button>
                )}

                {/* Reschedule Button */}
                <button
                  type="button"
                  onClick={() => setRescheduleItem({ id: item.id, customer: item.customer, newDate: item.date })}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-brand-primary hover:bg-purple-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Reschedule
                </button>
              </div>

              <div className="flex items-center gap-1">
                {/* View Customer Button */}
                <button
                  type="button"
                  onClick={() => navigate(item.relatedPath)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium"
                  title="View Customer"
                >
                  <Building2 className="w-4 h-4" />
                </button>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${item.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  title="WhatsApp Client"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                {/* Phone Button */}
                <a
                  href={`tel:${item.phone}`}
                  className="p-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                  title="Call Client"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* COMPLETION MODAL */}
      {completeModal && (
        <Modal
          isOpen={!!completeModal}
          onClose={() => setCompleteModal(null)}
          title="Complete Follow-up"
          subtitle={`Log outcome for ${completeModal.customer}`}
        >
          <form onSubmit={handleCompleteSubmit} className="space-y-4">
            <Select
              label="Call / Meeting Outcome"
              options={['Positive Response', 'Requirement Clarified', 'Proposal Requested', 'Rescheduled Request', 'No Answer']}
              value={completeForm.outcome}
              onChange={(e) => setCompleteForm({ ...completeForm, outcome: e.target.value })}
            />
            <TextArea
              label="Outcome Notes"
              placeholder="Record details of conversation..."
              value={completeForm.notes}
              onChange={(e) => setCompleteForm({ ...completeForm, notes: e.target.value })}
            />
            <Select
              label="Schedule Next Follow-up?"
              options={['No', 'Yes']}
              value={completeForm.scheduleNext}
              onChange={(e) => setCompleteForm({ ...completeForm, scheduleNext: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setCompleteModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Save & Move to Completed
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleItem && (
        <Modal
          isOpen={!!rescheduleItem}
          onClose={() => setRescheduleItem(null)}
          title="Reschedule Follow-up"
          subtitle={`Set new target date for ${rescheduleItem.customer}`}
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <Input
              label="New Date"
              type="date"
              value={rescheduleItem.newDate}
              onChange={(e) => setRescheduleItem({ ...rescheduleItem, newDate: e.target.value })}
              required
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setRescheduleItem(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Confirm Reschedule</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default FollowupsPage;
