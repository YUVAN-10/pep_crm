import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersRound,
  Clock,
  AlertCircle,
  CheckCircle2,
  Building2,
  TrendingUp,
  Plus,
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import { SERVICES, LEAD_STATUSES } from '../../utils/constants';
import { StatCard } from '../../components/cards/StatCard';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { leads, followups, customers, addLead, addFollowup, completeFollowup } = useCRM();
  const { showSuccess } = useNotifications();

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showScheduleFollowupModal, setShowScheduleFollowupModal] = useState(false);
  const [completeModalItem, setCompleteModalItem] = useState(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');

  // Lead Modal Form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    service: SERVICES[0],
    source: 'Website Form',
    value: '',
    assignedTo: 'Rohan Sharma',
    notes: '',
    nextFollowupDate: '',
  });

  // Follow-up Modal Form state
  const [followupForm, setFollowupForm] = useState({
    leadId: '',
    clientName: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    type: 'Call',
    assignedTo: 'Rohan Sharma',
    notes: '',
  });

  // Helper date metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const overdueFollowups = followups.filter((f) => f.status === 'Overdue' || (f.status === 'Pending' && f.date < todayStr));
  const todayFollowups = followups.filter((f) => f.status === 'Today' || (f.status === 'Pending' && f.date === todayStr));
  const upcomingFollowups = followups.filter((f) => f.status === 'Pending' && f.date > todayStr);

  const activeLeads = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost');
  const wonLeads = leads.filter((l) => l.stage === 'won');

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadForm.name.trim()) return;
    addLead(leadForm);
    showSuccess(`Lead registered for ${leadForm.name}`);
    setShowAddLeadModal(false);
    setLeadForm({
      name: '',
      contact: '',
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

  const handleScheduleFollowup = (e) => {
    e.preventDefault();
    if (!followupForm.clientName.trim()) return;
    addFollowup(followupForm);
    showSuccess(`Follow-up scheduled for ${followupForm.clientName}`);
    setShowScheduleFollowupModal(false);
    setFollowupForm({
      leadId: '',
      clientName: '',
      title: '',
      date: todayStr,
      time: '11:00 AM',
      type: 'Call',
      assignedTo: 'Rohan Sharma',
      notes: '',
    });
  };

  const handleCompleteFollowupSubmit = (e) => {
    e.preventDefault();
    if (completeModalItem) {
      completeFollowup(completeModalItem.id, outcomeNote || 'Discussed requirements & updated CRM', nextFollowupDate || null);
      showSuccess(`Follow-up for ${completeModalItem.clientName} marked complete`);
      setCompleteModalItem(null);
      setOutcomeNote('');
      setNextFollowupDate('');
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Top Welcome & Quick Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pep Software CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-brand-primary">
              V1 Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organized lead tracking and zero-missed follow-up management for small software teams.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>

          <button
            type="button"
            onClick={() => setShowScheduleFollowupModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Clock className="w-4 h-4" />
            Schedule Follow-up
          </button>
        </div>
      </div>

      {/* OVERDUE & TODAY FOLLOW-UP URGENT BANNER */}
      {(overdueFollowups.length > 0 || todayFollowups.length > 0) && (
        <div className="p-4 rounded-[20px] bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-300/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Immediate Action Needed: {overdueFollowups.length} Overdue & {todayFollowups.length} Today's Follow-ups
              </h3>
              <p className="text-[11px] text-slate-600">
                Do not leave any lead uncontacted. Review today's call list to maintain high conversion rates.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/follow-ups')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            View All Follow-ups <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP 3 STAT CARDS - PEP CRM REAL DATA WITH REFINE THEME */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Leads */}
        <StatCard
          title="Total Inquiries & Leads"
          value={leads.length}
          growth="18%"
          trendDirection="flat"
          variant="blue"
          icon={UsersRound}
          sparklineData={[15, 18, 14, 25, 20, 28, 22, 30]}
          subtext="/month"
          onClick={() => navigate('/leads')}
        />

        {/* Card 2: Active Pipeline Leads */}
        <StatCard
          title="Active Pipeline Leads"
          value={activeLeads.length}
          growth="22%"
          trendDirection="up"
          variant="green"
          icon={TrendingUp}
          sparklineData={[10, 14, 18, 16, 24, 22, 29, 34]}
          subtext="/month"
          onClick={() => navigate('/leads')}
        />

        {/* Card 3: Overdue & Today Follow-ups */}
        <StatCard
          title="Overdue & Today Follow-ups"
          value={overdueFollowups.length + todayFollowups.length}
          growth="8%"
          trendDirection="down"
          variant="red"
          icon={Clock}
          sparklineData={[30, 28, 22, 26, 20, 24, 18, 15]}
          subtext="/month"
          onClick={() => navigate('/follow-ups')}
        />
      </div>

      {/* MAIN CONTENT GRID - PEP CRM FUNCTIONALITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today & Overdue Follow-ups List + Recent Leads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[22px] border border-slate-100/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  Today & Urgent Follow-ups
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Single place to take action and ensure zero follow-ups missed.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/follow-ups')}
                className="text-xs font-bold text-[#1677FF] hover:underline flex items-center gap-1"
              >
                Go to Follow-ups Module <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            {overdueFollowups.length === 0 && todayFollowups.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">All caught up for today!</p>
                <p className="text-[11px] text-slate-500">No overdue or pending follow-ups for today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...overdueFollowups, ...todayFollowups].map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      item.status === 'Overdue' || item.date < todayStr
                        ? 'border-rose-200 bg-rose-50/30'
                        : 'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.clientName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Overdue' || item.date < todayStr
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status === 'Overdue' || item.date < todayStr ? 'Overdue' : 'Today'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date} ({item.time})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 truncate">{item.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setCompleteModalItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete Follow-up
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries Table */}
          <div className="bg-white rounded-[22px] border border-slate-100/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center">
                    <UsersRound className="w-4 h-4" />
                  </div>
                  Recent Inquiries & Leads
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest business inquiries registered in Pep Software CRM.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/leads')}
                className="text-xs font-bold text-[#1677FF] hover:underline flex items-center gap-1"
              >
                View All Leads ({leads.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-3">Lead Name</th>
                    <th className="pb-3 px-3">Service</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Budget</th>
                    <th className="pb-3 px-3">Assigned</th>
                    <th className="pb-3 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.slice(0, 5).map((lead) => {
                    const statusObj = LEAD_STATUSES.find((s) => s.id === lead.stage) || { name: lead.stage, color: 'bg-slate-100 text-slate-700' };
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pr-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className="font-bold text-slate-900 hover:text-[#1677FF] text-left truncate block max-w-[160px]"
                          >
                            {lead.name}
                          </button>
                          <span className="text-[10px] text-slate-400 truncate block">{lead.contact}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-semibold text-slate-700">
                            {lead.service}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${statusObj.color}`}>
                            {statusObj.name}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {formatCurrency(lead.value)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-medium text-slate-600">
                            {lead.assignedTo?.name || 'Rohan Sharma'}
                          </span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1677FF] text-[11px] font-bold transition-colors"
                          >
                            View Lead
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Service Interest & Quick Stats */}
        <div className="space-y-6">
          {/* Service Interest Breakdown */}
          <div className="bg-white rounded-[22px] border border-slate-100/90 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Service Demand Breakdown</h3>
            <p className="text-xs text-slate-500">Pep Software core services requested by leads.</p>

            <div className="space-y-3 pt-1">
              {SERVICES.map((service, idx) => {
                const count = leads.filter((l) => l.service === service).length;
                const percentage = Math.round((count / (leads.length || 1)) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{service}</span>
                      <span className="font-bold text-slate-500">{count} leads ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#1677FF] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-6 rounded-[22px] bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold">Pep Software V1 CRM</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus on logging lead history notes, tracking every communication attempt, and completing scheduled follow-ups.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowAddLeadModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#1677FF] text-white font-bold text-xs hover:bg-blue-600 transition-all text-center shadow-xs"
              >
                + Register New Lead
              </button>
              <button
                type="button"
                onClick={() => navigate('/follow-ups')}
                className="w-full py-2.5 rounded-xl bg-slate-700/60 border border-slate-600/60 text-white font-bold text-xs hover:bg-slate-700 transition-all text-center"
              >
                Check Follow-up Queue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD LEAD */}
      {showAddLeadModal && (
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
                  placeholder="e.g. Acme Tech Corp"
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
                    placeholder="e.g. Dr. Ramesh Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98200 12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Interest</label>
                  <select
                    value={leadForm.service}
                    onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {SERVICES.map((srv, idx) => (
                      <option key={idx} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Value / Budget (₹)</label>
                  <input
                    type="number"
                    value={leadForm.value}
                    onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Notes / Requirements</label>
                <textarea
                  rows={3}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Details about customer requirements or initial discussion..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
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

      {/* MODAL 2: SCHEDULE FOLLOW-UP */}
      {showScheduleFollowupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Follow-up</h3>
            <form onSubmit={handleScheduleFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead / Client Name</label>
                <input
                  type="text"
                  required
                  value={followupForm.clientName}
                  onChange={(e) => setFollowupForm({ ...followupForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. ABC Hospital"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={followupForm.date}
                    onChange={(e) => setFollowupForm({ ...followupForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={followupForm.time}
                    onChange={(e) => setFollowupForm({ ...followupForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="11:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Communication Type</label>
                <select
                  value={followupForm.type}
                  onChange={(e) => setFollowupForm({ ...followupForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agenda / Notes</label>
                <textarea
                  rows={2}
                  value={followupForm.notes}
                  onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Review OPD requirement scope..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleFollowupModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600"
                >
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COMPLETE FOLLOW-UP WITH OUTCOME NOTES */}
      {completeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Complete Follow-up: {completeModalItem.clientName}
            </h3>
            <form onSubmit={handleCompleteFollowupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outcome / Conversation Notes</label>
                <textarea
                  rows={3}
                  required
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Summarize feedback or outcome of conversation..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Next Follow-up Date (Optional)</label>
                <input
                  type="date"
                  value={nextFollowupDate}
                  onChange={(e) => setNextFollowupDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Complete Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
