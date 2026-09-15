import React from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  description,
  id,
  className = '',
  ...props
}) => {
  const checkboxId = id || `cb-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={cn('flex items-start gap-3 cursor-pointer select-none', className)}>
      <div className="relative flex items-center mt-0.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked, e)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          onClick={() => !disabled && onChange && onChange(!checked)}
          className={cn(
            'w-5 h-5 rounded-[6px] border border-slate-300 bg-white transition-all duration-200 flex items-center justify-center peer-checked:bg-brand-primary peer-checked:border-brand-primary peer-focus:ring-2 peer-focus:ring-purple-500/20',
            disabled && 'opacity-50 cursor-not-allowed',
            checked ? 'bg-brand-primary border-brand-primary text-white' : 'hover:border-purple-400'
          )}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
        </div>
      </div>

      {(label || description) && (
        <label htmlFor={checkboxId} className="cursor-pointer">
          {label && <p className="text-sm font-medium text-slate-700">{label}</p>}
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
