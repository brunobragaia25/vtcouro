'use client'

import { ChevronRight } from 'lucide-react'

interface CustomSelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: Array<{ value: string | number; label: string }>
  className?: string
}

export function CustomSelect({
  value,
  onChange,
  options,
  className = '',
}: CustomSelectProps) {
  return (
    <div className={`bg-white rounded-[12px] px-7 py-4 flex gap-1 items-center relative w-fit ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent cursor-pointer font-normal text-sm text-[#8b8b8b] pr-8 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 flex items-center justify-center pointer-events-none">
        <ChevronRight className="w-5 h-5 rotate-90 text-[#8b8b8b]" />
      </div>
    </div>
  )
}
