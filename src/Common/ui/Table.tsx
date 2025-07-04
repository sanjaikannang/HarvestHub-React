import React, { useState } from 'react';
import { ChevronDown, Package } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string; // e.g., "25%", "200px", "auto"
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  loading?: boolean;
  expandable?: boolean;
  onRowClick?: (row: TableRow) => void;
  renderExpandedContent?: (row: TableRow) => React.ReactNode;
  renderCell?: (column: TableColumn, row: TableRow, value: any) => React.ReactNode;
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  };
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: TableRow) => string);
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  expandable = false,
  onRowClick,
  renderExpandedContent,
  renderCell,
  emptyState,
  className = '',
  headerClassName = '',
  rowClassName = '',
  onSort,
  sortColumn,
  sortDirection
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Toggle row expansion
  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle row click
  const handleRowClick = (row: TableRow, event: React.MouseEvent) => {
    if (expandable) {
      event.stopPropagation();
      toggleRowExpansion(row.id);
    }
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Handle sort
  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !onSort) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  // Get row class name
  const getRowClassName = (row: TableRow) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row);
    }
    return rowClassName;
  };

  // Default cell renderer
  const defaultRenderCell = (_column: TableColumn, _row: TableRow, value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  // Render skeleton loader
  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }, (_, index) => (
      <tr key={`skeleton-${index}`} className="border-b border-gray-200">
        {expandable && (
          <td className="px-4 py-4 w-8">
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
          </td>
        )}
        {columns.map((column) => (
          <td key={column.key} className="px-4 py-4">
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    ));
  };

  // Default empty state
  const defaultEmptyState = {
    icon: <Package className="mx-auto h-12 w-12 text-gray-400" />,
    title: 'No data found',
    description: 'No records available to display.'
  };

  const finalEmptyState = { ...defaultEmptyState, ...emptyState };

  return (
    <div className={`bg-white shadow overflow-hidden rounded-md ${className}`}>
      {/* Table Header */}
      <div className={`bg-gray-50 px-4 py-5 border border-gray-200 rounded-t-md ${headerClassName}`}>
        <div className="grid gap-4 text-left" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>        
          {columns.map((column) => (
            <div key={column.key} className={`text-sm font-medium text-gray-500 tracking-wide ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}>
              {column.sortable ? (
                <button
                  onClick={() => handleSort(column)}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>{column.label}</span>
                  {sortColumn === column.key && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        sortDirection === 'asc' ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </button>
              ) : (
                column.label
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      {loading ? (
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {renderSkeletonRows()}
          </tbody>
        </table>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          {finalEmptyState.icon}
          <h3 className="mt-2 text-sm font-medium text-gray-900">{finalEmptyState.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{finalEmptyState.description}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {data.map((row) => (
            <div key={row.id} className="border-b border-gray-200 last:border-b-0">
              {/* Main Row */}
              <div
                className={`px-4 py-4 ${expandable || onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors ${getRowClassName(row)}`}
                onClick={(e) => handleRowClick(row, e)}
              >
                <div className="grid gap-4 items-center" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>                  
                  {columns.map((column) => {
                    const value = row[column.key];
                    const cellContent = renderCell 
                      ? renderCell(column, row, value)
                      : defaultRenderCell(column, row, value);
                    
                    return (
                      <div
                        key={column.key}
                        className={`text-sm ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        {cellContent}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expanded Content */}
              {expandable && expandedRows.has(row.id) && renderExpandedContent && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {renderExpandedContent(row)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;