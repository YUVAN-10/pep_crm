import React from 'react';
import { User } from 'lucide-react';
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

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
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

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full bg-blue-100 text-[#1677FF] font-bold flex items-center justify-center border border-blue-200 shadow-2xs overflow-hidden',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className={iconSizes[size] || 'w-5 h-5'} />
        )}
      </div>

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
