import React from 'react';
import { ArrowLeftFromLine, ArrowRightFromLine, Package } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  loading?: boolean;
  renderCell?: (column: TableColumn, row: TableRow, value: any) => React.ReactNode;
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  };
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: TableRow) => string);
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  showPagination?: boolean;
  paginationLabel?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  renderCell,
  emptyState,
  className = '',
  headerClassName = '',
  pagination,
  onPageChange,
  itemsPerPage = 10,
  showPagination = false,
  paginationLabel = 'items'
}) => {

  // Calculate total table width based on column widths
  const totalTableWidth = columns.reduce((total, column) => {
    const width = column.width || column.minWidth || '150px';
    const numericWidth = parseInt(width.replace('px', ''));
    return total + numericWidth;
  }, 0);

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
        {columns.map((column) => (
          <td 
            key={column.key} 
            className="px-4 py-4"
            style={{ 
              width: column.width || column.minWidth || '150px',
              minWidth: column.minWidth || column.width || '150px'
            }}
          >
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
    <>
      <div className={`bg-white rounded-md border border-gray-300 ${className}`}>
        {/* Table Container with Horizontal Scroll */}
        <div className="overflow-auto no-scrollbar">
          <table 
            className="w-full"
            style={{ 
              minWidth: `${totalTableWidth}px`,
              tableLayout: 'fixed'
            }}
          >
            {/* Table Header */}
            <thead className={`bg-gray-50 border-b border-gray-200 ${headerClassName}`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-5 text-sm font-medium text-gray-500 tracking-wider ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                    style={{ 
                      width: column.width || column.minWidth || '150px',
                      minWidth: column.minWidth || column.width || '150px'
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                renderSkeletonRows()
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    {finalEmptyState.icon}
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{finalEmptyState.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{finalEmptyState.description}</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr 
                    key={row.id} 
                    className="transition-colors hover:bg-gray-50"
                  >
                    {columns.map((column) => {
                      const value = row[column.key];
                      const cellContent = renderCell
                        ? renderCell(column, row, value)
                        : defaultRenderCell(column, row, value);

                      return (
                        <td
                          key={column.key}
                          className={`px-4 py-5 text-sm text-gray-900 ${
                            column.align === 'center' ? 'text-center' :
                            column.align === 'right' ? 'text-right' : 'text-left'
                          }`}
                          style={{ 
                            width: column.width || column.minWidth || '150px',
                            minWidth: column.minWidth || column.width || '150px'
                          }}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        {showPagination && pagination && !loading && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 rounded-b-md">
            <div className="flex justify-between items-center">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * itemsPerPage, pagination.totalProducts)} of{' '}
                {pagination.totalProducts} {paginationLabel}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => onPageChange?.(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowLeftFromLine className="w-4 h-4 mr-1" />
                  </button>

                  {/* Page Info */}
                  <span className="text-sm text-gray-600 px-2">
                    {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  {/* Next Button */}
                  <button
                    onClick={() => onPageChange?.(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRightFromLine className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;