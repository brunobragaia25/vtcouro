'use client';

import React from 'react';
import clsx from 'clsx';

interface DataTableProps {
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  /** Remove a borda/arredondamento externo — use quando a tabela já está dentro de um card. */
  bare?: boolean;
}

export default function DataTable({ columns, data, bare = false }: DataTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div
        className={clsx(
          'hidden md:block bg-white overflow-hidden',
          !bare && 'rounded-xl border border-leather-200/60 shadow-sm'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-leather-200/60 bg-leather-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3 text-left text-[11px] font-semibold text-leather-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-leather-200/50">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-leather-50/70 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 text-sm text-leather-700 align-top">
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
          <div
            key={idx}
            className="bg-white rounded-xl border border-leather-200/60 p-4 space-y-3"
          >
            {columns.map((col) => (
              <div key={col.key}>
                {col.label && (
                  <p className="text-[10px] font-semibold text-leather-400 uppercase tracking-wide mb-1">
                    {col.label}
                  </p>
                )}
                <div className="text-sm text-leather-700">
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
