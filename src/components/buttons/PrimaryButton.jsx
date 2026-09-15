import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'purple', // 'purple' | 'orange' | 'gold' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  const variantClasses = {
    purple: 'bg-brand-primary hover:bg-brand-hover text-white shadow-sm active:scale-[0.98]',
    orange: 'bg-brand-accent hover:bg-amber-600 text-white shadow-sm active:scale-[0.98]',
    gold: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-[0.98]',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
