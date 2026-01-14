"use client";
import { CheckboxOption } from '@/app/ui/series/checkbox-option';

interface ChartOptionsProps {
  beginAtZero: boolean;
  showPresidentTerms: boolean;
  onToggleBeginAtZero: () => void;
  onToggleShowPresidentTerms: () => void;
}

export function ChartSpecialOptions({
  beginAtZero,
  showPresidentTerms,
  onToggleBeginAtZero,
  onToggleShowPresidentTerms,
}: ChartOptionsProps) {
  return (
    <div className="flex flex-col">
      <CheckboxOption
        id="beginAtZero"
        checked={beginAtZero}
        onChange={onToggleBeginAtZero}
        label="Y축을 0부터 시작"
      />
      <CheckboxOption
        id="showPresidentTerms"
        checked={showPresidentTerms}
        onChange={onToggleShowPresidentTerms}
        label="역대 대통령 재임기간"
      />
    </div>
  );
}
