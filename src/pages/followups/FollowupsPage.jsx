import React, { useState } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Trash2,
  Check,
  Filter,
  Search,
  User,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const FollowupsPage = () => {
  const navigate = useNavigate();
  const { followups, addFollowup, completeFollowup, deleteFollowup, leads } = useCRM();
  const { showSuccess } = useNotifications();

  const [activeTab, setActiveTab] = useState('all'); // all | overdue | today | upcoming | completed
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [completeItem, setCompleteItem] = useState(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');

  const [scheduleForm, setScheduleForm] = useState({
    leadId: '',
    clientName: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    type: 'Call',
    assignedTo: 'Rohan Sharma',
    notes: '',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper filters
  const overdueList = followups.filter((f) => f.status === 'Overdue' || (f.status === 'Pending' && f.date < todayStr));
  const todayList = followups.filter((f) => f.status === 'Today' || (f.status === 'Pending' && f.date === todayStr));
  const upcomingList = followups.filter((f) => f.status === 'Pending' && f.date > todayStr);
  const completedList = followups.filter((f) => f.status === 'Completed');

  const getFilteredFollowups = () => {
    let result = followups;

    if (activeTab === 'overdue') result = overdueList;
    else if (activeTab === 'today') result = todayList;
    else if (activeTab === 'upcoming') result = upcomingList;
    else if (activeTab === 'completed') result = completedList;

    if (typeFilter !== 'all') {
      result = result.filter((f) => f.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.clientName.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          (f.notes && f.notes.toLowerCase().includes(q))
      );
    }

    return result;
  };

  const filteredItems = getFilteredFollowups();

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleForm.clientName.trim()) return;
    addFollowup(scheduleForm);
    showSuccess(`Follow-up scheduled for ${scheduleForm.clientName}`);
    setShowScheduleModal(false);
    setScheduleForm({
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

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (completeItem) {
      completeFollowup(completeItem.id, outcomeNote || 'Completed follow-up', nextFollowupDate || null);
      showSuccess(`Follow-up completed for ${completeItem.clientName}`);
      setCompleteItem(null);
      setOutcomeNote('');
      setNextFollowupDate('');
    }
  };

  const handleSelectLeadToFollowup = (leadId) => {
    const l = leads.find((item) => item.id === leadId);
    if (l) {
      setScheduleForm({
        ...scheduleForm,
        leadId: l.id,
        clientName: l.name,
        title: `Follow up with ${l.contact}`,
        assignedTo: l.assignedTo?.name || 'Rohan Sharma',
      });
    }
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Follow-up Management
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Zero Missed Goal
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Single dedicated view for Today's, Overdue, and Upcoming follow-ups for Pep Software leads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* METRICS & FILTER TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overdue */}
        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-[20px] border text-left transition-all ${
            activeTab === 'overdue'
              ? 'ring-2 ring-rose-500 bg-rose-50/80 border-rose-300'
              : 'bg-white border-slate-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-800 mt-1">{overdueList.length}</p>
          <p className="text-[10px] text-rose-600">Requires immediate attention</p>
        </button>

        {/* Today */}
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`p-4 rounded-[20px] border text-left transition-all ${
            activeTab === 'today'
              ? 'ring-2 ring-amber-500 bg-amber-50/80 border-amber-300'
              : 'bg-white border-slate-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Today</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1">{todayList.length}</p>
          <p className="text-[10px] text-amber-600">Scheduled for today</p>
        </button>

        {/* Upcoming */}
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`p-4 rounded-[20px] border text-left transition-all ${
            activeTab === 'upcoming'
              ? 'ring-2 ring-blue-500 bg-blue-50/80 border-blue-300'
              : 'bg-white border-slate-100 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">Upcoming</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-1">{upcomingList.length}</p>
          <p className="text-[10px] text-blue-600">Future scheduled</p>
        </button>

        {/* Completed */}
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`p-4 rounded-[20px] border text-left transition-all ${
            activeTab === 'completed'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/80 border-emerald-300'
              : 'bg-white border-slate-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{completedList.length}</p>
          <p className="text-[10px] text-emerald-600">Outcomes logged</p>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-[20px] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'overdue', 'today', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? `All (${followups.length})` : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Communication Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800"
          >
            <option value="all">All Types</option>
            <option value="Call">Calls</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* FOLLOW-UP CARDS LIST */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[22px] border border-slate-100 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No follow-ups match this filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Clear your search or switch tabs to view active and completed follow-up records.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOverdueItem = item.status === 'Overdue' || (item.status === 'Pending' && item.date < todayStr);
            const isTodayItem = item.status === 'Today' || (item.status === 'Pending' && item.date === todayStr);

            return (
              <div
                key={item.id}
                className={`p-5 rounded-[22px] bg-white border transition-all shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  item.status === 'Completed'
                    ? 'border-slate-100 opacity-80'
                    : isOverdueItem
                    ? 'border-rose-200 bg-rose-50/20'
                    : isTodayItem
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-100'
                }`}
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{item.clientName}</span>

                    {/* Status Badge */}
                    {item.status === 'Completed' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Completed
                      </span>
                    ) : isOverdueItem ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    ) : isTodayItem ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Today
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    )}

                    {/* Type Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 flex items-center gap-1">
                      {item.type === 'Call' && <Phone className="w-3 h-3 text-purple-600" />}
                      {item.type === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                      {item.type === 'Email' && <Mail className="w-3 h-3 text-blue-600" />}
                      {item.type === 'Meeting' && <Calendar className="w-3 h-3 text-amber-600" />}
                      {item.type}
                    </span>

                    <span className="text-[11px] text-slate-500 font-mono ml-auto lg:ml-0">
                      📅 {item.date} at {item.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>

                  {item.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-500">Notes:</span> {item.notes}
                    </p>
                  )}

                  {item.outcome && (
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="font-bold">Outcome logged:</span> {item.outcome}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> Assigned: <strong className="text-slate-700">{item.assignedTo}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                  {item.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => setCompleteItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      Complete Follow-up
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteFollowup(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Follow-up"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Follow-up</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Existing Lead (Optional)</label>
                <select
                  value={scheduleForm.leadId}
                  onChange={(e) => {
                    setScheduleForm({ ...scheduleForm, leadId: e.target.value });
                    handleSelectLeadToFollowup(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Choose Lead --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} ({l.contact})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client / Lead Name</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.clientName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. NextGen Digital Solutions"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Title / Subject</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Scope Discussion & Proposal Demo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="11:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Communication Type</label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
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

      {/* COMPLETE MODAL WITH OUTCOME */}
      {completeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Complete Follow-up: {completeItem.clientName}
            </h3>
            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outcome / Communication Log Notes</label>
                <textarea
                  rows={3}
                  required
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Client interested in Website Dev package. Requested revised quotation."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Next Follow-up (Optional)</label>
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
                  onClick={() => setCompleteItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Complete & Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupsPage;
