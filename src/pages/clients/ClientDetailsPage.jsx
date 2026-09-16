import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  DollarSign,
  User,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, leads, followups } = useCRM();

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Customer Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const relatedLead = leads.find((l) => l.name.toLowerCase() === customer.company.toLowerCase());
  const relatedFollowups = followups.filter((f) => f.clientName.toLowerCase() === customer.company.toLowerCase());

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Top Breadcrumb */}
      <button
        type="button"
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers Roster
      </button>

      {/* CUSTOMER PROFILE CARD */}
      <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{customer.company}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Active Customer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Primary Contact: <strong className="text-slate-800">{customer.contactPerson}</strong> {customer.role ? `(${customer.role})` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${customer.phone}`}
              className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-brand-primary text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            )}
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Service Purchased</span>
            <p className="text-xs font-bold text-slate-900">{customer.serviceUsed || 'Custom Software'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Account Value</span>
            <p className="text-xs font-bold text-slate-900">{formatCurrency(customer.totalSpent)}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
            <p className="text-xs font-bold text-slate-900">{customer.phone || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Since</span>
            <p className="text-xs font-bold text-slate-900">{customer.joinedDate || '2026-03-01'}</p>
          </div>
        </div>
      </div>

      {/* HISTORY DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Past Follow-ups */}
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Communication & Follow-up History
          </h3>

          <div className="space-y-3">
            {relatedFollowups.length === 0 ? (
              <p className="text-xs text-slate-400">No past follow-up records found.</p>
            ) : (
              relatedFollowups.map((f) => (
                <div key={f.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{f.title}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{f.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">📅 {f.date} ({f.type})</p>
                  {f.notes && <p className="text-[11px] text-slate-600">{f.notes}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Account Notes</h3>
          <p className="text-xs text-slate-600 p-4 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed">
            {customer.notes || 'No additional account notes registered.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
