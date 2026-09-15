import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const OutlineButton = ({
  children,
  onClick,
  type = 'button',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-6 py-2.5 text-base font-medium gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 text-slate-500" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 text-slate-500" />}
        </>
      )}
    </button>
  );
};

export default OutlineButton;
