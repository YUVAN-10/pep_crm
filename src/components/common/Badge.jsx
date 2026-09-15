import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'neutral', // 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'neutral'
  size = 'md', // 'sm' | 'md' | 'lg'
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-medium gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-semibold gap-2',
  };

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    purple: 'bg-purple-50 text-brand-primary border border-purple-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
  };

  const dotColorMap = {
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    purple: 'bg-brand-primary',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full transition-colors select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColorMap[variant])} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
