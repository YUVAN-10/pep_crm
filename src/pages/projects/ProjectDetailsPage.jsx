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
import { mockProjects, mockTasks, mockInvoices } from '../../utils/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  Plus,
  Layers,
  ExternalLink,
  History,
  Wallet,
  TrendingUp,
  DollarSign,
  Edit,
} from 'lucide-react';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');

  // Quick Action Modal states
  const [activeModal, setActiveModal] = useState(null); // 'task' | 'progress' | 'activity' | 'payment'
  const [progressVal, setProgressVal] = useState(75);

  const project = mockProjects.find((p) => p.id === id) || mockProjects[0];
  const projectTasks = mockTasks.filter((t) => t.project.includes(project.title.split(' ')[0]));
  const projectInvoices = mockInvoices.filter((inv) => inv.project.includes(project.title.split(' ')[0]));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'tasks', label: 'Tasks', icon: Clock, count: projectTasks.length },
    { id: 'timeline', label: 'Activity Timeline', icon: History },
    { id: 'payments', label: 'Payments', icon: Wallet, count: projectInvoices.length },
    { id: 'links', label: 'External Links', icon: ExternalLink },
  ];

  const handleQuickActionSubmit = (e) => {
    e.preventDefault();
    showSuccess(`Action executed for ${project.title}!`);
    setActiveModal(null);
  };

  return (
    <PageTransition>
      <PageHeader
        title={project.title}
        subtitle={`Client: ${project.client} • Budget: ${formatCurrency(project.budget)}`}
        breadcrumbs={[
          { label: 'Projects', path: '/projects' },
          { label: project.title },
        ]}
        actions={
          <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/projects')}>
            Back to Projects
          </OutlineButton>
        }
      />

      {/* Header Summary Card */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-amber-50 px-2.5 py-0.5 rounded-md">
                {project.type}
              </span>
              <Badge variant="purple">{project.statusLabel}</Badge>
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mt-2">{project.title}</h2>
            <p className="text-xs text-slate-500 mt-1">Client: {project.client} • Target Deadline: {formatDate(project.deadline)}</p>
          </div>

          <div className="w-full md:w-64 bg-slate-50 p-3.5 rounded-[16px] border border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Overall Progress</span>
              <span className="text-brand-primary">{project.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 QUICK ACTIONS BAR BELOW HEADER */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</span>
          <PrimaryButton size="sm" variant="purple" icon={Plus} onClick={() => setActiveModal('task')}>
            Add Task
          </PrimaryButton>
          <PrimaryButton size="sm" variant="gold" icon={TrendingUp} onClick={() => setActiveModal('progress')}>
            Update Progress
          </PrimaryButton>
          <SecondaryButton size="sm" icon={History} onClick={() => setActiveModal('activity')}>
            Add Activity
          </SecondaryButton>
          <OutlineButton size="sm" icon={DollarSign} onClick={() => setActiveModal('payment')}>
            Update Payment
          </OutlineButton>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-base font-bold font-heading text-slate-900 mb-3">Scope & Statement of Work</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Contract Budget</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Delivery Date</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(project.deadline)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Assigned Team</h3>
              <div className="space-y-3">
                {project.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-[14px] bg-slate-50 border border-slate-100">
                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{member.name}</p>
                      <p className="text-[11px] text-brand-primary font-medium">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. TASKS TAB */}
      {activeTab === 'tasks' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">Sprint Tasks</h3>
            <PrimaryButton size="sm" icon={Plus} onClick={() => setActiveModal('task')}>
              Add Task
            </PrimaryButton>
          </div>
          <div className="space-y-3 text-xs">
            {projectTasks.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{t.title}</p>
                  <span className="text-slate-400">Due: {formatDate(t.dueDate)}</span>
                </div>
                <Badge variant={t.priority === 'urgent' ? 'danger' : 'warning'}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. ACTIVITY TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <Card>
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Activity Timeline</h3>
          <div className="space-y-4 pl-3 border-l-2 border-slate-100 text-xs">
            <div className="relative pl-4">
              <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <p className="font-bold text-slate-900">Sprint 3 Demo Approved</p>
              <p className="text-slate-500">Client signed off on core APIs.</p>
            </div>
            <div className="relative pl-4">
              <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
              <p className="font-bold text-slate-900">Project Kickoff & DB Architecture</p>
              <p className="text-slate-500">Initialized repository and CI/CD pipelines.</p>
            </div>
          </div>
        </Card>
      )}

      {/* 4. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <Card>
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Project Payment Milestones</h3>
          <div className="space-y-3 text-xs">
            {projectInvoices.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-primary">{inv.invoiceNumber}</span>
                  <p className="text-slate-500">Total: {formatCurrency(inv.total)}</p>
                </div>
                <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. EXTERNAL LINKS TAB */}
      {activeTab === 'links' && (
        <Card>
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Project Repositories & External Links</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">GitHub Repository</span>
                <p className="text-slate-400">https://github.com/pepsoftware/{project.id}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-brand-primary" />
            </div>
          </div>
        </Card>
      )}

      {/* QUICK ACTION MODAL */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`Execute ${activeModal} for ${project.title}`}
          subtitle="Project Management Action"
        >
          <form onSubmit={handleQuickActionSubmit} className="space-y-4">
            <Input label="Action Title" placeholder="Enter title..." required />
            <TextArea label="Notes / Specifications" placeholder="Details..." />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setActiveModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Submit Action</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default ProjectDetailsPage;
