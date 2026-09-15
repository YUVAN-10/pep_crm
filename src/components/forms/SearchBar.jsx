import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search clients, projects, tasks...',
  shortcut = '⌘K',
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs pl-8',
    md: 'py-2 px-3.5 text-sm pl-9',
    lg: 'py-2.5 px-4 text-base pl-10',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-5 h-5 left-3.5',
  };

  return (
    <div className={cn('relative flex items-center w-full max-w-md', className)}>
      <Search className={cn('absolute text-slate-400 pointer-events-none', iconSizes[size])} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 focus:border-brand-primary rounded-[14px] text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600/15 shadow-sm',
          sizeClasses[size],
          shortcut && 'pr-14',
          value && 'pr-16'
        )}
      />

      <div className="absolute right-2.5 flex items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {shortcut && !value && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
