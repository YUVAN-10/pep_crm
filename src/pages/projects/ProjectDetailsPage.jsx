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
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { useCRM } from '../../context/CRMContext';
import {
  ArrowLeft,
  User,
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
  Check,
  AlertTriangle,
} from 'lucide-react';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const crm = useCRM();
  const { showSuccess, showWarning, showError } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');

  // Quick Action Modal states
  const [activeModal, setActiveModal] = useState(null); // 'task' | 'payment'
  const [taskData, setTaskData] = useState({});
  const [payData, setPayData] = useState({});

  const project = crm?.projects?.find((p) => p.id === id) || crm?.projects?.[0] || {
    id: 'proj-1',
    title: 'NextGen B2B Distributor Commerce Suite',
    client: 'NextGen Digital Solutions',
    type: 'Custom Software',
    status: 'in_progress',
    statusLabel: 'In Progress',
    budget: 1850000,
    progress: 75,
    deadline: '2026-04-30',
    description: 'Custom B2B e-commerce platform build.',
    team: [{ name: 'Sanjay Verma', role: 'Architect' }],
  };

  const projectTasks = crm?.tasks?.filter((t) => t.projectId === project.id) || [];
  const projectInvoices = crm?.invoices?.filter(
    (inv) => inv.client.toLowerCase() === project.client.toLowerCase()
  ) || [];

  const pendingAmount = projectInvoices
    .filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'tasks', label: 'Tasks', icon: Clock, count: projectTasks.length },
    { id: 'timeline', label: 'Activity Timeline', icon: History },
    { id: 'payments', label: 'Payments', icon: Wallet, count: projectInvoices.length },
  ];

  // Determine current workflow tracker stage
  let trackerStage = 'project_created';
  if (project.status === 'completed') {
    trackerStage = 'project_completed';
  } else if (pendingAmount === 0 && projectInvoices.length > 0) {
    trackerStage = 'payments_completed';
  } else if (projectTasks.length > 0) {
    trackerStage = 'tasks_added';
  }

  // Handle Mark Project Completed with Validation
  const handleMarkProjectCompleted = () => {
    if (crm?.completeProject) {
      const res = crm.completeProject(project.id);
      if (res?.success) {
        showSuccess(`Project "${project.title}" marked as COMPLETED!`);
      } else {
        showWarning(res?.message || 'Cannot complete project: Complete all tasks and clear pending payments first.');
      }
    }
  };

  // Add Task Handler
  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (crm?.addTask) {
      crm.addTask({
        projectId: project.id,
        title: taskData.title || 'New Sprint Task',
        assignedTo: taskData.assignedTo || 'Alice',
        priority: taskData.priority || 'high',
        dueDate: taskData.dueDate || '2026-04-15',
      });
      showSuccess(`Task "${taskData.title || 'New Task'}" added to project!`);
    }
    setActiveModal(null);
    setTaskData({});
  };

  // Add Payment Milestone Handler
  const handleAddPaymentSubmit = (e) => {
    e.preventDefault();
    if (crm?.addPayment) {
      crm.addPayment({
        client: project.client,
        amount: Number(payData.amount) || 500000,
      });
      showSuccess(`Payment milestone issued for ${project.client}!`);
    }
    setActiveModal(null);
    setPayData({});
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
          <div className="flex items-center gap-2">
            <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/projects')}>
              Back to Projects
            </OutlineButton>

            {project.status !== 'completed' && (
              <PrimaryButton
                variant="orange"
                size="sm"
                icon={CheckCircle2}
                onClick={handleMarkProjectCompleted}
              >
                Mark Project Completed
              </PrimaryButton>
            )}
          </div>
        }
      />

      {/* Global Workflow Tracker */}
      <div className="mb-6">
        <WorkflowTracker currentStageId={trackerStage} />
      </div>

      {/* Header Summary Card */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-amber-50 px-2.5 py-0.5 rounded-md">
                {project.type}
              </span>
              <Badge variant={project.status === 'completed' ? 'success' : 'purple'}>
                {project.statusLabel || project.status}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mt-2">{project.title}</h2>
            <p className="text-xs text-slate-500 mt-1">Client: {project.client} • Target Deadline: {formatDate(project.deadline)}</p>
          </div>

          <div className="w-full md:w-64 bg-slate-50 p-3.5 rounded-[16px] border border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Overall Progress</span>
              <span className="text-brand-primary">{project.progress || 0}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 QUICK ACTIONS BAR BELOW HEADER */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Workflow:</span>
            <PrimaryButton size="sm" variant="purple" icon={Plus} onClick={() => setActiveModal('task')}>
              Add Task
            </PrimaryButton>
            <OutlineButton size="sm" icon={DollarSign} onClick={() => setActiveModal('payment')}>
              Add Payment Milestone
            </OutlineButton>
          </div>

          {project.status !== 'completed' && (
            <button
              type="button"
              onClick={handleMarkProjectCompleted}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Project
            </button>
          )}
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

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Contract Budget</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Pending Receivables</span>
                  <p className={`text-lg font-bold mt-0.5 ${pendingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Delivery Deadline</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(project.deadline)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Assigned Engineering Team</h3>
              <div className="space-y-3">
                {project.team?.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-[14px] bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
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
            <h3 className="text-base font-bold font-heading text-slate-900">Sprint Tasks ({projectTasks.length})</h3>
            <PrimaryButton size="sm" icon={Plus} onClick={() => setActiveModal('task')}>
              Add Task
            </PrimaryButton>
          </div>

          {projectTasks.length > 0 ? (
            <div className="space-y-3 text-xs">
              {projectTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className={`font-bold text-slate-900 ${t.columnId === 'completed' ? 'line-through text-slate-400' : ''}`}>
                      {t.title}
                    </p>
                    <span className="text-slate-400">Assigned: {t.assignedTo} • Due: {formatDate(t.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.columnId === 'completed' ? 'success' : 'warning'}>
                      {t.columnId === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                    {t.columnId !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => crm?.completeTask(t.id)}
                        className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-200"
                      >
                        <Check className="w-3 h-3" /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4">No tasks created yet for this project. Click "Add Task" above.</p>
          )}
        </Card>
      )}

      {/* 3. ACTIVITY TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <Card>
          <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Project Activity Timeline</h3>
          <div className="space-y-4 pl-3 border-l-2 border-slate-100 text-xs">
            {crm?.activities
              ?.filter((a) => a.target.toLowerCase().includes(project.client.toLowerCase()) || a.type === 'project')
              ?.map((act) => (
                <div key={act.id} className="relative pl-4">
                  <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                  <p className="font-bold text-slate-900">{act.user} {act.action} — {act.target}</p>
                  <p className="text-slate-400 text-[10px]">{act.time}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* 4. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">Project Invoices & Payment Milestones</h3>
            <PrimaryButton size="sm" icon={Plus} onClick={() => setActiveModal('payment')}>
              Add Milestone Invoice
            </PrimaryButton>
          </div>

          <div className="space-y-3 text-xs">
            {projectInvoices.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-primary">{inv.invoiceNumber}</span>
                  <p className="text-slate-500">Total Amount: {formatCurrency(inv.total)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                  {inv.status !== 'Paid' && (
                    <button
                      type="button"
                      onClick={() => crm?.markPaymentPaid(inv.id)}
                      className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-200"
                    >
                      <Check className="w-3 h-3" /> Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ADD TASK MODAL */}
      {activeModal === 'task' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Add Task — ${project.title}`}
          subtitle="Assign a new task to an employee for this project."
        >
          <form onSubmit={handleAddTaskSubmit} className="space-y-4">
            <Input
              label="Task Name *"
              placeholder="e.g. Build Payment Gateway Webhook Engine"
              value={taskData.title || ''}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              required
            />
            <Select
              label="Assigned Employee"
              options={crm?.employees?.map((emp) => emp.name) || ['Alice', 'Vishal Kumar', 'Pooja Nair']}
              value={taskData.assignedTo || ''}
              onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
            />
            <Select
              label="Priority"
              options={['low', 'medium', 'high', 'critical']}
              value={taskData.priority || 'high'}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={taskData.dueDate || ''}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setActiveModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Create Task
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD PAYMENT MODAL */}
      {activeModal === 'payment' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Issue Payment Milestone — ${project.client}`}
          subtitle="Generate invoice milestone for this project."
        >
          <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
            <Input label="Client Account" value={project.client} disabled />
            <Input
              label="Milestone Amount (₹) *"
              type="number"
              placeholder="500000"
              value={payData.amount || ''}
              onChange={(e) => setPayData({ ...payData, amount: e.target.value })}
              required
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setActiveModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Issue Invoice
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default ProjectDetailsPage;
