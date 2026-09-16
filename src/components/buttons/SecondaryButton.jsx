import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const SecondaryButton = ({
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
    md: 'px-5 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-[14px] bg-purple-50/80 dark:bg-purple-950/60 hover:bg-purple-100/90 dark:hover:bg-purple-900/60 text-brand-primary dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-brand-primary dark:text-purple-300" />
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

export default SecondaryButton;
