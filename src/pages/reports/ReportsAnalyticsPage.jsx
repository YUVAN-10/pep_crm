import React, { useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import OutlineButton from '../../components/buttons/OutlineButton';
import RevenueChart from '../../components/charts/RevenueChart';
import { mockReportsData, mockDashboardData } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ReportsAnalyticsPage = () => {
  const { revenueGrowth, topClients, topEmployees } = mockReportsData;
  const { showInfo } = useNotifications();
  const [period, setPeriod] = useState('6M');

  return (
    <PageTransition>
      <PageHeader
        title="Executive Reports & Analytics"
        subtitle="Business performance metrics, revenue growth trajectory, and delivery throughput."
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <>
            <div className="flex items-center bg-slate-100 p-1 rounded-[14px] border border-slate-200">
              {['3M', '6M', '1Y', 'All Time'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-semibold rounded-[10px] transition-all ${
                    period === p ? 'bg-white text-brand-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <OutlineButton
              size="sm"
              icon={Download}
              onClick={() => showInfo('Generating PDF Executive Summary Report...')}
            >
              Export PDF Report
            </OutlineButton>
          </>
        }
      />

      {/* Top 3 Summary Growth Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quarterly Revenue
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +28.4%
            </span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-2">₹2.43 Crore</p>
          <p className="text-xs text-slate-500 mt-1">vs ₹1.89 Cr in previous quarter</p>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Client Retention
            </span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              96.2%
            </span>
          </div>
          <p className="text-2xl font-bold font-heading text-brand-primary mt-2">128 Active</p>
          <p className="text-xs text-slate-500 mt-1">4.2% churn rate across all tiers</p>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Delivery Velocity
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              99.1% SLA
            </span>
          </div>
          <p className="text-2xl font-bold font-heading text-amber-600 mt-2">34 Projects</p>
          <p className="text-xs text-slate-500 mt-1">On-time milestone delivery score</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Growth Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">Revenue Trajectory</h3>
              <p className="text-xs text-slate-400">Monthly billing progression in INR</p>
            </div>
          </div>
          <RevenueChart data={mockDashboardData.revenueChart} height={260} />
        </Card>

        {/* Milestone Completion Bar Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">Projects Completed</h3>
              <p className="text-xs text-slate-400">Delivered client milestones per month</p>
            </div>
          </div>

          <div style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs">
                          <p className="font-bold">{payload[0].payload.period}</p>
                          <p className="text-amber-300 font-semibold">{payload[0].value} Milestones Delivered</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="projectsCompleted" fill="#35135F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">Top Client Accounts</h3>
            <span className="text-xs text-slate-400">By total contract value</span>
          </div>

          <div className="space-y-3">
            {topClients.map((client, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-slate-50/80 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-brand-primary font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-heading">{client.name}</h4>
                    <p className="text-[11px] text-slate-400">{client.projects} active projects</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-brand-primary">{client.revenue}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">{client.growth} YoY</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Engineers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">Top Performing Engineers</h3>
            <span className="text-xs text-slate-400">By ticket throughput & SLA</span>
          </div>

          <div className="space-y-3">
            {topEmployees.map((emp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-[16px] bg-slate-50/80 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-heading">{emp.name}</h4>
                    <p className="text-[11px] text-slate-400">{emp.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{emp.tasks} Tickets</p>
                  <span className="text-[10px] text-emerald-600 font-bold">{emp.onTime} On-Time SLA</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ReportsAnalyticsPage;
