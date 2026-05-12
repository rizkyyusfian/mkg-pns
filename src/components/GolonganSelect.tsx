'use client';

import { Select } from '@/components/ui/Select';
import { golonganList } from '@/lib/golongan-data';
import { Golongan } from '@/lib/types';

interface GolonganSelectProps {
  label: string;
  placeholder?: string;
  ariaLabel: string;
  value: string;
  onChange: (value: Golongan | '') => void;
  error?: string;
}

export function GolonganSelect({
  label,
  placeholder = 'Pilih Golongan',
  ariaLabel,
  value,
  onChange,
  error,
}: GolonganSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as Golongan | '')}
        className={error ? 'border-red-500' : ''}
        aria-label={ariaLabel}
      >
        <option value="">{placeholder}</option>
        {golonganList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
