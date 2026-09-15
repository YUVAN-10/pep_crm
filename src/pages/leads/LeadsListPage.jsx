import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/forms/SearchBar';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import { mockLeads, mockEmployees } from '../../utils/mockData';
import { PIPELINE_STAGES, SERVICES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Plus,
  UsersRound,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Clock,
  TrendingUp,
  X,
  Building2,
  User,
  ArrowRight,
  FileText,
  FileCheck,
  History,
  CheckCircle2,
} from 'lucide-react';

import { useCRM } from '../../context/CRMContext';

export const LeadsListPage = () => {
  const crm = useCRM();
  const leads = crm?.leads || mockLeads;
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pipeline'

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState(null); // Drawer detail
  const [editLeadModal, setEditLeadModal] = useState(null); // Edit modal
  const [followupModal, setFollowupModal] = useState(null); // Followup modal
  const [convertModal, setConvertModal] = useState(null); // Convert modal
  const [requirementModal, setRequirementModal] = useState(null); // Requirement modal
  const [quotationModal, setQuotationModal] = useState(null); // Quotation modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suggestFollowupModal, setSuggestFollowupModal] = useState(null);

  const [newLead, setNewLead] = useState({});
  const [modalFormData, setModalFormData] = useState({});
  const { showSuccess, showInfo } = useNotifications();
  const navigate = useNavigate();

  // Stage Stats
  const stageStats = useMemo(() => {
    return PIPELINE_STAGES.map((stg) => {
      const stageLeads = leads.filter((l) => l.stage === stg.id);
      const totalVal = stageLeads.reduce((acc, curr) => acc + curr.value, 0);
      return {
        ...stg,
        count: stageLeads.length,
        totalVal,
      };
    });
  }, [leads]);

  // Filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.source.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [leads, searchQuery, stageFilter, sourceFilter]);

  // Add Lead
  const handleAddLead = (e) => {
    e.preventDefault();
    const created = crm?.addLead
      ? crm.addLead(newLead)
      : {
          id: `lead-${Date.now()}`,
          name: newLead.name || 'New Inbound Inquirer',
          contact: newLead.contact || 'Prospect Contact',
          role: newLead.role || 'Decision Maker',
          email: newLead.email || 'lead@prospect.com',
          phone: newLead.phone || '+91 98000 11111',
          value: Number(newLead.value) || 600000,
          stage: newLead.stage || 'new',
          source: newLead.source || 'Website Form',
          assignedTo: {
            name: newLead.assignedTo || 'Sanjay Verma',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          },
          createdDate: new Date().toISOString().split('T')[0],
          expectedClose: newLead.expectedClose || '2026-04-30',
          notes: newLead.notes || 'Inbound lead captured via CRM form.',
        };

    setIsAddModalOpen(false);
    setNewLead({});
    setSuggestFollowupModal(created);
  };

  // Save Edit Lead
  const handleSaveEdit = (e) => {
    e.preventDefault();
    showSuccess('Lead updated successfully!');
    setEditLeadModal(null);
  };

  // Save Convert to Opportunity
  const handleConvertSubmit = (e) => {
    e.preventDefault();
    if (convertModal) {
      if (crm?.convertLeadToOpportunity) {
        crm.convertLeadToOpportunity(convertModal);
      }
    }
    setConvertModal(null);
    navigate('/opportunities');
  };

  // Columns for Table
  const columns = [
    {
      header: 'Company / Lead',
      key: 'name',
      render: (lead) => (
        <div>
          <span className="font-bold text-slate-900 font-heading text-sm block">
            {lead.name}
          </span>
          <span className="text-[11px] text-slate-400">Source: {lead.source}</span>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      key: 'contact',
      render: (lead) => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{lead.contact}</p>
          <p className="text-[11px] text-slate-400">{lead.role}</p>
        </div>
      ),
    },
    {
      header: 'Deal Value',
      key: 'value',
      render: (lead) => (
        <span className="font-bold text-slate-900 font-sans text-sm">
          {formatCurrency(lead.value)}
        </span>
      ),
    },
    {
      header: 'Stage',
      key: 'stage',
      render: (lead) => {
        const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.stage);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageObj?.color || 'bg-slate-100'}`}>
            {stageObj?.name || lead.stage}
          </span>
        );
      },
    },
    {
      header: 'Assigned Employee',
      key: 'assignedTo',
      render: (lead) => (
        <div className="flex items-center gap-2">
          <img
            src={lead.assignedTo.avatar}
            alt={lead.assignedTo.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-slate-700 font-medium">{lead.assignedTo.name}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (lead) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedLead(lead)}
            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setRequirementModal(lead)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add Requirement"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setQuotationModal(lead)}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Create Quotation"
          >
            <FileCheck className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setFollowupModal(lead)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Add Follow-up"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditLeadModal(lead)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setConvertModal(lead)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Convert to Opportunity"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Leads Management"
        subtitle="Capture, qualify, and convert new inbound business inquiries into active opportunities."
        breadcrumbs={[{ label: 'Leads' }]}
        actions={
          <div className="flex items-center gap-3">
            {/* View switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  viewMode === 'table' ? 'bg-white text-brand-primary shadow-2xs' : 'text-slate-500'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  viewMode === 'pipeline' ? 'bg-white text-brand-primary shadow-2xs' : 'text-slate-500'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Pipeline
              </button>
            </div>

            {/* Top-Right Add Lead Button */}
            <PrimaryButton
              variant="orange"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Lead
            </PrimaryButton>
          </div>
        }
      />



      {/* Search & Filter */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by company, contact, or email..."
            className="max-w-md w-full"
          />

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              options={['All', ...PIPELINE_STAGES.map((s) => s.id)]}
              className="py-1.5 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Table / Pipeline Views */}
      {viewMode === 'table' ? (
        <Table columns={columns} data={filteredLeads} onRowClick={(lead) => setSelectedLead(lead)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            return (
              <div key={stage.id} className="bg-slate-50 p-3 rounded-[20px] border border-slate-200 min-w-[220px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 font-bold text-xs text-slate-800">
                  <span>{stage.name}</span>
                  <span className="bg-white px-2 py-0.5 rounded-md text-slate-500">{stageLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 bg-white rounded-[16px] border border-slate-100 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{lead.contact}</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-brand-primary">{formatCurrency(lead.value)}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFollowupModal(lead);
                            }}
                            className="p-1 hover:bg-amber-50 text-amber-600 rounded"
                            title="Follow-up"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RIGHT-SIDE DRAWER: VIEW LEAD DETAILS */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Lead Details
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Contact Info */}
              <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Contact Information
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Contact Person:</span>
                  <span className="font-bold text-slate-800">{selectedLead.contact} ({selectedLead.role})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-purple-700">{selectedLead.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.phone}</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Deal Parameters
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Estimated Value:</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatCurrency(selectedLead.value)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Lead Source:</span>
                  <span className="font-semibold text-slate-700">{selectedLead.source}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Rep:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <img src={selectedLead.assignedTo.avatar} alt="Rep" className="w-5 h-5 rounded-full" />
                    {selectedLead.assignedTo.name}
                  </div>
                </div>
              </div>

              {/* Lead Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Lead Scope & Notes
                </h4>
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 italic">
                  "{selectedLead.notes}"
                </div>
              </div>

              {/* Existing Follow-ups */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Scheduled Follow-ups
                  </h4>
                  <button
                    type="button"
                    onClick={() => setFollowupModal(selectedLead)}
                    className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    + Add New
                  </button>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Client Demo Call
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Upcoming</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Scheduled for Mar 18, 2026 at 11:00 AM</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Activity Timeline
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-100">
                  {selectedLead.activityHistory?.map((act, i) => (
                    <div key={i} className="relative pl-4 text-xs">
                      <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                      <p className="font-bold text-slate-800">{act.note}</p>
                      <span className="text-[10px] text-slate-400">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-10 flex items-center justify-between gap-3">
              <SecondaryButton onClick={() => setEditLeadModal(selectedLead)}>
                Edit Lead
              </SecondaryButton>
              <PrimaryButton
                variant="purple"
                icon={TrendingUp}
                onClick={() => {
                  setConvertModal(selectedLead);
                  setSelectedLead(null);
                }}
              >
                Convert to Opportunity
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Create Follow-up Modal */}
      {suggestFollowupModal && (
        <Modal
          isOpen={!!suggestFollowupModal}
          onClose={() => setSuggestFollowupModal(null)}
          title="Lead Saved Successfully!"
          subtitle={`Would you like to schedule a follow-up touchpoint for ${suggestFollowupModal.name}?`}
          footer={
            <>
              <SecondaryButton onClick={() => setSuggestFollowupModal(null)}>Skip for now</SecondaryButton>
              <PrimaryButton
                variant="orange"
                onClick={() => {
                  setFollowupModal(suggestFollowupModal);
                  setSuggestFollowupModal(null);
                }}
              >
                Create Follow-up Now
              </PrimaryButton>
            </>
          }
        >
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-slate-700">
            <p className="font-bold text-brand-primary">Best Practice:</p>
            <p className="mt-1">Scheduling an immediate follow-up increases lead conversion by over 40%!</p>
          </div>
        </Modal>
      )}

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
        subtitle="Register incoming deal inquiry into CRM."
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Acme Innovations"
            value={newLead.name || ''}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              placeholder="e.g. Rajeev Malhotra"
              value={newLead.contact || ''}
              onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
              required
            />
            <Input
              label="Phone"
              placeholder="+91 98112 00000"
              value={newLead.phone || ''}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Interested Service"
              options={SERVICES}
              value={newLead.service || SERVICES[0]}
              onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
            />
            <Select
              label="Assigned Employee"
              options={mockEmployees.map((e) => e.name)}
              value={newLead.assignedTo || mockEmployees[0].name}
              onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
            />
          </div>
          <Input
            label="Deal Budget (₹)"
            type="number"
            placeholder="850000"
            value={newLead.value || ''}
            onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
          />
          <TextArea
            label="Notes"
            placeholder="Key requirements..."
            value={newLead.notes || ''}
            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" variant="orange">Save Lead</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* Edit Lead Modal */}
      {editLeadModal && (
        <Modal
          isOpen={!!editLeadModal}
          onClose={() => setEditLeadModal(null)}
          title="Edit Lead Details"
          subtitle={`Updating information for ${editLeadModal.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Company Name"
              value={editLeadModal.name || ''}
              onChange={(e) => setEditLeadModal({ ...editLeadModal, name: e.target.value })}
            />
            <Input
              label="Contact Person"
              value={editLeadModal.contact || ''}
              onChange={(e) => setEditLeadModal({ ...editLeadModal, contact: e.target.value })}
            />
            <Input
              label="Deal Value (₹)"
              type="number"
              value={editLeadModal.value || ''}
              onChange={(e) => setEditLeadModal({ ...editLeadModal, value: e.target.value })}
            />
            <TextArea
              label="Notes"
              value={editLeadModal.notes || ''}
              onChange={(e) => setEditLeadModal({ ...editLeadModal, notes: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setEditLeadModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Update Lead</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Follow-up Modal */}
      {followupModal && (
        <Modal
          isOpen={!!followupModal}
          onClose={() => setFollowupModal(null)}
          title="Schedule Follow-up"
          subtitle={`Setting touchpoint for ${followupModal.name}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (crm?.addFollowup) {
                crm.addFollowup({
                  customer: followupModal.name,
                  clientName: followupModal.name,
                  title: modalFormData.title || `Follow up call with ${followupModal.name}`,
                  date: modalFormData.date || new Date().toISOString().split('T')[0],
                  time: modalFormData.time || '11:30 AM',
                  type: modalFormData.type || 'Call',
                  notes: modalFormData.notes || 'Follow-up discussion agenda.',
                  status: 'Today',
                });
              }
              showSuccess(`Follow-up scheduled for ${followupModal.name}!`);
              setFollowupModal(null);
              setModalFormData({});
              navigate('/follow-ups');
            }}
            className="space-y-4"
          >
            <Input label="Company / Prospect" value={followupModal.name} disabled />
            <Input
              label="Follow-up Title / Agenda"
              placeholder={`e.g. Call with ${followupModal.contact || followupModal.name}`}
              onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
              />
              <Input
                label="Time Slot"
                defaultValue="11:30 AM"
                onChange={(e) => setModalFormData({ ...modalFormData, time: e.target.value })}
              />
            </div>
            <Select
              label="Touchpoint Type"
              options={['Call', 'WhatsApp', 'Email', 'Meeting']}
              onChange={(e) => setModalFormData({ ...modalFormData, type: e.target.value })}
            />
            <TextArea
              label="Notes / Instructions"
              placeholder="Discussion notes..."
              onChange={(e) => setModalFormData({ ...modalFormData, notes: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton type="button" onClick={() => setFollowupModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Save & Open Follow-ups
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Convert to Opportunity Modal */}
      {convertModal && (
        <Modal
          isOpen={!!convertModal}
          onClose={() => setConvertModal(null)}
          title="Convert Lead to Opportunity"
          subtitle={`Promote ${convertModal.name} into active sales pipeline.`}
        >
          <form onSubmit={handleConvertSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs text-slate-700">
              <p className="font-bold text-brand-primary">Deal Summary:</p>
              <p className="mt-1">Company: <strong>{convertModal.name}</strong></p>
              <p>Estimated Value: <strong>{formatCurrency(convertModal.value)}</strong></p>
            </div>
            <Select label="Sales Stage" options={['Requirement', 'Quotation Sent', 'Negotiation']} />
            <Input label="Target Close Date" type="date" defaultValue="2026-04-15" />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setConvertModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Confirm Conversion
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Requirement Modal */}
      {requirementModal && (
        <Modal
          isOpen={!!requirementModal}
          onClose={() => setRequirementModal(null)}
          title={`Add Requirement — ${requirementModal.name}`}
          subtitle="Document project scope, tech stack, and timeline."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (crm?.addRequirement) {
                crm.addRequirement({
                  customer: requirementModal.name,
                  scope: modalFormData.scope || 'Initial lead requirements gathering.',
                  ...modalFormData,
                });
              }
              showSuccess(`Requirement saved for ${requirementModal.name}!`);
              setRequirementModal(null);
              navigate('/requirements');
            }}
            className="space-y-4"
          >
            <Input label="Lead / Company" value={requirementModal.name} disabled />
            <TextArea
              label="Business Requirement Scope"
              placeholder="Features, integrations, modules..."
              value={modalFormData.scope || ''}
              onChange={(e) => setModalFormData({ ...modalFormData, scope: e.target.value })}
              required
            />
            <Input
              label="Target Delivery Timeline"
              placeholder="e.g. 60 Days SLA"
              value={modalFormData.timeline || ''}
              onChange={(e) => setModalFormData({ ...modalFormData, timeline: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setRequirementModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Save Requirement</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Quotation Modal */}
      {quotationModal && (
        <Modal
          isOpen={!!quotationModal}
          onClose={() => setQuotationModal(null)}
          title={`Create Quotation — ${quotationModal.name}`}
          subtitle="Generate commercial proposal for lead."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (crm?.addQuotation) {
                crm.addQuotation({
                  customer: quotationModal.name,
                  amount: modalFormData.amount || quotationModal.value,
                  quotationNumber: modalFormData.quotationNumber || `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
                  ...modalFormData,
                });
              }
              showSuccess(`Quotation generated for ${quotationModal.name}!`);
              setQuotationModal(null);
              navigate('/quotations');
            }}
            className="space-y-4"
          >
            <Input label="Lead / Company" value={quotationModal.name} disabled />
            <Input
              label="Quotation Amount (₹)"
              type="number"
              defaultValue={quotationModal.value}
              onChange={(e) => setModalFormData({ ...modalFormData, amount: e.target.value })}
              required
            />
            <Input
              label="Quotation Reference #"
              placeholder="QT-2026-045"
              onChange={(e) => setModalFormData({ ...modalFormData, quotationNumber: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setQuotationModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">Generate & Save Quotation</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default LeadsListPage;
