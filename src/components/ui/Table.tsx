import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T = any> {
  data?: T[];
  columns?: Column<T>[];
  headers?: string[];
  rows?: any[][];
  className?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T extends { id?: string | number }>({
  data,
  columns,
  headers,
  rows,
  className,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    );
  }

  // Simple table with headers and rows
  if (headers && rows) {
    if (rows.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className={twMerge('min-w-full divide-y divide-gray-200', className)}>
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Complex table with data and columns
  if (!data || !columns || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={twMerge('min-w-full divide-y divide-gray-200', className)}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={twMerge(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              onClick={() => onRowClick?.(item)}
              className={twMerge(
                'hover:bg-gray-50',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={twMerge(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    column.className
                  )}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 