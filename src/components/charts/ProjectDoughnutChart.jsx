import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export const ProjectDoughnutChart = ({
  data = [
    { name: 'Web Applications', value: 42, color: '#35135F' },
    { name: 'Mobile Apps (iOS/Android)', value: 28, color: '#4F1D95' },
    { name: 'AI & Enterprise Software', value: 18, color: '#F59E0B' },
    { name: 'SEO & Growth Engine', value: 12, color: '#10B981' },
  ],
  height = 240,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
                      <span className="font-semibold">{payload[0].name}: </span>
                      <span className="font-bold">{payload[0].value}%</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-heading text-brand-textPrimary">{total}%</span>
          <span className="text-[11px] font-medium text-slate-400">Total Workload</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2.5 mt-2 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-md shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600 truncate font-medium">{item.name}</span>
            <span className="text-xs font-bold text-slate-900 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDoughnutChart;
