import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'novo' | 'em_progresso' | 'respondido' | 'fechado' | 'ativo' | 'destaque';
  children: React.ReactNode;
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    novo: 'bg-yellow-100 text-yellow-700',
    em_progresso: 'bg-orange-100 text-orange-700',
    respondido: 'bg-green-100 text-green-700',
    fechado: 'bg-gray-100 text-gray-700',
    ativo: 'bg-green-100 text-green-700',
    destaque: 'bg-amber-100 text-amber-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {children}
    </span>
  );
}
