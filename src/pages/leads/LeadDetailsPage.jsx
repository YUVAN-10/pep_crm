import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  UserCheck,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  Plus,
  Send,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import { LEAD_STATUSES, SERVICES } from '../../utils/constants';

export const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { leads, updateLead, deleteLead, addNoteToLead, convertLeadToCustomer, addFollowup, followups } = useCRM();
  const { showSuccess, showInfo } = useNotifications();

  const lead = leads.find((l) => l.id === id);

  const [newNoteText, setNewNoteText] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Lead state
  const [editForm, setEditForm] = useState({
    name: lead?.name || '',
    contact: lead?.contact || '',
    role: lead?.role || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    service: lead?.service || SERVICES[0],
    stage: lead?.stage || 'new',
    value: lead?.value || 1000000,
    assignedTo: lead?.assignedTo?.name || 'Rohan Sharma',
  });

  // Schedule Follow-up state
  const [scheduleForm, setScheduleForm] = useState({
    title: `Follow up with ${lead?.contact || 'Client'}`,
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    type: 'Call',
    notes: '',
  });

  if (!lead) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Lead Not Found</h2>
        <p className="text-xs text-slate-500">The lead record may have been moved or deleted.</p>
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Return to Leads
        </button>
      </div>
    );
  }

  const leadFollowups = followups.filter((f) => f.leadId === lead.id);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNoteToLead(lead.id, newNoteText.trim(), 'Sanjay Verma');
    setNewNoteText('');
    showSuccess('Log note added to Lead Timeline');
  };

  const handleConvertCustomer = () => {
    const cust = convertLeadToCustomer(lead.id);
    if (cust) {
      showSuccess(`Lead converted to Customer! Redirecting...`);
      setTimeout(() => navigate('/customers'), 1000);
    } else {
      showInfo(`${lead.name} is already a registered customer.`);
    }
  };

  const handleStageChange = (newStage) => {
    updateLead(lead.id, { stage: newStage });
    addNoteToLead(lead.id, `Status updated to ${newStage.toUpperCase()}`, 'Sanjay Verma');
    showSuccess(`Lead status updated to ${newStage.toUpperCase()}`);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    addFollowup({
      leadId: lead.id,
      clientName: lead.name,
      title: scheduleForm.title,
      date: scheduleForm.date,
      time: scheduleForm.time,
      type: scheduleForm.type,
      assignedTo: lead.assignedTo?.name || 'Rohan Sharma',
      notes: scheduleForm.notes,
    });
    setShowScheduleModal(false);
    showSuccess(`Follow-up scheduled for ${scheduleForm.date}`);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateLead(lead.id, editForm);
    setShowEditModal(false);
    showSuccess('Lead details updated');
  };

  const handleDeleteLead = () => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
      deleteLead(lead.id);
      navigate('/leads');
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const currentStatusObj = LEAD_STATUSES.find((s) => s.id === lead.stage) || { name: lead.stage, color: 'bg-slate-100 text-slate-700' };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Changer */}
          <select
            value={lead.stage}
            onChange={(e) => handleStageChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
          >
            {LEAD_STATUSES.map((st) => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setEditForm({
                name: lead.name,
                contact: lead.contact,
                role: lead.role || '',
                phone: lead.phone,
                email: lead.email || '',
                service: lead.service,
                stage: lead.stage,
                value: lead.value,
                assignedTo: lead.assignedTo?.name || 'Rohan Sharma',
              });
              setShowEditModal(true);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-purple-300"
          >
            Edit Lead
          </button>

          <button
            type="button"
            onClick={handleConvertCustomer}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            Convert to Customer
          </button>

          <button
            type="button"
            onClick={handleDeleteLead}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LEAD PROFILE CARD */}
      <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{lead.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatusObj.color}`}>
                {currentStatusObj.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Primary Contact: <strong className="text-slate-800">{lead.contact}</strong> {lead.role ? `(${lead.role})` : ''}
            </p>
          </div>

          {/* QUICK DIRECT COMMUNICATION BUTTONS */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-brand-primary text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>

            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>

            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" /> Schedule Follow-up
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Service Interest</span>
            <p className="text-xs font-bold text-slate-900">{lead.service}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Budget / Value</span>
            <p className="text-xs font-bold text-slate-900">{formatCurrency(lead.value)}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Lead Source</span>
            <p className="text-xs font-bold text-slate-900">{lead.source}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Team Member</span>
            <p className="text-xs font-bold text-slate-900">{lead.assignedTo?.name || 'Rohan Sharma'}</p>
          </div>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Complete Lead Conversation & Activity Timeline
            </h3>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 p-4 rounded-xl border border-purple-100 bg-purple-50/30">
              <label className="block text-xs font-bold text-slate-800">Log Communication Note / Activity</label>
              <textarea
                rows={2}
                required
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type details of recent call, email discussion, or client feedback..."
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Log Note
                </button>
              </div>
            </form>

            {/* Timeline List */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
              {(!lead.history || lead.history.length === 0) ? (
                <p className="text-xs text-slate-400">No activity logged yet.</p>
              ) : (
                lead.history.map((hItem, idx) => (
                  <div key={hItem.id || idx} className="relative space-y-1">
                    <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-brand-primary ring-4 ring-white" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{hItem.author}</span>
                      <span className="text-slate-400 font-mono">{hItem.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {hItem.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Follow-ups */}
        <div className="space-y-6">
          <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Scheduled Follow-ups</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                + Schedule
              </button>
            </div>

            <div className="space-y-3">
              {leadFollowups.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl space-y-1">
                  <p className="text-xs text-slate-500 font-medium">No follow-ups for this lead.</p>
                </div>
              ) : (
                leadFollowups.map((fol) => (
                  <div key={fol.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{fol.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fol.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {fol.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">📅 {fol.date} ({fol.type})</p>
                    {fol.notes && <p className="text-[11px] text-slate-600">{fol.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Follow-up for {lead.name}</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Title</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
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

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-[22px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Edit Lead Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editForm.contact}
                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Interest</label>
                  <select
                    value={editForm.service}
                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {SERVICES.map((srv, idx) => (
                      <option key={idx} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. Value (₹)</label>
                  <input
                    type="number"
                    value={editForm.value}
                    onChange={(e) => setEditForm({ ...editForm, value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetailsPage;
