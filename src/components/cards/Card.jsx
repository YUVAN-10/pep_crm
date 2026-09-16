import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'default', // 'none' | 'sm' | 'default' | 'lg'
  gradientBorder = false,
  onClick,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[22px] border border-slate-100/90 shadow-2xs transition-all duration-200 text-slate-900',
        paddingClasses[padding],
        hover && 'hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
