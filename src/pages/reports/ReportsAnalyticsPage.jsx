import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  CheckCircle2,
  Clock,
  Building2,
  UsersRound,
  Download,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { SERVICES, LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';

export const ReportsAnalyticsPage = () => {
  const { leads, followups, customers } = useCRM();

  const totalLeads = leads.length || 1;
  const wonLeads = leads.filter((l) => l.stage === 'won').length;
  const lostLeads = leads.filter((l) => l.stage === 'lost').length;
  const activeLeads = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost').length;

  const winRate = Math.round((wonLeads / totalLeads) * 100);
  const completedFollowups = followups.filter((f) => f.status === 'Completed').length;
  const totalFollowups = followups.length || 1;
  const followupRate = Math.round((completedFollowups / totalFollowups) * 100);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const totalPipelineValue = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Reports & Business Insights
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-brand-primary">
              V1 Analytics
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Performance breakdown for Pep Software service demand, lead conversion rate, and follow-up efficiency.
          </p>
        </div>
      </div>

      {/* OVERVIEW KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[20px] bg-white border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Total Pipeline Value</span>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(totalPipelineValue)}</p>
          <p className="text-[10px] text-slate-500">Combined estimated value</p>
        </div>

        <div className="p-4 rounded-[20px] bg-emerald-50/50 border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700">Win Rate</span>
          <p className="text-xl font-bold text-emerald-800">{winRate}%</p>
          <p className="text-[10px] text-emerald-600">{wonLeads} won out of {leads.length}</p>
        </div>

        <div className="p-4 rounded-[20px] bg-amber-50/50 border border-amber-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700">Follow-up Execution Rate</span>
          <p className="text-xl font-bold text-amber-800">{followupRate}%</p>
          <p className="text-[10px] text-amber-600">{completedFollowups} of {followups.length} completed</p>
        </div>

        <div className="p-4 rounded-[20px] bg-white border border-slate-100 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Active Deals</span>
          <p className="text-xl font-bold text-slate-900">{activeLeads}</p>
          <p className="text-[10px] text-slate-500">In negotiation/proposal</p>
        </div>
      </div>

      {/* ANALYTICS CHARTS / METRICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Service Demand Breakdown */}
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Service Demand Distribution</h3>
          <p className="text-xs text-slate-500">Inquiries categorized by Pep Software core services.</p>

          <div className="space-y-4 pt-2">
            {SERVICES.map((srv, idx) => {
              const count = leads.filter((l) => l.service === srv).length;
              const val = leads.filter((l) => l.service === srv).reduce((sum, l) => sum + (Number(l.value) || 0), 0);
              const pct = Math.round((count / totalLeads) * 100);

              return (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">{srv}</span>
                    <span className="text-purple-700">{count} leads ({formatCurrency(val)})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Lead Source Distribution */}
        <div className="bg-white rounded-[22px] border border-slate-100 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Lead Acquisition Sources</h3>
          <p className="text-xs text-slate-500">Where inquiries originated from (BNI, Referral, Website, etc.).</p>

          <div className="space-y-3 pt-2">
            {LEAD_SOURCES.slice(0, 6).map((src, idx) => {
              const count = leads.filter((l) => l.source === src).length;
              const pct = Math.round((count / totalLeads) * 100);

              return (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="font-semibold text-slate-800">{src}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-bold text-slate-700 min-w-[30px] text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;
