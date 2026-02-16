'use client'

import clsx from 'clsx'
import { memo } from 'react'


type SummaryButtonProps = {
  label: string
  value: number | null
  unit?: string
  isActive: boolean
  onClick: () => void
  color: Color
}

type Color = 'blue' | 'indigo' | 'red' | 'rose' | 'green' | 'emerald';

const activeColorClass: Record<Color, string> = {
  blue: 'bg-blue-100 ring-2 ring-blue-300 focus:ring-blue-300',
  indigo: 'bg-indigo-100 ring-2 ring-indigo-300 focus:ring-indigo-300',
  red: 'bg-red-100 ring-2 ring-red-300 focus:ring-red-300',
  rose: 'bg-rose-100 ring-2 ring-rose-300 focus:ring-rose-300',
  green: 'bg-green-100 ring-2 ring-green-300 focus:ring-green-300',
  emerald: 'bg-emerald-100 ring-2 ring-emerald-300 focus:ring-emerald-300',
};

function SummaryButton({
  label,
  value,
  unit = '만원',
  isActive,
  onClick,
  color,
}: SummaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'p-3 rounded-xl text-left transition-all',
        'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isActive
          ? activeColorClass[color]
          : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <p className="text-xs text-gray-500">{label}</p>

      <p className="text-base font-bold text-gray-900 tabular-nums">
        {value !== null
          ? `${value.toLocaleString()} ${unit}`
          : '—'}
      </p>
    </button>
  )
}

export default memo(SummaryButton)
