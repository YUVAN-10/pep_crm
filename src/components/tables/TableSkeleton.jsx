import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full rounded-[18px] border border-slate-100 bg-white p-4 shadow-soft animate-pulse space-y-3">
      <div className="h-8 bg-slate-100 rounded-lg w-full mb-4"></div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 py-2 border-b border-slate-50 last:border-0">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="h-6 bg-slate-100 rounded-md"
              style={{ width: `${Math.floor(100 / cols)}%` }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
