import React from 'react';
import { cn } from '../../utils/cn';

export const IconButton = ({
  icon: Icon,
  onClick,
  label,
  variant = 'ghost', // 'ghost' | 'filled' | 'outline' | 'purple' | 'orange'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  badge = null,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-[10px]',
    md: 'w-10 h-10 rounded-[12px]',
    lg: 'w-12 h-12 rounded-[14px]',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    ghost: 'text-slate-600 hover:text-brand-primary hover:bg-purple-50/80',
    filled: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm',
    purple: 'bg-brand-primary hover:bg-brand-deep text-white shadow-purple-glow',
    orange: 'bg-brand-accent hover:bg-amber-600 text-white shadow-orange-glow',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/30 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {badge !== null && badge !== undefined && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-brand-accent rounded-full ring-2 ring-white">
          {badge}
        </span>
      )}
    </button>
  );
};

export default IconButton;
