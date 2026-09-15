import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = 'Select option...',
  className = '',
  selectClassName = '',
  ...props
}, ref) => {
  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full appearance-none bg-white border border-slate-200 text-brand-textPrimary text-sm rounded-[14px] px-3.5 py-2.5 pr-10 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-purple-600/15 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm cursor-pointer',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15',
            selectClassName
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value ?? opt.id ?? opt} value={opt.value ?? opt.id ?? opt}>
              {opt.label ?? opt.name ?? opt}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
