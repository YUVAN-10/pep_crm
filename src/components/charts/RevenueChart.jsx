import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-[14px] shadow-xl border border-slate-700/50 text-xs">
        <p className="font-semibold text-slate-300 mb-1">{label} 2026</p>
        <div className="space-y-1">
          <p className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Revenue:
            </span>
            <span className="font-bold text-white">{formatCurrency(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Expenses:
              </span>
              <span className="font-bold text-white">{formatCurrency(payload[1].value)}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({
  data = [],
  height = 320,
}) => {
  return (
    <div className="w-full h-full" style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="purpleRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F1D95" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#35135F" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="amberExpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4F1D95"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#purpleRevGrad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#amberExpGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
