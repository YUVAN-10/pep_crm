import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({
  type = 'card', // 'card' | 'line' | 'avatar' | 'stat'
  count = 1,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>
          {type === 'card' && (
            <div className={cn('bg-white rounded-[22px] border border-slate-100 p-6 shadow-soft animate-pulse space-y-4', className)}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-slate-100"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-16 bg-slate-50 rounded-xl"></div>
              <div className="h-8 bg-slate-100 rounded-lg w-2/3"></div>
            </div>
          )}

          {type === 'stat' && (
            <div className={cn('bg-white rounded-[22px] border border-slate-100 p-6 shadow-soft animate-pulse space-y-3', className)}>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-[14px] bg-slate-100"></div>
                <div className="w-16 h-6 rounded-full bg-slate-100"></div>
              </div>
              <div className="h-7 bg-slate-100 rounded w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded w-1/3"></div>
            </div>
          )}

          {type === 'line' && (
            <div className={cn('h-4 bg-slate-100 rounded animate-pulse w-full', className)}></div>
          )}

          {type === 'avatar' && (
            <div className={cn('w-10 h-10 rounded-full bg-slate-100 animate-pulse', className)}></div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
