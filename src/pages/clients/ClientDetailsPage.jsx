import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Tabs from '../../components/common/Tabs';
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
import { mockClients, mockProjects, mockInvoices } from '../../utils/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Building2,
  Globe,
  MapPin,
  FolderKanban,
  Wallet,
  FileText,
  FileCheck,
  Clock,
  ArrowLeft,
  Plus,
  ExternalLink,
  History,
  TrendingUp,
  Award,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [activeTab, setActiveTab] = useState('journey');

  const [activeModal, setActiveModal] = useState(null);

  const client = mockClients.find((c) => c.id === id) || mockClients[0];

  const clientProjects = mockProjects.filter(
    (p) => p.clientId === client.id || p.client.includes(client.company.split(' ')[0])
  );
  const clientInvoices = mockInvoices.filter((inv) =>
    inv.client.includes(client.company.split(' ')[0])
  );

  const tabs = [
    { id: 'journey', label: 'Customer Journey', icon: Compass },
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban, count: clientProjects.length },
    { id: 'requirements', label: 'Requirements', icon: FileText, count: 2 },
    { id: 'quotations', label: 'Quotations', icon: FileCheck, count: 1 },
    { id: 'payments', label: 'Payments', icon: Wallet, count: clientInvoices.length },
    { id: 'timeline', label: 'Activity Timeline', icon: History },
    { id: 'links', label: 'External Links', icon: ExternalLink },
  ];

  const handleQuickActionSubmit = (e) => {
    e.preventDefault();
    showSuccess(`Quick action logged for ${client.company}!`);
    setActiveModal(null);
  };

  const journeyMilestones = [
    { stage: 'Lead Created', date: '2024-03-01', desc: 'Inbound inquiry received via partner introduction.', status: 'completed', color: 'bg-purple-100 text-purple-700' },
    { stage: 'Follow-up Scheduled', date: '2024-03-05', desc: 'Architecture discovery call with VP Technology.', status: 'completed', color: 'bg-amber-100 text-amber-700' },
    { stage: 'Opportunity Created', date: '2024-03-10', desc: 'Enterprise SaaS deal registered (₹18.5L).', status: 'completed', color: 'bg-blue-100 text-blue-700' },
    { stage: 'Requirement Collected', date: '2024-03-12', desc: 'Scope document & module breakdown confirmed.', status: 'completed', color: 'bg-purple-100 text-purple-700' },
    { stage: 'Ready for Quotation', date: '2024-03-14', desc: 'SOW finalized for formal billing estimate.', status: 'completed', color: 'bg-amber-100 text-amber-700' },
    { stage: 'Quotation Sent', date: '2024-03-15', desc: 'Quotation #QT-2026-041 dispatched via Zoho.', status: 'completed', color: 'bg-indigo-100 text-indigo-700' },
    { stage: 'Quotation Accepted', date: '2024-03-18', desc: 'Client executive board approved MSA.', status: 'completed', color: 'bg-emerald-100 text-emerald-700' },
    { stage: 'Project Created', date: '2024-03-20', desc: 'Project "NexGen B2B Distributor Commerce Suite" created.', status: 'completed', color: 'bg-blue-100 text-blue-700' },
    { stage: 'Development', date: '2025-11-01', desc: 'Sprint 1-4 microservices backend & Flutter frontend.', status: 'completed', color: 'bg-purple-100 text-purple-700' },
    { stage: 'Testing', date: '2026-02-15', desc: 'Security penetration & UAT client testing.', status: 'current', color: 'bg-brand-primary text-white' },
    { stage: 'Deployment', date: '2026-03-25', desc: 'AWS ECS production rollout.', status: 'upcoming', color: 'bg-slate-100 text-slate-500' },
    { stage: 'Payment Completed', date: '2026-03-28', desc: 'Final milestone invoice settlement.', status: 'upcoming', color: 'bg-slate-100 text-slate-500' },
    { stage: 'Project Completed', date: '2026-03-31', desc: 'Sign-off and maintenance transition.', status: 'upcoming', color: 'bg-slate-100 text-slate-500' },
  ];

  return (
    <PageTransition>
      <PageHeader
        title={client.company}
        subtitle={`${client.industry} • Account active since ${formatDate(client.joinedDate)}`}
        breadcrumbs={[
          { label: 'Customers', path: '/customers' },
          { label: client.company },
        ]}
        actions={
          <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/customers')}>
            Back to Customers
          </OutlineButton>
        }
      />

      {/* GLOBAL WORKFLOW TRACKER BANNER */}
      <div className="mb-6">
        <WorkflowTracker currentStageId="testing" />
      </div>

      {/* CUSTOMER 360 HEADER CARD */}
      <Card className="mb-6 !p-0 overflow-hidden relative">
        <div className="h-28 bg-gradient-to-r from-brand-primary via-purple-900 to-indigo-950 p-6 flex items-end justify-between relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_50%)]" />
        </div>

        <div className="p-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4">
            <div className={`w-20 h-20 rounded-[22px] ${client.logoBg} text-white font-heading font-bold text-2xl flex items-center justify-center border-4 border-white shadow-lg shrink-0`}>
              {client.logo}
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">{client.company}</h2>
                <Badge variant="success" dot>{client.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {client.contactPerson} ({client.role}) • {client.email} • {client.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href={client.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-100 text-xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5" /> {client.website.replace('https://', '')}
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-purple-50 text-xs font-semibold text-brand-primary">
              <MapPin className="w-3.5 h-3.5" /> {client.address}
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</span>
          <PrimaryButton size="sm" variant="purple" icon={FileText} onClick={() => setActiveModal('requirement')}>
            Add Requirement
          </PrimaryButton>
          <PrimaryButton size="sm" variant="gold" icon={FileCheck} onClick={() => setActiveModal('quotation')}>
            Add Quotation
          </PrimaryButton>
          <SecondaryButton size="sm" icon={FolderKanban} onClick={() => setActiveModal('project')}>
            Create Project
          </SecondaryButton>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* JOURNEY TAB */}
      {activeTab === 'journey' && (
        <Card>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">End-to-End Customer Lifecycle Journey</h3>
              <p className="text-xs text-slate-400">Chronological history from initial lead acquisition through deployment</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-brand-primary">
              Active Stage: Testing
            </span>
          </div>

          <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
            {journeyMilestones.map((m, idx) => (
              <div key={idx} className="relative pl-6">
                <span
                  className={`absolute -left-[25px] top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white ${
                    m.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : m.status === 'current'
                      ? 'bg-brand-primary text-white ring-purple-300 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </span>

                <div className="bg-slate-50/80 p-4 rounded-[18px] border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${m.color}`}>
                      {m.stage}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{m.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-2">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <Card>
          <h3 className="text-base font-bold text-slate-900 mb-2">About Client</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{client.about}</p>
        </Card>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientProjects.map((p) => (
            <Card key={p.id} hover onClick={() => navigate(`/projects/${p.id}`)}>
              <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{p.type}</p>
              <div className="mt-3 font-bold text-brand-primary text-xs">{formatCurrency(p.budget)}</div>
            </Card>
          ))}
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <Card>
          <ActivityTimeline />
        </Card>
      )}

      {/* Quick Action Modal */}
      {activeModal && (
        <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title="Customer Action" subtitle="Workflow">
          <form onSubmit={handleQuickActionSubmit} className="space-y-4">
            <Input label="Title" placeholder="Title..." required />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setActiveModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default ClientDetailsPage;
