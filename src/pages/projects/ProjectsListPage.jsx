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
import { mockProjects, mockClients } from '../../utils/mockData';
import { PROJECT_STATUSES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Plus,
  User,
  FolderKanban,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ProjectsListPage = () => {
  const crm = useCRM();
  const projects = crm?.projects?.length > 0 ? crm.projects : mockProjects;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProj, setNewProj] = useState({});
  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  // Filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleAddProject = (e) => {
    e.preventDefault();
    const clientSelected = mockClients.find((c) => c.id === newProj.clientId) || mockClients[0];
    if (crm?.convertOppToProject) {
      crm.convertOppToProject(clientSelected.company, Number(newProj.budget) || 1200000);
    }
    setIsAddModalOpen(false);
    setNewProj({});
    showSuccess(`Project initialized successfully!`);
  };

  const columns = [
    {
      header: 'Project & Client',
      key: 'title',
      render: (proj) => (
        <div>
          <span className="font-bold text-slate-900 font-heading text-sm block">
            {proj.title}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Client: {proj.client}</span>
        </div>
      ),
    },
    {
      header: 'Service Type',
      key: 'type',
      render: (proj) => (
        <span className="text-xs text-slate-600 font-medium">{proj.type}</span>
      ),
    },
    {
      header: 'Progress',
      key: 'progress',
      render: (proj) => (
        <div className="w-36">
          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
            <span>{proj.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
              style={{ width: `${proj.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Budget',
      key: 'budget',
      render: (proj) => (
        <span className="font-bold text-slate-900 text-xs font-sans">
          {formatCurrency(proj.budget)}
        </span>
      ),
    },
    {
      header: 'Deadline',
      key: 'deadline',
      render: (proj) => (
        <span className="text-xs text-slate-500 font-medium">{formatDate(proj.deadline)}</span>
      ),
    },
    {
      header: 'Team',
      key: 'team',
      render: (proj) => (
        <div className="flex -space-x-2">
          {proj.team.map((member, i) => (
            <div
              key={i}
              title={member.name}
              className="w-6 h-6 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center ring-2 ring-white"
            >
              <User className="w-3.5 h-3.5" />
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (proj) => (
        <Badge
          variant={
            proj.status === 'completed'
              ? 'success'
              : proj.status === 'in_progress'
              ? 'purple'
              : proj.status === 'review'
              ? 'warning'
              : 'neutral'
          }
        >
          {proj.statusLabel}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (proj) => (
        <button
          type="button"
          onClick={() => navigate(`/projects/${proj.id}`)}
          className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-purple-50 rounded-lg"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Software Projects"
        subtitle="Manage active web applications, mobile builds, AI models, and sprint milestones."
        breadcrumbs={[{ label: 'Projects' }]}
        actions={
          <>
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[14px] border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-brand-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table' ? 'bg-white text-brand-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <PrimaryButton
              variant="orange"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              New Project
            </PrimaryButton>
          </>
        }
      />

      {/* Search and Filters */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search projects by name, client, stack..."
            className="max-w-md w-full"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-[12px] px-3 py-2 outline-none"
            >
              <option value="All">All Statuses</option>
              {PROJECT_STATUSES.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              hover
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent bg-amber-50 px-2 py-0.5 rounded-md">
                    {proj.type}
                  </span>
                  <Badge
                    variant={
                      proj.status === 'completed'
                        ? 'success'
                        : proj.status === 'in_progress'
                        ? 'purple'
                        : 'warning'
                    }
                  >
                    {proj.statusLabel}
                  </Badge>
                </div>

                <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-brand-primary transition-colors leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Client: {proj.client}</p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Progress</span>
                    <span className="text-brand-primary font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team & Deadline Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center -space-x-2">
                    {proj.team.map((m, i) => (
                      <div
                        key={i}
                        title={`${m.name} (${m.role})`}
                        className="w-7 h-7 rounded-full bg-purple-100 text-brand-primary flex items-center justify-center ring-2 ring-white"
                      >
                        <User className="w-4 h-4" />
                      </div>
                    ))}
                  </div>

                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(proj.deadline)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <Table
          columns={columns}
          data={filteredProjects}
          onRowClick={(proj) => navigate(`/projects/${proj.id}`)}
        />
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Initialize New Project"
        subtitle="Define project architecture scope, budget, and deadline."
        footer={
          <>
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleAddProject} variant="orange">
              Create Project
            </PrimaryButton>
          </>
        }
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. AI-Powered Medical Analytics"
            value={newProj.title || ''}
            onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
            required
          />
          <Select
            label="Client Account"
            options={mockClients.map((c) => ({ id: c.id, label: c.company }))}
            value={newProj.clientId || ''}
            onChange={(e) => setNewProj({ ...newProj, clientId: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Service Domain"
              options={[
                'Web Applications',
                'Mobile Apps (iOS/Android)',
                'AI & Enterprise Software',
                'Cloud Infrastructure & Video',
                'SEO & Growth Engine',
              ]}
              value={newProj.type || 'Web Applications'}
              onChange={(e) => setNewProj({ ...newProj, type: e.target.value })}
            />
            <Select
              label="Priority"
              options={['low', 'medium', 'high', 'urgent']}
              value={newProj.priority || 'high'}
              onChange={(e) => setNewProj({ ...newProj, priority: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contract Budget (₹)"
              type="number"
              placeholder="1800000"
              value={newProj.budget || ''}
              onChange={(e) => setNewProj({ ...newProj, budget: e.target.value })}
            />
            <Input
              label="Delivery Deadline"
              type="date"
              value={newProj.deadline || ''}
              onChange={(e) => setNewProj({ ...newProj, deadline: e.target.value })}
            />
          </div>
          <TextArea
            label="Statement of Work & Architecture Scope"
            placeholder="Tech stack, API integrations, deliverable milestones..."
            value={newProj.description || ''}
            onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
          />
        </form>
      </Modal>
    </PageTransition>
  );
};

export default ProjectsListPage;
