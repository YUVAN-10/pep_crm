import React from 'react';
import Card from './Card';
import Sparkline from '../charts/Sparkline';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const StatCard = ({
  title,
  value,
  growth,
  isPositive = true,
  icon: Icon,
  sparklineData = [12, 16, 14, 20, 24, 22, 30],
  iconColor = 'purple', // 'purple' | 'orange' | 'green' | 'blue'
  subtext = 'vs last month',
  className = '',
}) => {
  const iconThemeMap = {
    purple: {
      bg: 'bg-purple-100/70 text-brand-primary',
      sparkColor: '#35135F',
      dot: 'bg-brand-primary',
    },
    orange: {
      bg: 'bg-amber-100/70 text-brand-accent',
      sparkColor: '#F59E0B',
      dot: 'bg-brand-accent',
    },
    green: {
      bg: 'bg-emerald-100/70 text-emerald-600',
      sparkColor: '#10B981',
      dot: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-100/70 text-blue-600',
      sparkColor: '#3B82F6',
      dot: 'bg-blue-500',
    },
  };

  const theme = iconThemeMap[iconColor] || iconThemeMap.purple;

  return (
    <Card hover className={cn('relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn('w-12 h-12 rounded-[16px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105', theme.bg)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-bold font-sans tracking-tight text-brand-textPrimary mt-1">
              {value}
            </h3>
          </div>
        </div>

        {/* Sparkline chart */}
        {sparklineData && (
          <div className="hidden sm:block">
            <Sparkline data={sparklineData} color={theme.sparkColor} width={75} height={32} />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {growth}
          </span>
          <span className="text-xs text-slate-400 font-medium">{subtext}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className={cn('w-1.5 h-1.5 rounded-full', theme.dot)}></span>
          <span className="text-[11px] text-slate-400 font-medium">Realtime</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
