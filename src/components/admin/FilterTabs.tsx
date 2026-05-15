'use client';

import React from 'react';
import clsx from 'clsx';

interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function FilterTabs({
  tabs,
  activeTab = tabs[0]?.id,
  onTabChange,
}: FilterTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={clsx(
              'px-4 py-3 border-b-2 transition-colors text-sm font-medium',
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label}
            {tab.count !== undefined && ` (${tab.count})`}
          </button>
        ))}
      </div>
    </div>
  );
}
