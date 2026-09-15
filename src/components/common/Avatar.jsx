import React from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status = null, // 'online' | 'busy' | 'offline' | null
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColorMap = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    offline: 'bg-slate-400',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover border border-slate-200/80 shadow-2xs',
            sizeClasses[size]
          )}
          onError={(e) => {
            // fallback to initials on broken image
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-tr from-brand-primary to-brand-deep text-white font-bold flex items-center justify-center border border-purple-300 shadow-2xs',
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white',
            statusSizeClasses[size],
            statusColorMap[status] || statusColorMap.online
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
