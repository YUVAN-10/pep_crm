import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Table from '../../components/tables/Table';
import Pagination from '../../components/tables/Pagination';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/forms/SearchBar';
import Select from '../../components/forms/Select';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import OutlineButton from '../../components/buttons/OutlineButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import TextArea from '../../components/forms/TextArea';
import { mockClients } from '../../utils/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Plus,
  Download,
  Building2,
  ExternalLink,
  Mail,
  Phone,
  MoreVertical,
  Filter,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

export const ClientsListPage = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({});
  const { showSuccess, showInfo } = useNotifications();
  const navigate = useNavigate();

  const pageSize = 5;

  // Filtering & Sorting
  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        const matchesSearch =
          client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.industry.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'All' || client.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.company.localeCompare(b.company);
        if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
        if (sortBy === 'projects') return b.projectsCount - a.projectsCount;
        return 0;
      });
  }, [clients, searchQuery, statusFilter, sortBy]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / pageSize) || 1;

  const handleAddClient = (e) => {
    e.preventDefault();
    const created = {
      id: `cli-${Date.now()}`,
      company: newClient.company || 'New Enterprise',
      logo: (newClient.company || 'NE').substring(0, 2).toUpperCase(),
      logoBg: 'bg-purple-600',
      contactPerson: newClient.contactPerson || 'Contact Lead',
      role: newClient.role || 'Director',
      email: newClient.email || 'lead@enterprise.com',
      phone: newClient.phone || '+91 99000 00000',
      website: newClient.website || 'https://enterprise.io',
      address: newClient.address || 'Mumbai, MH',
      industry: newClient.industry || 'Technology',
      projectsCount: 1,
      activeProjects: 1,
      totalSpent: 0,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      about: newClient.about || 'Newly added customer account in PEP CRM.',
    };

    setClients([created, ...clients]);
    setIsAddModalOpen(false);
    setNewClient({});
    showSuccess(`Client ${created.company} registered successfully!`);
  };

  const handleExport = () => {
    showInfo('Exporting client roster in CSV format...');
  };

  const columns = [
    {
      header: 'Company & Domain',
      key: 'company',
      render: (client) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-[14px] ${client.logoBg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
          >
            {client.logo}
          </div>
          <div>
            <span className="font-bold text-slate-900 group-hover:text-brand-primary block font-heading">
              {client.company}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{client.industry}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      key: 'contactPerson',
      render: (client) => (
        <div>
          <p className="font-semibold text-slate-800 text-xs">{client.contactPerson}</p>
          <p className="text-[11px] text-slate-400">{client.role}</p>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'email',
      render: (client) => (
        <div className="space-y-0.5 text-xs text-slate-500">
          <p className="flex items-center gap-1 text-[11px] text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[150px]">{client.email}</span>
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{client.phone}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Active Projects',
      key: 'projectsCount',
      render: (client) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800">{client.activeProjects} active</span>
          <span className="text-slate-400 text-[11px] block">({client.projectsCount} total)</span>
        </div>
      ),
    },
    {
      header: 'Total Value',
      key: 'totalSpent',
      render: (client) => (
        <span className="font-bold text-slate-900 font-sans text-xs">
          {formatCurrency(client.totalSpent)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (client) => (
        <Badge
          dot
          variant={
            client.status === 'Active'
              ? 'success'
              : client.status === 'Pending'
              ? 'warning'
              : 'neutral'
          }
        >
          {client.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (client) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => navigate(`/clients/${client.id}`)}
            className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-purple-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => showInfo(`Editing client profile: ${client.company}`)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Client Portfolio"
        subtitle="Manage client accounts, contracts, project linkages, and billing profiles."
        breadcrumbs={[{ label: 'Clients' }]}
        actions={
          <>
            <OutlineButton icon={Download} size="sm" onClick={handleExport}>
              Export List
            </OutlineButton>
            <PrimaryButton
              variant="orange"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Client
            </PrimaryButton>
          </>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by company, person, domain..."
            className="max-w-md w-full"
          />

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-[12px] px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400/20"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-[12px] px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400/20"
              >
                <option value="name">Company Name (A-Z)</option>
                <option value="spent">Total Spend (High to Low)</option>
                <option value="projects">Projects Count</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Clients Table */}
      {paginatedClients.length > 0 ? (
        <div className="space-y-4">
          <Table
            columns={columns}
            data={paginatedClients}
            onRowClick={(client) => navigate(`/clients/${client.id}`)}
          />
          <Card className="!p-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredClients.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Building2}
            title="No Clients Matched"
            description="We couldn't find any client matching your search criteria. You can clear filters or add a new account."
            actionLabel="Add Client Now"
            onAction={() => setIsAddModalOpen(true)}
          />
        </Card>
      )}

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client Account"
        subtitle="Register a new software enterprise customer in the CRM."
        footer={
          <>
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleAddClient} variant="orange">
              Save Client Account
            </PrimaryButton>
          </>
        }
      >
        <form onSubmit={handleAddClient} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Apex Global Logistics"
            value={newClient.company || ''}
            onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              placeholder="e.g. Rahul Kapoor"
              value={newClient.contactPerson || ''}
              onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
              required
            />
            <Input
              label="Designation / Role"
              placeholder="e.g. Co-Founder & COO"
              value={newClient.role || ''}
              onChange={(e) => setNewClient({ ...newClient, role: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="rahul@company.in"
              value={newClient.email || ''}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+91 98450 00000"
              value={newClient.phone || ''}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Website"
              placeholder="https://company.in"
              value={newClient.website || ''}
              onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
            />
            <Select
              label="Industry"
              options={[
                'Enterprise SaaS',
                'HealthTech & Supply Chain',
                'Fintech & Lending',
                'Direct-to-Consumer Retail',
                'Media & Entertainment',
                'Industrial IoT & Robotics',
              ]}
              value={newClient.industry || ''}
              onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
            />
          </div>

          <TextArea
            label="Company Background & Scope"
            placeholder="Key notes regarding the client's business model and requirements..."
            value={newClient.about || ''}
            onChange={(e) => setNewClient({ ...newClient, about: e.target.value })}
          />
        </form>
      </Modal>
    </PageTransition>
  );
};

export default ClientsListPage;
