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
    if (crm?.updateLead && editLeadModal) {
      crm.updateLead(editLeadModal.id, editLeadModal);
    }
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
          <span className="font-bold text-slate-900 group-hover:text-brand-primary block font-heading">
            {lead.name}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Source: {lead.source}
          </span>
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
      header: 'Contact Info',
      key: 'email',
      render: (lead) => (
        <div className="space-y-0.5 text-xs text-slate-500">
          <p className="flex items-center gap-1 text-[11px] text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[140px]">{lead.email}</span>
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{lead.phone}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Interested Service',
      key: 'service',
      render: (lead) => (
        <Badge variant="purple">{lead.service || 'Website Development'}</Badge>
      ),
    },
    {
      header: 'Est. Value',
      key: 'value',
      render: (lead) => (
        <span className="font-bold text-slate-900 font-sans text-xs">
          {formatCurrency(lead.value)}
        </span>
      ),
    },
    {
      header: 'Assigned To',
      key: 'assignedTo',
      render: (lead) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 ring-1 ring-purple-100">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs text-slate-700 font-medium">
            {typeof lead.assignedTo === 'object' ? lead.assignedTo.name : lead.assignedTo}
          </span>
        </div>
      ),
    },
    {
      header: 'Pipeline Stage',
      key: 'stage',
      render: (lead) => {
        const stg = PIPELINE_STAGES.find((s) => s.id === lead.stage);
        return (
          <Badge dot variant="orange">
            {stg?.name || lead.stage}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (lead) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedLead(lead)}
            className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-purple-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            title="Full Page View"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditLeadModal(lead)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setConvertModal(lead)}
            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Convert to Opportunity"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Leads Pipeline"
        subtitle="Track inbound prospects, qualification stages, follow-ups, and opportunity conversions."
        breadcrumbs={[{ label: 'Leads' }]}
        action={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add New Lead
          </PrimaryButton>
        }
      />

      {/* Stage KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stageStats.map((stg) => (
          <Card
            key={stg.id}
            hover
            onClick={() => setStageFilter(stageFilter === stg.id ? 'All' : stg.id)}
            className={`!p-3.5 border-2 cursor-pointer transition-all ${
              stageFilter === stg.id
                ? 'border-brand-primary bg-purple-50/40 shadow-sm'
                : 'border-slate-100 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {stg.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-accent" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-heading text-slate-900">{stg.count}</span>
              <span className="text-xs font-bold text-brand-primary font-sans">
                {formatCurrency(stg.totalVal)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search leads by company, contact, or email..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            options={['All', 'Website Form', 'Referral', 'LinkedIn InMail', 'Cold Outreach']}
            className="w-40 text-xs"
          />

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'table' ? (
        filteredLeads.length > 0 ? (
          <Table
            columns={columns}
            data={filteredLeads}
            onRowClick={(lead) => setSelectedLead(lead)}
          />
        ) : (
          <Card>
            <EmptyState
              icon={UsersRound}
              title="No Leads Found"
              description="No incoming leads match your current search parameters. Clear filters or add a new lead."
              actionLabel="Add Lead"
              onAction={() => setIsAddModalOpen(true)}
            />
          </Card>
        )
      ) : (
        /* Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg.id);
            return (
              <div key={stg.id} className="bg-slate-100/70 p-3 rounded-[20px] min-w-[240px] flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                    <h3 className="font-bold text-xs text-slate-800 font-heading">{stg.name}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-white text-slate-600 rounded-full border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      hover
                      onClick={() => setSelectedLead(lead)}
                      className="!p-3.5 border-slate-200 hover:border-purple-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-xs font-heading group-hover:text-brand-primary">
                          {lead.name}
                        </h4>
                        <span className="text-xs font-bold text-emerald-600 font-sans shrink-0">
                          {formatCurrency(lead.value)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium mb-3">
                        {lead.contact} ({lead.role})
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 text-slate-400">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Building2 className="w-3 h-3 text-purple-600" />
                          {lead.service}
                        </span>
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          {(typeof lead.assignedTo === 'object' ? lead.assignedTo.name : lead.assignedTo).split(' ')[0]}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW LEAD DETAILS DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  Lead Details
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-5">
                <h3 className="text-xl font-bold font-heading text-slate-900">{selectedLead.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Registered on {selectedLead.createdDate}
                </p>
              </div>

              {/* Contact Info */}
              <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-100 space-y-2 mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Contact Information
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Contact Person:</span>
                  <span className="font-bold text-slate-800">{selectedLead.contact} ({selectedLead.role || 'Executive'})</span>
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

              {/* Company Info & Deal Parameters */}
              <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-100 space-y-2 mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Deal Parameters
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Interested Service:</span>
                  <span className="font-bold text-brand-primary">{selectedLead.service || 'Software'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Estimated Value:</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatCurrency(selectedLead.value)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Lead Source:</span>
                  <span className="font-semibold text-slate-700">{selectedLead.source || 'Website Form'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Expected Close:</span>
                  <span className="font-semibold text-slate-700">{selectedLead.expectedClose || '2026-04-30'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Rep:</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                      <User className="w-3 h-3" />
                    </div>
                    {typeof selectedLead.assignedTo === 'object' ? selectedLead.assignedTo.name : selectedLead.assignedTo}
                  </div>
                </div>
              </div>

              {/* Lead Notes */}
              <div className="mb-4">
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
            label="Company Name *"
            placeholder="e.g. Acme Innovations"
            value={newLead.name || ''}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Person *"
              placeholder="e.g. Rajeev Malhotra"
              value={newLead.contact || ''}
              onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
              required
            />
            <Input
              label="Role / Designation"
              placeholder="e.g. VP Technology"
              value={newLead.role || ''}
              onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. rajeev@acme.com"
              value={newLead.email || ''}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            />
            <Input
              label="Phone *"
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Budget (₹)"
              type="number"
              placeholder="850000"
              value={newLead.value || ''}
              onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
            />
            <Select
              label="Lead Source"
              options={['Website Form', 'Referral', 'LinkedIn InMail', 'Cold Outreach', 'Partner Network', 'Events']}
              value={newLead.source || 'Website Form'}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            />
          </div>
          <Input
            label="Expected Close Date"
            type="date"
            value={newLead.expectedClose || '2026-04-30'}
            onChange={(e) => setNewLead({ ...newLead, expectedClose: e.target.value })}
          />
          <TextArea
            label="Notes"
            placeholder="Key requirements & initial deal notes..."
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
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Person"
                value={editLeadModal.contact || ''}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, contact: e.target.value })}
                required
              />
              <Input
                label="Role / Designation"
                value={editLeadModal.role || ''}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, role: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={editLeadModal.email || ''}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={editLeadModal.phone || ''}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Interested Service"
                options={SERVICES}
                value={editLeadModal.service || SERVICES[0]}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, service: e.target.value })}
              />
              <Select
                label="Assigned Employee"
                options={mockEmployees.map((e) => e.name)}
                value={typeof editLeadModal.assignedTo === 'object' ? editLeadModal.assignedTo.name : (editLeadModal.assignedTo || mockEmployees[0].name)}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, assignedTo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deal Value (₹)"
                type="number"
                value={editLeadModal.value || ''}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, value: e.target.value })}
              />
              <Select
                label="Lead Source"
                options={['Website Form', 'Referral', 'LinkedIn InMail', 'Cold Outreach', 'Partner Network', 'Events']}
                value={editLeadModal.source || 'Website Form'}
                onChange={(e) => setEditLeadModal({ ...editLeadModal, source: e.target.value })}
              />
            </div>
            <Input
              label="Expected Close Date"
              type="date"
              value={editLeadModal.expectedClose || '2026-04-30'}
              onChange={(e) => setEditLeadModal({ ...editLeadModal, expectedClose: e.target.value })}
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
