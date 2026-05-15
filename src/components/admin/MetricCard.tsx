import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  chart?: React.ReactNode;
  className?: string;
  chartColor?: 'orange' | 'yellow' | 'teal' | 'black';
}

export default function MetricCard({
  title,
  value,
  subtext,
  chart,
  className,
  chartColor = 'orange',
}: MetricCardProps) {
  const chartColorMap = {
    orange: 'text-orange-400',
    yellow: 'text-yellow-500',
    teal: 'text-teal-500',
    black: 'text-gray-700',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-xl p-6 border border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-xs uppercase text-gray-500 font-semibold mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500">{subtext}</p>
          )}
        </div>
        {chart && (
          <div className={clsx('text-xs', chartColorMap[chartColor])}>
            {chart}
          </div>
        )}
      </div>
    </div>
  );
}
