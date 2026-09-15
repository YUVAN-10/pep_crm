import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import OutlineButton from '../../components/buttons/OutlineButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import { PIPELINE_STAGES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { useCRM } from '../../context/CRMContext';
import {
  ArrowLeft,
  User,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  Building,
  TrendingUp,
  Sparkles,
  Plus,
} from 'lucide-react';

export const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotifications();
  const crm = useCRM();

  const leads = crm?.leads || [];
  const followups = crm?.followups || [];
  const lead = leads.find((l) => l.id === id) || leads[0] || {
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
  };

  const leadFollowups = followups.filter((f) => f.leadId === lead.id || f.clientName === lead.name);
  const completedFollowups = leadFollowups.filter((f) => f.status === 'Completed');
  const hasCompletedFollowup = completedFollowups.length > 0;

  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [followupForm, setFollowupForm] = useState({});
  const [completeModal, setCompleteModal] = useState(null);
  const [outcome, setOutcome] = useState('Interested');

  const handleAddFollowup = (e) => {
    e.preventDefault();
    if (crm?.addFollowup) {
      crm.addFollowup({
        leadId: lead.id,
        customer: lead.name,
        clientName: lead.name,
        title: followupForm.title || `Follow-up call with ${lead.contact}`,
        date: followupForm.date || new Date().toISOString().split('T')[0],
        time: followupForm.time || '11:00 AM',
        assignedTo: typeof lead.assignedTo === 'object' ? lead.assignedTo.name : lead.assignedTo,
        notes: followupForm.notes || 'Review requirements & discuss next steps',
      });
    }
    setIsFollowupModalOpen(false);
    setFollowupForm({});
    showSuccess('Follow-up scheduled successfully!');
  };

  const handleCompleteFollowup = (e) => {
    e.preventDefault();
    if (crm?.completeFollowup && completeModal) {
      crm.completeFollowup(completeModal.id, outcome);
    }
    setCompleteModal(null);
    showSuccess(`Follow-up completed with outcome: ${outcome}`);
  };

  const handleConvertToOpp = () => {
    if (crm?.convertLeadToOpportunity) {
      crm.convertLeadToOpportunity(lead);
    }
    showSuccess(`Converted ${lead.name} to Opportunity! Navigating to Opportunities...`);
    setTimeout(() => {
      navigate('/opportunities');
    }, 600);
  };

  const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.stage) || { name: 'New Lead' };

  // Calculate current tracker stage
  let trackerStage = 'lead_created';
  if (leadFollowups.length > 0) trackerStage = 'followup_scheduled';
  if (hasCompletedFollowup) trackerStage = 'followup_completed';
  if (lead.stage === 'qualified' || lead.stage === 'converted') trackerStage = 'opportunity_created';

  return (
    <PageTransition>
      <PageHeader
        title={lead.name}
        subtitle={`Prospect lead • Service: ${lead.service || 'Software'} • Created on ${formatDate(lead.createdDate)}`}
        breadcrumbs={[
          { label: 'Leads', path: '/leads' },
          { label: lead.name },
        ]}
        actions={
          <>
            <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/leads')}>
              Back to Leads
            </OutlineButton>
            <SecondaryButton
              size="sm"
              icon={Plus}
              onClick={() => setIsFollowupModalOpen(true)}
            >
              Add Follow-up
            </SecondaryButton>
            <PrimaryButton
              variant="orange"
              size="sm"
              icon={UserCheck}
              onClick={handleConvertToOpp}
            >
              Convert to Opportunity
            </PrimaryButton>
          </>
        }
      />

      {/* GLOBAL WORKFLOW TRACKER BANNER */}
      <div className="mb-6">
        <WorkflowTracker currentStageId={trackerStage} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lead Overview & Follow-ups */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">Lead Overview</h3>
              <Badge variant="purple">{stageObj?.name}</Badge>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">{lead.notes}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase">Prospect Contact</p>
                <p className="font-bold text-slate-800 text-sm">{lead.contact}</p>
                <p className="text-slate-500">{lead.role || 'Contact Lead'}</p>
                <p className="flex items-center gap-1.5 text-brand-primary font-medium">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </p>
                <p className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Phone className="w-3.5 h-3.5" /> {lead.phone}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase">Deal Economics & Service</p>
                <p className="text-2xl font-bold font-heading text-slate-900">{formatCurrency(lead.value)}</p>
                <p className="text-slate-600 font-medium">Service: <span className="font-bold text-brand-primary">{lead.service}</span></p>
                <p className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Expected Close: {formatDate(lead.expectedClose)}
                </p>
                <p className="text-slate-500">Source: <span className="font-semibold text-slate-700">{lead.source}</span></p>
              </div>
            </div>
          </Card>

          {/* Follow-up History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">Follow-up History</h3>
              <SecondaryButton size="sm" icon={Plus} onClick={() => setIsFollowupModalOpen(true)}>
                Schedule Follow-up
              </SecondaryButton>
            </div>

            {leadFollowups.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-[18px] text-center border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No follow-ups scheduled yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Recommended action: Click "Add Follow-up" to schedule discovery call.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leadFollowups.map((fol) => (
                  <div key={fol.id} className="p-3.5 bg-slate-50/80 rounded-[16px] border border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">{fol.title}</span>
                        <Badge variant={fol.status === 'Completed' ? 'success' : 'warning'}>
                          {fol.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Date: {fol.date} at {fol.time} • Assigned to: {fol.assignedTo}
                      </p>
                      {fol.outcome && (
                        <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                          Outcome: {fol.outcome}
                        </p>
                      )}
                    </div>

                    {fol.status !== 'Completed' && (
                      <PrimaryButton size="sm" icon={CheckCircle2} onClick={() => setCompleteModal(fol)}>
                        Complete
                      </PrimaryButton>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">
              Sales Activity Timeline
            </h3>
            <ActivityTimeline />
          </Card>
        </div>

        {/* Right Col: Rep Info & Next Recommended Step */}
        <div className="space-y-6">
          <Card>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Assigned Sales Representative
            </h4>
            <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-[16px] border border-purple-100">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0 ring-2 ring-brand-accent/50">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {typeof lead.assignedTo === 'object' ? lead.assignedTo.name : lead.assignedTo}
                </p>
                <p className="text-xs text-slate-500">Sales Account Executive</p>
                <p className="text-[11px] text-brand-primary font-medium mt-0.5">PEP CRM Sales Team</p>
              </div>
            </div>
          </Card>

          {/* Workflow Recommendation Card */}
          <Card className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white">
            <div className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Next Recommended Action
            </div>
            {!hasCompletedFollowup ? (
              <>
                <p className="text-sm font-semibold text-white mb-2">Schedule & Complete Follow-up</p>
                <p className="text-xs text-purple-200 leading-relaxed mb-4">
                  Connect with {lead.contact} to confirm requirements. Once completed with outcome "Interested", convert this lead to Opportunity.
                </p>
                <PrimaryButton size="sm" variant="gold" icon={Plus} onClick={() => setIsFollowupModalOpen(true)} className="w-full justify-center">
                  Schedule Follow-up
                </PrimaryButton>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-emerald-300 mb-2">Ready for Opportunity Conversion</p>
                <p className="text-xs text-purple-200 leading-relaxed mb-4">
                  Follow-up completed! Click below to carry contact, service, and company details into a formal Opportunity.
                </p>
                <PrimaryButton size="sm" variant="gold" icon={UserCheck} onClick={handleConvertToOpp} className="w-full justify-center">
                  Convert to Opportunity
                </PrimaryButton>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Schedule Followup Modal */}
      {isFollowupModalOpen && (
        <Modal isOpen={isFollowupModalOpen} onClose={() => setIsFollowupModalOpen(false)} title="Schedule Follow-up" subtitle={`Lead: ${lead.name}`}>
          <form onSubmit={handleAddFollowup} className="space-y-4">
            <Input
              label="Follow-up Title"
              placeholder="e.g. Discovery & Technical Scope Call"
              value={followupForm.title || ''}
              onChange={(e) => setFollowupForm({ ...followupForm, title: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={followupForm.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setFollowupForm({ ...followupForm, date: e.target.value })}
                required
              />
              <Input
                label="Time"
                type="time"
                value={followupForm.time || '11:00'}
                onChange={(e) => setFollowupForm({ ...followupForm, time: e.target.value })}
                required
              />
            </div>
            <TextArea
              label="Notes / Agenda"
              placeholder="Discuss OPD booking portal requirements & budget..."
              value={followupForm.notes || ''}
              onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <SecondaryButton onClick={() => setIsFollowupModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Schedule Follow-up</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Complete Followup Modal */}
      {completeModal && (
        <Modal isOpen={!!completeModal} onClose={() => setCompleteModal(null)} title="Complete Follow-up" subtitle={completeModal.title}>
          <form onSubmit={handleCompleteFollowup} className="space-y-4">
            <Select
              label="Follow-up Outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              options={[
                { value: 'Interested', label: 'Interested (Enables Opportunity Conversion)' },
                { value: 'Requested Quotation', label: 'Requested Quotation' },
                { value: 'Needs Revision', label: 'Needs Scope Revision' },
                { value: 'Not Interested', label: 'Not Interested' },
              ]}
              required
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <SecondaryButton onClick={() => setCompleteModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Mark as Completed</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default LeadDetailsPage;

