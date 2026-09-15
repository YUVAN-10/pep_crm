import React from 'react';
import { cn } from '../../utils/cn';

export const Table = ({
  columns = [],
  data = [],
  keyExtractor = (item, index) => item.id || index,
  onRowClick,
  emptyMessage = 'No records found',
  className = '',
}) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[18px] border border-slate-100 bg-white shadow-soft', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={cn('py-3.5 px-4 font-heading', col.headerClassName)}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-sm">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-slate-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                onClick={() => onRowClick && onRowClick(item, index)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick ? 'hover:bg-purple-50/40 cursor-pointer' : 'hover:bg-slate-50/50'
                )}
              >
                {columns.map((col, cIdx) => (
                  <td key={col.key || cIdx} className={cn('py-3.5 px-4', col.className)}>
                    {col.render ? col.render(item, index) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
