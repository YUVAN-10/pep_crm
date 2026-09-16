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
  trendDirection = 'up', // 'up' | 'down' | 'flat'
  icon: Icon,
  sparklineData = [12, 16, 14, 20, 24, 22, 30],
  variant = 'blue', // 'blue' | 'green' | 'red'
  subtext = '/month',
  className = '',
  onClick,
}) => {
  const cardThemes = {
    blue: {
      cardBg: 'bg-gradient-to-br from-[#EEF5FF] via-white to-white border-slate-100/90',
      iconBg: 'bg-[#E6F0FF] text-[#1677FF]',
      sparkColor: '#1677FF',
      trendText: 'text-[#1677FF]',
    },
    green: {
      cardBg: 'bg-gradient-to-br from-[#E6F8F0] via-white to-white border-slate-100/90',
      iconBg: 'bg-[#E6F8E8] text-[#10B981]',
      sparkColor: '#10B981',
      trendText: 'text-[#10B981]',
    },
    red: {
      cardBg: 'bg-gradient-to-br from-[#FDF0F0] via-white to-white border-slate-100/90',
      iconBg: 'bg-[#FDE8E8] text-[#F43F5E]',
      sparkColor: '#F43F5E',
      trendText: 'text-[#F43F5E]',
    },
  };

  const theme = cardThemes[variant] || cardThemes.blue;

  const renderTrendIcon = () => {
    if (trendDirection === 'flat') return '↔';
    if (trendDirection === 'down' || !isPositive) return '↓';
    return '↑';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-[22px] border p-5 shadow-2xs transition-all duration-200 bg-white relative overflow-hidden',
        theme.cardBg,
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', theme.iconBg)}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {growth && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={cn('font-bold flex items-center gap-0.5', theme.trendText)}>
                {renderTrendIcon()} {growth}
              </span>
              <span className="text-slate-400 font-normal">{subtext}</span>
            </div>
          )}
        </div>

        {/* Smooth Curved Sparkline */}
        {sparklineData && (
          <div className="shrink-0 pb-1">
            <Sparkline data={sparklineData} color={theme.sparkColor} width={90} height={36} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
