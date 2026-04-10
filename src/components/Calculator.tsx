'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DateInput } from '@/components/DateInput';
import { GolonganSelect } from '@/components/GolonganSelect';
import {
  calculateBasicWorkPeriod,
  calculateExtendedWorkPeriod,
  validateBasicDates,
  validateExtendedDates,
  validateMasaKerjaBawaan,
} from '@/lib/calculations';
import {
  CalculationDuration,
  CalculationResult,
  CalculatorMode,
  DateInput as DateInputType,
  FormErrors,
  GolonganAwal,
} from '@/lib/types';

const emptyYearMonth: DateInputType = { year: '', month: '' };

function formatDuration(duration: CalculationDuration): string {
  return `${duration.tahun} tahun ${duration.bulan} bulan`;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((value) => Boolean(value));
}

export function Calculator() {
  const [activeTab, setActiveTab] = useState<CalculatorMode>('basic');
  const [tmtCpns, setTmtCpns] = useState<DateInputType>(emptyYearMonth);
  const [tmtSkPangkat, setTmtSkPangkat] = useState<DateInputType>(emptyYearMonth);
  const [tmtBerikutnya, setTmtBerikutnya] = useState<DateInputType>(emptyYearMonth);
  const [golonganAwal, setGolonganAwal] = useState<GolonganAwal | ''>('');
  const [hasMasaKerjaBawaan, setHasMasaKerjaBawaan] = useState(false);
  const [masaKerjaBawaan, setMasaKerjaBawaan] = useState<DateInputType>(emptyYearMonth);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!golonganAwal) {
      newErrors.golonganAwal = 'Golongan awal harus dipilih';
    }

    const dateErrors =
      activeTab === 'extended'
        ? validateExtendedDates(tmtCpns, tmtSkPangkat, tmtBerikutnya)
        : validateBasicDates(tmtCpns, tmtSkPangkat);
    Object.assign(newErrors, dateErrors);

    if (hasMasaKerjaBawaan) {
      const bawaanError = validateMasaKerjaBawaan(masaKerjaBawaan);
      if (bawaanError) {
        newErrors.masaKerjaBawaan = bawaanError;
      }
    }

    return newErrors;
  };

  const handleCalculate = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (!hasErrors(formErrors) && golonganAwal) {
      const bawaan = hasMasaKerjaBawaan ? masaKerjaBawaan : undefined;
      const calculationResult =
        activeTab === 'extended'
          ? calculateExtendedWorkPeriod(
              tmtCpns,
              tmtSkPangkat,
              tmtBerikutnya,
              golonganAwal,
              bawaan
            )
          : calculateBasicWorkPeriod(tmtCpns, tmtSkPangkat, golonganAwal, bawaan);

      setResult(calculationResult);
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    setTmtCpns(emptyYearMonth);
    setTmtSkPangkat(emptyYearMonth);
    setTmtBerikutnya(emptyYearMonth);
    setGolonganAwal('');
    setHasMasaKerjaBawaan(false);
    setMasaKerjaBawaan(emptyYearMonth);
    setResult(null);
    setErrors({});
  };

  const handleTabChange = (tab: CalculatorMode) => {
    setActiveTab(tab);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Kalkulator Masa Kerja PNS</CardTitle>
          <div className="grid grid-cols-2 gap-2 mt-4 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => handleTabChange('basic')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hitung Masa Kerja Saat Ini
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('extended')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'extended'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hitung Masa Kerja Berikutnya
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TMT CPNS */}
          <DateInput
            label="TMT CPNS"
            value={tmtCpns}
            onChange={setTmtCpns}
            error={errors.tmtCpns}
          />

          {/* TMT SK Pangkat Terakhir */}
          <DateInput
            label="TMT SK Pangkat Terakhir"
            value={tmtSkPangkat}
            onChange={setTmtSkPangkat}
            error={errors.tmtSkPangkat}
          />

          {activeTab === 'extended' && (
            <DateInput
              label="TMT Berikutnya"
              value={tmtBerikutnya}
              onChange={setTmtBerikutnya}
              error={errors.tmtBerikutnya}
            />
          )}

          {/* Golongan Awal */}
          <GolonganSelect
            value={golonganAwal}
            onChange={setGolonganAwal}
            error={errors.golonganAwal}
          />

          {/* Masa Kerja Bawaan */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasMasaKerjaBawaan}
                onChange={(e) => setHasMasaKerjaBawaan(e.target.checked)}
                className="rounded border border-border"
              />
              <span className="text-sm font-medium">Apakah memiliki masa kerja bawaan?</span>
            </label>

            {hasMasaKerjaBawaan && (
              <div className="space-y-3 pl-4 sm:pl-6 border-l-2 border-muted">
                <DateInput
                  label="Masa Kerja Bawaan"
                  value={masaKerjaBawaan}
                  onChange={setMasaKerjaBawaan}
                  monthMin={0}
                  monthMax={11}
                  error={errors.masaKerjaBawaan}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              Hitung Masa Kerja
            </Button>
            <Button variant="outline" onClick={handleReset} className="sm:w-auto">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Hasil Perhitungan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              Rumus:{' '}
              {result.mode === 'extended'
                ? '(Masa Dasar + Masa Lanjutan + Masa Kerja Bawaan) - Pengurangan Golongan'
                : '(Masa Dasar + Masa Kerja Bawaan) - Pengurangan Golongan'}
            </div>
            <div className="grid gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border">
                <span className="text-sm font-medium mb-1 sm:mb-0">
                  Masa Dasar (CPNS → Pangkat Terakhir):
                </span>
                <span className="font-semibold">
                  {formatDuration(result.masaKerjaDasar)}
                </span>
              </div>
              {result.mode === 'extended' && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border">
                  <span className="text-sm font-medium mb-1 sm:mb-0">
                    Masa Lanjutan (Pangkat Terakhir → TMT Berikutnya):
                  </span>
                  <span className="font-semibold">
                    {formatDuration(result.masaKerjaLanjutan)}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border">
                <span className="text-sm font-medium mb-1 sm:mb-0">
                  Penambahan Masa Kerja Bawaan:
                </span>
                <span className="font-semibold text-emerald-600">
                  +{formatDuration(result.masaKerjaBawaan)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border">
                <span className="text-sm font-medium mb-1 sm:mb-0">
                  Subtotal Sebelum Pengurangan:
                </span>
                <span className="font-semibold">{formatDuration(result.subtotalSebelumPengurangan)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-border">
                <span className="text-sm font-medium mb-1 sm:mb-0">{result.penguranganLabel}:</span>
                <span className="font-semibold text-red-500">
                  -{formatDuration(result.penguranganGolongan)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 bg-muted px-3 rounded-lg">
                <span className="font-medium mb-1 sm:mb-0">Total Masa Kerja Golongan:</span>
                <span className="text-lg font-bold text-primary">
                  {formatDuration(result.totalMasaKerja)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
