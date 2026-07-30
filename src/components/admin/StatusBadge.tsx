import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'novo' | 'em_progresso' | 'respondido' | 'fechado' | 'ativo' | 'destaque';
  children: React.ReactNode;
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    novo: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    em_progresso: 'bg-leather-100 text-leather-700 ring-leather-600/20',
    respondido: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    fechado: 'bg-stone-100 text-stone-600 ring-stone-500/20',
    ativo: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    destaque: 'bg-leather-200 text-leather-800 ring-leather-600/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap',
        statusStyles[status]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {children}
    </span>
  );
}
