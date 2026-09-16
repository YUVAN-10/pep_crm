import React, { useState } from 'react';
import {
  Building2,
  Users,
  Sliders,
  Bell,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import { SERVICES, LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';

export const SettingsPage = () => {
  const { employees, companySettings, updateCompanySettings } = useCRM();
  const { showSuccess } = useNotifications();

  const [activeTab, setActiveTab] = useState('company');

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: companySettings?.name || 'Pep Software',
    email: companySettings?.email || 'contact@pepsoftware.com',
    phone: companySettings?.phone || '+91 98765 00000',
    website: companySettings?.website || 'https://pepsoftware.com',
    address: companySettings?.address || 'Mumbai, Maharashtra, India',
    services: companySettings?.services || SERVICES,
  });

  const [teamMembers, setTeamMembers] = useState(employees);
  const [sourcesList, setSourcesList] = useState(LEAD_SOURCES);
  const [newSource, setNewSource] = useState('');

  const [newMember, setNewMember] = useState({ name: '', role: 'Sales Executive', email: '', phone: '' });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateCompanySettings(companyForm);
    showSuccess('Company settings saved successfully');
  };

  const handleAddSource = () => {
    if (newSource.trim() && !sourcesList.includes(newSource.trim())) {
      setSourcesList([...sourcesList, newSource.trim()]);
      setNewSource('');
      showSuccess('New lead source added');
    }
  };

  const handleRemoveSource = (srcToRemove) => {
    setSourcesList(sourcesList.filter((s) => s !== srcToRemove));
    showSuccess('Source removed');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.name.trim()) {
      const added = {
        id: `emp-${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@pepsoftware.com`,
        phone: newMember.phone || '+91 98000 00000',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      };
      setTeamMembers([...teamMembers, added]);
      setNewMember({ name: '', role: 'Sales Executive', email: '', phone: '' });
      setShowAddMemberModal(false);
      showSuccess('Team member added');
    }
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Settings & System Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Pep Software company profile, team members, lead sources, and system preferences.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'company'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Profile
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Team Members
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('masters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'masters'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Lead Sources & Master Data
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          App Preferences
        </button>
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pep Software Information</h3>
              <p className="text-xs text-slate-500">Core company context and services offered to clients.</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition-all shadow-xs"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Email</label>
              <input
                type="email"
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={companyForm.phone}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                value={companyForm.website}
                onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Company Primary Services (V1 Scope)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/40">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-slate-800">{srv}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Team Members */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Team Members</h3>
              <p className="text-xs text-slate-500">Small team assigned to handle and follow up with leads.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((emp) => (
              <div key={emp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3.5">
                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{emp.name}</h4>
                  <p className="text-[11px] text-purple-700 font-semibold truncate">{emp.role}</p>
                  <p className="text-[10px] text-slate-500 truncate">{emp.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Lead Sources & Masters */}
      {activeTab === 'masters' && (
        <div className="space-y-6">
          {/* Lead Sources */}
          <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Lead Sources Master</h3>
            <p className="text-xs text-slate-500">Track where Pep Software leads are acquired from (e.g. BNI, Referrals, Website).</p>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Enter new source..."
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSource}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep"
              >
                Add Source
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-3">
              {sourcesList.map((src, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800">
                  <span>{src}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(src)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status Master */}
          <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">V1 Lead Pipeline Statuses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {LEAD_STATUSES.map((st) => (
                <div key={st.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${st.color}`}>
                    {st.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {st.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Application Preferences</h3>

          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Follow-up Urgent Alerts</h4>
                <p className="text-[11px] text-slate-500">Highlight overdue and today's follow-ups automatically in header and dashboard.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Rahul Mehta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Managing Director & Owner">Managing Director & Owner</option>
                  <option value="Sales Lead">Sales Lead</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Project Manager">Project Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="rahul@pepsoftware.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
