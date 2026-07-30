import React from 'react';
import clsx from 'clsx';

type Tone = 'leather' | 'gold' | 'success' | 'neutral';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  leather: 'bg-leather-100 text-leather-700',
  gold: 'bg-leather-200 text-leather-600',
  success: 'bg-emerald-50 text-emerald-600',
  neutral: 'bg-stone-100 text-stone-600',
};

export default function MetricCard({
  title,
  value,
  subtext,
  icon,
  tone = 'leather',
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'group bg-white rounded-xl p-5 border border-leather-200/60 shadow-sm hover:shadow-md hover:border-leather-300 transition',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-leather-500 font-semibold">
          {title}
        </p>
        {icon && (
          <div
            className={clsx(
              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
              toneStyles[tone]
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-serif font-bold text-leather-900 mt-3">{value}</p>
      {subtext && <p className="text-xs text-leather-500 mt-1">{subtext}</p>}
    </div>
  );
}
