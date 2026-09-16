import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UsersRound,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  ChevronRight,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import { SERVICES, LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';

export const LeadsListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { leads, addLead, employees } = useCRM();
  const { showSuccess } = useNotifications();

  const [viewMode, setViewMode] = useState('table'); // table | pipeline
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    contact: '',
    role: '',
    phone: '',
    email: '',
    service: SERVICES[0],
    source: 'Website Form',
    value: '',
    assignedTo: 'Rohan Sharma',
    notes: '',
    nextFollowupDate: '',
  });

  const getFilteredLeads = () => {
    return leads.filter((l) => {
      if (statusFilter !== 'all' && l.stage !== statusFilter) return false;
      if (serviceFilter !== 'all' && l.service !== serviceFilter) return false;
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.name.toLowerCase().includes(q);
        const matchesContact = l.contact.toLowerCase().includes(q);
        const matchesPhone = l.phone && l.phone.includes(q);
        const matchesEmail = l.email && l.email.toLowerCase().includes(q);
        return matchesName || matchesContact || matchesPhone || matchesEmail;
      }
      return true;
    });
  };

  const filteredLeads = getFilteredLeads();

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadForm.name.trim()) return;
    addLead(leadForm);
    showSuccess(`Lead registered for ${leadForm.name}`);
    setShowAddModal(false);
    setLeadForm({
      name: '',
      contact: '',
      role: '',
      phone: '',
      email: '',
      service: SERVICES[0],
      source: 'Website Form',
      value: '',
      assignedTo: 'Rohan Sharma',
      notes: '',
      nextFollowupDate: '',
    });
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Lead Management
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-brand-primary">
              {leads.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store every lead properly, track complete conversation history, and convert qualified leads to customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-primary shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'pipeline'
                  ? 'bg-white text-brand-primary shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-[20px] border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map((st) => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Services</option>
            {SERVICES.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>
        </div>

        {/* Lead Source Filter */}
        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Sources</option>
            {LEAD_SOURCES.map((src, idx) => (
              <option key={idx} value={src}>{src}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs overflow-hidden space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Lead Name / Contact</th>
                  <th className="pb-3 px-3">Service</th>
                  <th className="pb-3 px-3">Source</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Est. Value</th>
                  <th className="pb-3 px-3">Assigned To</th>
                  <th className="pb-3 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No leads match your current search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const statusObj = LEAD_STATUSES.find((s) => s.id === lead.stage) || { name: lead.stage, color: 'bg-slate-100 text-slate-700' };

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 pr-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className="font-bold text-slate-900 hover:text-brand-primary text-left block"
                          >
                            {lead.name}
                          </button>
                          <div className="text-[11px] text-slate-500">
                            {lead.contact} {lead.role ? `• ${lead.role}` : ''}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>📞 {lead.phone}</span>
                            {lead.email && <span>✉️ {lead.email}</span>}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {lead.service}
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 font-medium">
                          {lead.source}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusObj.color}`}>
                            {statusObj.name}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {formatCurrency(lead.value)}
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 font-medium">
                          {lead.assignedTo?.name || 'Rohan Sharma'}
                        </td>

                        <td className="py-3.5 pl-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/leads/${lead.id}`)}
                              className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:bg-brand-deep"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PIPELINE VIEW */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {LEAD_STATUSES.map((st) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === st.id);

            return (
              <div key={st.id} className="p-3.5 rounded-[20px] bg-slate-100/70 border border-slate-200/80 space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${st.color}`}>
                    {st.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{stageLeads.length}</span>
                </div>

                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-all cursor-pointer space-y-2"
                    >
                      <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                      <p className="text-[11px] text-slate-500">{lead.contact}</p>
                      <p className="text-[10px] font-bold text-purple-700">{lead.service}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-800">{formatCurrency(lead.value)}</span>
                        <span className="text-[10px] text-slate-400">{lead.assignedTo?.name?.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Add New Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. NextGen Digital Solutions"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    value={leadForm.contact}
                    onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Ananya Deshmukh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={leadForm.role}
                    onChange={(e) => setLeadForm({ ...leadForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. VP Tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98201 44521"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="ananya@nexgendigital.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Interest</label>
                  <select
                    value={leadForm.service}
                    onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {SERVICES.map((srv, idx) => (
                      <option key={idx} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {LEAD_SOURCES.map((src, idx) => (
                      <option key={idx} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget / Value (₹)</label>
                  <input
                    type="number"
                    value={leadForm.value}
                    onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1850000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Team Member</label>
                <select
                  value={leadForm.assignedTo}
                  onChange={(e) => setLeadForm({ ...leadForm, assignedTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Lead Notes</label>
                <textarea
                  rows={2}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Requirement details from initial conversation..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsListPage;
