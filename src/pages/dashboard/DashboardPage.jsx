import React, { useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import StatCard from '../../components/cards/StatCard';
import Card from '../../components/cards/Card';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import RevenueChart from '../../components/charts/RevenueChart';
import ProjectDoughnutChart from '../../components/charts/ProjectDoughnutChart';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import { useNotifications } from '../../context/NotificationContext';
import { useCRM } from '../../context/CRMContext';
import { mockDashboardData, mockClients, mockLeads, mockProjects, mockTasks, mockInvoices, mockMeetings } from '../../utils/mockData';
import {
  Building2,
  FolderKanban,
  Wallet,
  CheckSquare,
  Plus,
  CalendarPlus,
  Video,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileText,
  FileCheck,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { stats, revenueChart, projectDistribution } = mockDashboardData;
  const crm = useCRM();
  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    showSuccess(`Created new ${activeModal}!`);
    setActiveModal(null);
    setFormData({});
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <PageTransition>
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-[22px] border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Executive Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Welcome back, <span className="text-brand-primary">Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{todayFormatted}</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">All systems operational</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <SecondaryButton size="sm" icon={Plus} onClick={() => setActiveModal('client')}>
            New Client
          </SecondaryButton>
          <PrimaryButton size="sm" variant="purple" icon={FolderKanban} onClick={() => setActiveModal('project')}>
            New Project
          </PrimaryButton>
          <PrimaryButton size="sm" variant="gold" icon={CalendarPlus} onClick={() => setActiveModal('meeting')}>
            Schedule Meeting
          </PrimaryButton>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Clients"
          value={crm?.clients ? String(crm.clients.length) : stats.totalClients.formatted}
          growth={stats.totalClients.growth}
          isPositive={stats.totalClients.isPositive}
          icon={Building2}
          iconColor="purple"
          sparklineData={stats.totalClients.sparkline}
          onClick={() => navigate('/customers')}
        />
        <StatCard
          title="Active Projects"
          value={crm?.projects ? String(crm.projects.length) : stats.activeProjects.formatted}
          growth={stats.activeProjects.growth}
          isPositive={stats.activeProjects.isPositive}
          icon={FolderKanban}
          iconColor="blue"
          sparklineData={stats.activeProjects.sparkline}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.revenue.formatted}
          growth={stats.revenue.growth}
          isPositive={stats.revenue.isPositive}
          icon={Wallet}
          iconColor="orange"
          sparklineData={stats.revenue.sparkline}
          onClick={() => navigate('/payments')}
        />
        <StatCard
          title="Pending Tasks"
          value={crm?.tasks ? String(crm.tasks.filter(t => t.columnId !== 'completed').length) : stats.pendingTasks.formatted}
          growth={stats.pendingTasks.growth}
          isPositive={false}
          icon={CheckSquare}
          iconColor="green"
          sparklineData={stats.pendingTasks.sparkline}
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-heading text-slate-900">Revenue & Cash Flow</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                  +35.4% YoY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Realized income vs operating burn rate</p>
            </div>
          </div>
          <RevenueChart data={revenueChart} height={280} />
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">Workload by Domain</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active tech offerings distribution</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="text-xs text-brand-primary font-semibold hover:underline flex items-center gap-1"
            >
              Details <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ProjectDoughnutChart data={projectDistribution} height={220} />
        </Card>
      </div>

      {/* Quick Action Modals */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`Create ${activeModal}`}
          subtitle="Quick Dashboard Action"
        >
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <Input label="Title / Name" placeholder="Enter title..." required />
            <TextArea label="Notes" placeholder="Description..." />
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

export default DashboardPage;
