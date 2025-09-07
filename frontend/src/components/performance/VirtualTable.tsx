'use client';

import { useMemo, useState } from 'react';

interface VirtualTableProps {
  data: any[];
  columns: string[];
  height?: number;
  rowHeight?: number;
}

export default function VirtualTable({ 
  data, 
  columns, 
  height = 400, 
  rowHeight = 35 
}: VirtualTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [scrollTop, setScrollTop] = useState(0);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const visibleRowCount = Math.ceil(height / rowHeight);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleRowCount + 1, sortedData.length);
  const visibleRows = sortedData.slice(startIndex, endIndex);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {columns.map((column, index) => (
          <div 
            key={index}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center justify-between">
              {column}
              {sortColumn === column && (
                <span className="text-xs">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual Scrollable Area */}
      <div 
        className="overflow-auto"
        style={{ height }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: sortedData.length * rowHeight, position: 'relative' }}>
          {visibleRows.map((row, index) => {
            const actualIndex = startIndex + index;
            return (
              <div 
                key={actualIndex}
                className={`absolute w-full flex border-b border-gray-200 dark:border-gray-700 ${
                  actualIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                }`}
                style={{ 
                  top: actualIndex * rowHeight,
                  height: rowHeight
                }}
              >
                {columns.map((column, colIndex) => (
                  <div 
                    key={colIndex}
                    className="flex-1 px-4 py-2 text-sm truncate flex items-center"
                  >
                    {row[column]?.toString() || ''}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Showing {sortedData.length.toLocaleString()} rows
      </div>
    </div>
  );
}