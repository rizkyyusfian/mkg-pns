'use client';

import { Input } from '@/components/ui/Input';
import { DateInput as DateInputType } from '@/lib/types';

interface DateInputProps {
  label: string;
  value: DateInputType;
  onChange: (value: DateInputType) => void;
  error?: string;
  monthMin?: number;
  monthMax?: number;
}

export function DateInput({
  label,
  value,
  onChange,
  error,
  monthMin = 1,
  monthMax = 12,
}: DateInputProps) {
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let month = e.target.value.replace(/\D/g, '');
    if (month.length > 2) month = month.slice(0, 2);

    const monthNumber = Number.parseInt(month, 10);
    if (!Number.isNaN(monthNumber) && monthNumber > monthMax) {
      month = String(monthMax);
    }
    if (!Number.isNaN(monthNumber) && monthNumber < monthMin && month.length === 2) {
      month = String(monthMin);
    }

    onChange({ ...value, month });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let year = e.target.value.replace(/\D/g, '');
    if (year.length > 4) year = year.slice(0, 4);
    onChange({ ...value, year });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="flex-[2]">
          <Input
            type="text"
            placeholder="YYYY"
            value={value.year}
            onChange={handleYearChange}
            maxLength={4}
            className={error ? 'border-red-500' : ''}
            aria-label={`${label} tahun`}
          />
          <div className="text-xs text-muted-foreground mt-1">Tahun</div>
        </div>
        <div className="text-2xl self-center text-muted-foreground">/</div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="MM"
            value={value.month}
            onChange={handleMonthChange}
            maxLength={2}
            className={error ? 'border-red-500' : ''}
            aria-label={`${label} bulan`}
          />
          <div className="text-xs text-muted-foreground mt-1">Bulan</div>
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
