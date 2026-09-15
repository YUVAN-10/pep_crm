import React from 'react';
import { cn } from '../../utils/cn';

export const TextArea = React.forwardRef(({
  label,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  textareaClassName = '',
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

      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full bg-white border border-slate-200 text-brand-textPrimary placeholder:text-slate-400 text-sm rounded-[14px] p-3.5 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-purple-600/15 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-y shadow-sm',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15',
          textareaClassName
        )}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
