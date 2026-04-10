'use client';

import { Select } from '@/components/ui/Select';
import { golonganList } from '@/lib/golongan-data';
import { GolonganAwal } from '@/lib/types';

interface GolonganSelectProps {
  value: string;
  onChange: (value: GolonganAwal | '') => void;
  error?: string;
}

export function GolonganSelect({ value, onChange, error }: GolonganSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Golongan Awal</label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as GolonganAwal | '')}
        className={error ? 'border-red-500' : ''}
        aria-label="Pilih golongan awal PNS"
      >
        <option value="">Pilih Golongan</option>
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
