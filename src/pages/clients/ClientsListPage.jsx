import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ClientsListPage = () => {
  const navigate = useNavigate();
  const { customers, leads } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Customers Roster
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
              {customers.length} Converted
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Converted leads and long-term client accounts for Pep Software.
          </p>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer company, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* CUSTOMER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-[22px] border border-slate-100 space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No customer profiles found</p>
            <p className="text-[11px] text-slate-500">
              Convert won leads from the Leads page to add them to the Customer roster.
            </p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-5 rounded-[22px] bg-white border border-slate-100 shadow-2xs hover:border-purple-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{cust.company}</h3>
                    <p className="text-xs text-slate-500">{cust.contactPerson} {cust.role ? `• ${cust.role}` : ''}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">Service Delivered:</span>
                    <span className="font-bold text-purple-700">{cust.serviceUsed || 'Custom Software'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">Account Value:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(cust.totalSpent)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-2">📞 {cust.phone || 'N/A'}</p>
                  {cust.email && <p className="flex items-center gap-2">✉️ {cust.email}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Customer since {cust.joinedDate || '2026'}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/customers/${cust.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsListPage;
