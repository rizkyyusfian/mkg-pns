export type Golongan = "I" | "II" | "III" | "IV";
export type GolonganAwal = Golongan;

export type CalculatorMode = "basic" | "extended";

export interface DateInput {
  year: string;
  month: string;
}

export interface CalculationDuration {
  tahun: number;
  bulan: number;
  totalBulan: number;
}

export interface CalculationResult {
  mode: CalculatorMode;
  masaKerjaDasar: CalculationDuration;
  masaKerjaLanjutan: CalculationDuration;
  masaKerjaBawaan: CalculationDuration;
  subtotalSebelumPengurangan: CalculationDuration;
  penguranganGolongan: CalculationDuration;
  totalMasaKerja: CalculationDuration;
  penguranganLabel: string;
}

export interface DateValidationErrors {
  tmtCpns?: string;
  tmtSkPangkat?: string;
  tmtBerikutnya?: string;
}

export interface FormErrors extends DateValidationErrors {
  golonganAwal?: string;
  pangkatSaatIni?: string;
  masaKerjaBawaan?: string;
}
