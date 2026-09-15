import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import SearchBar from '../../components/forms/SearchBar';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import { useNotifications } from '../../context/NotificationContext';
import { OPPORTUNITY_STAGES, SERVICES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { mockEmployees, mockOpportunities } from '../../utils/mockData';
import {
  Plus,
  LayoutGrid,
  List,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  FileText,
  FileCheck,
  Clock,
  Edit,
  Trash2,
  X,
  Building2,
  CheckCircle2,
  AlertTriangle,
  History,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

const LOST_REASONS = [
  'Price Too High',
  'Competitor Chosen',
  'Budget Cancelled',
  'No Response / Ghosted',
  'Feature Gap / Tech Unsuitable',
  'Timeline Mismatch',
  'Other',
];

export const OpportunitiesPage = () => {
  const crm = useCRM();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [opps, setOpps] = useState([...mockOpportunities]);
  
  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null); // Central Detail drawer
  const [markWonModal, setMarkWonModal] = useState(null); // Convert to project modal
  const [lostModal, setLostModal] = useState(null); // Lost Reason modal { opp, reason, notes }
  const [deleteOppModal, setDeleteOppModal] = useState(null); // Archive/Delete modal
  const [editOppModal, setEditOppModal] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'requirement' | 'quotation' | 'followup'

  const [formData, setFormData] = useState({});
  const { showSuccess, showInfo, showWarning } = useNotifications();
  const navigate = useNavigate();

  const activeOpps = (crm?.opportunities && crm.opportunities.length > 0) ? crm.opportunities : opps;

  const filteredOpps = activeOpps.filter(
    (o) =>
      (o.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineValue = activeOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  // Central Stage Change Handler with Special Workflow Triggers
  const handleStageChange = (opp, newStageId) => {
    if (opp.stage === newStageId) return;
    const stageObj = OPPORTUNITY_STAGES.find((s) => s.id === newStageId);

    // Special Stage Action 1: Won -> Open Convert to Project Modal
    if (newStageId === 'won') {
      setMarkWonModal(opp);
      return;
    }

    // Special Stage Action 2: Lost -> Open Lost Reason Modal
    if (newStageId === 'lost') {
      setLostModal({ opp, reason: LOST_REASONS[0], notes: '' });
      return;
    }

    // Standard Stage Update
    if (crm?.updateOpportunityStage) {
      crm.updateOpportunityStage(opp.id, newStageId);
    } else {
      setOpps((prev) => prev.map((o) => (o.id === opp.id ? { ...o, stage: newStageId } : o)));
    }

    if (selectedOpp && selectedOpp.id === opp.id) {
      setSelectedOpp({ ...selectedOpp, stage: newStageId });
    }

    showSuccess(`Stage updated to "${stageObj?.name || newStageId}" for ${opp.customer}`);

    // Special Stage Action 3: Requirement -> Trigger Add Requirement Modal
    if (newStageId === 'requirement') {
      setActionModal({ type: 'requirement', opp });
    }

    // Special Stage Action 4: Quotation Sent -> Trigger Create Quotation Modal
    if (newStageId === 'quotation_sent') {
      setActionModal({ type: 'quotation', opp });
    }
  };

  // Submit Lost Reason
  const handleConfirmLost = (e) => {
    e.preventDefault();
    if (!lostModal) return;
    const { opp, reason, notes } = lostModal;
    const fullReason = notes ? `${reason} - ${notes}` : reason;

    if (crm?.updateOpportunityStage) {
      crm.updateOpportunityStage(opp.id, 'lost', fullReason);
    } else {
      setOpps((prev) => prev.map((o) => (o.id === opp.id ? { ...o, stage: 'lost', lostReason: fullReason } : o)));
    }

    if (selectedOpp && selectedOpp.id === opp.id) {
      setSelectedOpp({ ...selectedOpp, stage: 'lost', lostReason: fullReason });
    }

    showWarning(`Opportunity for ${opp.customer} marked as Lost (${reason}).`);
    setLostModal(null);
  };

  // Handle Mark Won Conversion to Project
  const handleConfirmWonConversion = (e) => {
    e.preventDefault();
    if (!markWonModal) return;
    if (crm?.updateOpportunityStage) {
      crm.updateOpportunityStage(markWonModal.id, 'won');
    }
    if (crm?.convertOppToProject) {
      crm.convertOppToProject(markWonModal.customer, markWonModal.value);
    }
    showSuccess(`Opportunity Won! Project automatically created for ${markWonModal.customer}`);
    setMarkWonModal(null);
    navigate('/projects');
  };

  // Handle Delete Opportunity
  const handleConfirmDelete = () => {
    if (!deleteOppModal) return;
    if (crm?.deleteOpportunity) {
      crm.deleteOpportunity(deleteOppModal.id);
    } else {
      setOpps((prev) => prev.filter((o) => o.id !== deleteOppModal.id));
    }
    showInfo(`Opportunity "${deleteOppModal.name}" removed from pipeline.`);
    setDeleteOppModal(null);
    if (selectedOpp && selectedOpp.id === deleteOppModal.id) {
      setSelectedOpp(null);
    }
  };

  return (
    <PageTransition>
      <PageHeader
        title="Opportunities & Deals"
        subtitle="Manage sales opportunities, quotation milestones, and deal conversions."
        breadcrumbs={[{ label: 'Opportunities' }]}
        action={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Opportunity
          </PrimaryButton>
        }
      />

      {/* Metric summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-brand-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline Value</p>
            <h3 className="text-xl font-bold font-heading text-slate-900 mt-0.5">
              {formatCurrency(totalPipelineValue)}
            </h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Opportunities</p>
            <h3 className="text-xl font-bold font-heading text-slate-900 mt-0.5">{activeOpps.length} Deals</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
            <h3 className="text-xl font-bold font-heading text-slate-900 mt-0.5">66.7%</h3>
          </div>
        </Card>
      </div>

      {/* Filter and View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search opportunities..." />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban' ? 'bg-white text-brand-primary shadow-2xs' : 'text-slate-600'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-white text-brand-primary shadow-2xs' : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 items-start">
          {OPPORTUNITY_STAGES.map((stage) => {
            const stageOpps = filteredOpps.filter((o) => o.stage === stage.id);
            return (
              <div key={stage.id} className="w-72 shrink-0 bg-slate-50/80 rounded-[20px] p-3 border border-slate-200/60 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color.split(' ')[0]}`} />
                    <h4 className="text-xs font-bold text-slate-800">{stage.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {stageOpps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageOpps.map((opp) => {
                    const currentStageConfig = OPPORTUNITY_STAGES.find((s) => s.id === opp.stage) || stage;
                    return (
                      <div
                        key={opp.id}
                        className="bg-white p-4 rounded-[18px] border border-slate-100 shadow-2xs hover:shadow-md transition-all group"
                      >
                        {/* Service Tag & Stage Selector */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {opp.service}
                          </span>

                          {/* Stage Dropdown Selector */}
                          <select
                            value={opp.stage || 'new'}
                            onChange={(e) => handleStageChange(opp, e.target.value)}
                            className={`text-[10px] font-bold rounded-md px-2 py-1 cursor-pointer outline-none transition-all ${currentStageConfig.color}`}
                            title="Change Stage"
                          >
                            {OPPORTUNITY_STAGES.map((s) => (
                              <option key={s.id} value={s.id} className="bg-white text-slate-800 font-semibold">
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title & Customer */}
                        <h5
                          onClick={() => setSelectedOpp(opp)}
                          className="text-xs font-bold text-slate-900 hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          {opp.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {opp.customer}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-600">{formatCurrency(opp.value)}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Close: {opp.expectedClose || 'TBD'}</span>
                        </div>

                        {/* Card Action Toolbar */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOpp(opp)}
                              className="p-1.5 text-slate-400 hover:text-brand-primary rounded-lg hover:bg-purple-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'requirement', opp })}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Add Requirement"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'quotation', opp })}
                              className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Create Quotation"
                            >
                              <FileCheck className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'followup', opp })}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Add Follow-up"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  name: opp.name,
                                  customer: opp.customer,
                                  service: opp.service,
                                  value: opp.value,
                                  stage: opp.stage,
                                });
                                setEditOppModal(opp);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit Opportunity"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeleteOppModal(opp)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Archive Opportunity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredOpps.map((opp) => {
                  const currentStageConfig = OPPORTUNITY_STAGES.find((s) => s.id === opp.stage) || OPPORTUNITY_STAGES[0];
                  return (
                    <tr key={opp.id} className="hover:bg-slate-50/50">
                      <td
                        onClick={() => setSelectedOpp(opp)}
                        className="p-4 font-bold text-slate-900 cursor-pointer hover:text-brand-primary"
                      >
                        {opp.name}
                      </td>
                      <td className="p-4">{opp.customer}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold">
                          {opp.service}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-600">{formatCurrency(opp.value)}</td>
                      <td className="p-4">
                        <select
                          value={opp.stage || 'new'}
                          onChange={(e) => handleStageChange(opp, e.target.value)}
                          className={`text-[11px] font-bold rounded-md px-2.5 py-1 cursor-pointer outline-none border transition-all ${currentStageConfig.color}`}
                        >
                          {OPPORTUNITY_STAGES.map((s) => (
                            <option key={s.id} value={s.id} className="bg-white text-slate-800 font-semibold">
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">{opp.assignedTo}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedOpp(opp)}
                            className="p-1.5 text-slate-500 hover:text-brand-primary rounded-lg hover:bg-purple-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'requirement', opp })}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="Add Requirement"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'quotation', opp })}
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                            title="Create Quotation"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'followup', opp })}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="Add Follow-up"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                name: opp.name,
                                customer: opp.customer,
                                service: opp.service,
                                value: opp.value,
                                stage: opp.stage,
                              });
                              setEditOppModal(opp);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteOppModal(opp)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* LOST REASON MODAL */}
      {lostModal && (
        <Modal
          isOpen={!!lostModal}
          onClose={() => setLostModal(null)}
          title={`Mark as Lost — ${lostModal.opp.customer}`}
          subtitle="Required: Select a lost reason to maintain CRM pipeline analytics."
        >
          <form onSubmit={handleConfirmLost} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                Documenting lost reasons helps refine sales estimation and target pricing strategy.
              </span>
            </div>

            <Select
              label="Primary Reason for Loss *"
              options={LOST_REASONS}
              value={lostModal.reason}
              onChange={(e) => setLostModal({ ...lostModal, reason: e.target.value })}
              required
            />

            <TextArea
              label="Additional Insights / Feedback (Optional)"
              placeholder="Provide context e.g. competitor quoted 20% lower, client postponed project to Q4..."
              value={lostModal.notes}
              onChange={(e) => setLostModal({ ...lostModal, notes: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setLostModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Confirm Lost Stage
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* MARK WON CONVERSION MODAL */}
      {markWonModal && (
        <Modal
          isOpen={!!markWonModal}
          onClose={() => setMarkWonModal(null)}
          title="Convert Won Deal to Active Project"
          subtitle={`Congratulations! Converting ${markWonModal.name} into an operational project.`}
        >
          <form onSubmit={handleConfirmWonConversion} className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900">{markWonModal.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Offering:</span>
                <span className="font-bold text-purple-700">{markWonModal.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Project Value:</span>
                <span className="font-bold text-emerald-700 text-sm">{formatCurrency(markWonModal.value)}</span>
              </div>
            </div>

            <Select
              label="Assigned Lead Team / Manager"
              options={mockEmployees.map((e) => e.name)}
              defaultValue={markWonModal.assignedTo}
            />
            <Input label="Expected Start Date" type="date" defaultValue="2026-03-20" required />

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setMarkWonModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Confirm & Create Project
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* ARCHIVE / DELETE MODAL */}
      {deleteOppModal && (
        <Modal
          isOpen={!!deleteOppModal}
          onClose={() => setDeleteOppModal(null)}
          title="Archive Opportunity"
          subtitle={`Are you sure you want to remove "${deleteOppModal.name}"?`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              This action will remove the deal card for <strong>{deleteOppModal.customer}</strong> ({formatCurrency(deleteOppModal.value)}) from active Kanban columns.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setDeleteOppModal(null)}>Cancel</SecondaryButton>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ACTION MODAL: ADD REQUIREMENT / CREATE QUOTATION / ADD FOLLOWUP */}
      {actionModal && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => setActionModal(null)}
          title={
            actionModal.type === 'requirement'
              ? `Add Requirement — ${actionModal.opp.customer}`
              : actionModal.type === 'quotation'
              ? `Create Quotation — ${actionModal.opp.customer}`
              : `Add Follow-up — ${actionModal.opp.customer}`
          }
          subtitle={`Connected Workflow Action for ${actionModal.opp.name}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (actionModal.type === 'requirement') {
                if (crm?.addRequirement) {
                  crm.addRequirement({
                    customer: actionModal.opp.customer,
                    scope: formData.scope || 'Custom project requirement scope',
                    ...formData,
                  });
                }
                showSuccess(`Requirement documented for ${actionModal.opp.customer}!`);
                setActionModal(null);
                navigate('/requirements');
              } else if (actionModal.type === 'quotation') {
                if (crm?.addQuotation) {
                  crm.addQuotation({
                    customer: actionModal.opp.customer,
                    amount: formData.amount || actionModal.opp.value,
                    quotationNumber: formData.quotationNumber || `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
                    ...formData,
                  });
                }
                showSuccess(`Quotation created for ${actionModal.opp.customer}!`);
                setActionModal(null);
                navigate('/quotations');
              } else if (actionModal.type === 'followup') {
                if (crm?.addFollowup) {
                  crm.addFollowup({
                    clientName: actionModal.opp.customer,
                    title: formData.title || `Follow up on ${actionModal.opp.name}`,
                    date: formData.date || new Date().toISOString().split('T')[0],
                    time: formData.time || '11:00 AM',
                    notes: formData.notes || 'Follow up discussion on deal requirements.',
                  });
                }
                showSuccess(`Follow-up scheduled for ${actionModal.opp.customer}!`);
                setActionModal(null);
                navigate('/follow-ups');
              }
            }}
            className="space-y-4"
          >
            <Input label="Customer Company" value={actionModal.opp.customer} disabled />
            <Input label="Opportunity Deal" value={actionModal.opp.name} disabled />

            {actionModal.type === 'requirement' && (
              <>
                <TextArea
                  label="Business Requirement Scope"
                  placeholder="Describe modules, features, user roles, integrations..."
                  value={formData.scope || ''}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  required
                />
                <Input
                  label="Target Delivery Timeline"
                  placeholder="e.g. 60 Days SLA"
                  value={formData.timeline || ''}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                />
              </>
            )}

            {actionModal.type === 'quotation' && (
              <>
                <Input
                  label="Quotation Amount (₹)"
                  type="number"
                  defaultValue={actionModal.opp.value}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <Input
                  label="Quotation Reference Number"
                  placeholder="QT-2026-099"
                  onChange={(e) => setFormData({ ...formData, quotationNumber: e.target.value })}
                />
                <Input
                  label="Zoho Invoice / Estimate URL"
                  placeholder="https://books.zoho.com/estimates/12345"
                  onChange={(e) => setFormData({ ...formData, zohoUrl: e.target.value })}
                />
              </>
            )}

            {actionModal.type === 'followup' && (
              <>
                <Input
                  label="Follow-up Title / Agenda"
                  placeholder={`Follow up on ${actionModal.opp.name}`}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <Input
                    label="Time"
                    defaultValue="11:00 AM"
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <TextArea
                  label="Notes / Instructions"
                  placeholder="Discussion agenda for call or meeting..."
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setActionModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Submit & Save</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT OPPORTUNITY MODAL */}
      {editOppModal && (
        <Modal
          isOpen={!!editOppModal}
          onClose={() => setEditOppModal(null)}
          title={`Edit Opportunity — ${editOppModal.name}`}
          subtitle="Update deal parameters and stage."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (crm?.updateOpportunity) {
                crm.updateOpportunity(editOppModal.id, formData);
              }
              showSuccess('Opportunity parameters & stage updated successfully!');
              setEditOppModal(null);
            }}
            className="space-y-4"
          >
            <Input
              label="Opportunity Name *"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Customer Company *"
              value={formData.customer || ''}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Service Type"
                options={SERVICES}
                value={formData.service || SERVICES[0]}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
              <Select
                label="Assigned Employee"
                options={mockEmployees.map((e) => e.name)}
                value={formData.assignedTo || mockEmployees[0].name}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deal Value (₹) *"
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                required
              />
              <Input
                label="Win Probability (%)"
                placeholder="60%"
                value={formData.probability || '60%'}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expected Close Date"
                type="date"
                value={formData.expectedClose || '2026-04-30'}
                onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
              />
              <Select
                label="Pipeline Stage"
                value={formData.stage || 'new'}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                options={OPPORTUNITY_STAGES.map((s) => s.id)}
              />
            </div>
            <TextArea
              label="Next Action / Notes"
              placeholder="e.g. Schedule technical architecture demo..."
              value={formData.nextAction || ''}
              onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setEditOppModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Save Changes</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Opportunity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Opportunity"
        subtitle="Create a deal entry in sales pipeline."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newOppObj = {
              id: `opp-${Date.now()}`,
              name: formData.name || 'New Opportunity Deal',
              customer: formData.customer || 'Client Company',
              service: formData.service || SERVICES[0],
              value: Number(formData.value) || 1000000,
              probability: formData.probability || '60%',
              expectedClose: formData.expectedClose || '2026-04-30',
              assignedTo: formData.assignedTo || mockEmployees[0].name,
              stage: formData.stage || 'new',
              nextAction: formData.nextAction || 'Collect requirements',
            };
            if (crm?.opportunities) {
              crm.opportunities.unshift(newOppObj);
            }
            setOpps([newOppObj, ...opps]);
            setIsAddModalOpen(false);
            setFormData({});
            showSuccess('Opportunity created!');
          }}
          className="space-y-4"
        >
          <Input
            label="Opportunity Name *"
            placeholder="e.g. Enterprise ERP Revamp"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Customer Company *"
            placeholder="e.g. Acme Corp"
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Service Type"
              options={SERVICES}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            />
            <Select
              label="Assigned Employee"
              options={mockEmployees.map((e) => e.name)}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Value (₹) *"
              type="number"
              placeholder="1000000"
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
            <Input
              label="Win Probability (%)"
              placeholder="60%"
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expected Close Date"
              type="date"
              defaultValue="2026-04-30"
              onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
            />
            <Select
              label="Pipeline Stage"
              options={OPPORTUNITY_STAGES.map((s) => s.id)}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            />
          </div>
          <TextArea
            label="Next Action / Notes"
            placeholder="e.g. Schedule technical architecture demo..."
            onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Save Opportunity</PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default OpportunitiesPage;

