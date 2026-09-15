import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import OutlineButton from '../../components/buttons/OutlineButton';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import { mockLeads } from '../../utils/mockData';
import { PIPELINE_STAGES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowLeft,
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
} from 'lucide-react';

export const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();

  const lead = mockLeads.find((l) => l.id === id) || mockLeads[0];
  const [currentStage, setCurrentStage] = useState(lead.stage);

  const handleConvertToClient = () => {
    showSuccess(`Deal WON! Successfully converted ${lead.name} to Active Customer.`);
    setTimeout(() => {
      navigate('/customers');
    }, 1000);
  };

  const stageObj = PIPELINE_STAGES.find((s) => s.id === currentStage);

  return (
    <PageTransition>
      <PageHeader
        title={lead.name}
        subtitle={`Prospect deal qualified • Created on ${formatDate(lead.createdDate)}`}
        breadcrumbs={[
          { label: 'Leads', path: '/leads' },
          { label: lead.name },
        ]}
        actions={
          <>
            <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/leads')}>
              Back to Pipeline
            </OutlineButton>
            <PrimaryButton
              variant="orange"
              size="sm"
              icon={UserCheck}
              onClick={handleConvertToClient}
            >
              Convert to Customer
            </PrimaryButton>
          </>
        }
      />

      {/* GLOBAL WORKFLOW TRACKER BANNER */}
      <div className="mb-6">
        <WorkflowTracker currentStageId="lead_created" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deal Details & Interaction History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">Opportunity Overview</h3>
              <Badge variant="purple">{stageObj?.name}</Badge>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">{lead.notes}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase">Prospect Contact</p>
                <p className="font-bold text-slate-800 text-sm">{lead.contact}</p>
                <p className="text-slate-500">{lead.role}</p>
                <p className="flex items-center gap-1.5 text-brand-primary font-medium">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </p>
                <p className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Phone className="w-3.5 h-3.5" /> {lead.phone}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase">Deal Economics</p>
                <p className="text-2xl font-bold font-heading text-slate-900">{formatCurrency(lead.value)}</p>
                <p className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Expected Close: {formatDate(lead.expectedClose)}
                </p>
                <p className="text-slate-500">Source: <span className="font-semibold text-slate-700">{lead.source}</span></p>
              </div>
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">
              Sales Activity Timeline
            </h3>
            <ActivityTimeline />
          </Card>
        </div>

        {/* Right Col: Rep Info & Next Steps */}
        <div className="space-y-6">
          <Card>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Assigned Account Executive
            </h4>
            <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-[16px] border border-purple-100">
              <img
                src={lead.assignedTo.avatar}
                alt={lead.assignedTo.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-accent/50"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{lead.assignedTo.name}</p>
                <p className="text-xs text-slate-500">Enterprise Sales Lead</p>
                <p className="text-[11px] text-brand-primary font-medium mt-0.5">rohan.s@pepsoftwares.com</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeadDetailsPage;
