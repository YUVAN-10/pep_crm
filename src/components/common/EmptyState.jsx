import React from 'react';
import { cn } from '../../utils/cn';
import PrimaryButton from '../buttons/PrimaryButton';
import { FolderSearch } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No records found',
  description = 'Try adjusting your search filters or create a new entry.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-[20px] bg-purple-50 flex items-center justify-center text-brand-primary mb-4 shadow-sm border border-purple-100">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold font-heading text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <PrimaryButton onClick={onAction} size="sm" variant="orange">
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
