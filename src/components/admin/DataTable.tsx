'use client';

import React from 'react';

interface DataTableProps {
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {columns.map((col) => (
              <div key={col.key}>
                {col.label && (
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {col.label}
                  </p>
                )}
                <div className="text-sm text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
