import {
  CalculationDuration,
  CalculationResult,
  DateInput,
  DateValidationErrors,
  GolonganAwal,
} from "./types";

function parseDate(dateInput: DateInput): Date {
  const year = Number.parseInt(dateInput.year, 10);
  const month = Number.parseInt(dateInput.month, 10);
  return new Date(year, month - 1, 1);
}

function toInt(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function calculateMonthsDifference(startDate: Date, endDate: Date): number {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  return yearDiff * 12 + monthDiff;
}

function toDuration(totalMonths: number): CalculationDuration {
  const safeMonths = Math.max(0, totalMonths);
  return {
    tahun: Math.floor(safeMonths / 12),
    bulan: safeMonths % 12,
    totalBulan: safeMonths,
  };
}

function getPenguranganGolongan(golonganAwal: GolonganAwal): number {
  if (golonganAwal === "I") return 6 * 12;
  if (golonganAwal === "II") return 5 * 12;
  return 0;
}

function getPenguranganLabel(golonganAwal: GolonganAwal): string {
  if (golonganAwal === "I") return "Pengurangan Golongan I (-6 tahun)";
  if (golonganAwal === "II") return "Pengurangan Golongan II (-5 tahun)";
  return `Pengurangan Golongan ${golonganAwal} (0 tahun)`;
}

function getBawaanMonths(masaKerjaBawaan?: DateInput): number {
  if (!masaKerjaBawaan) return 0;
  const tahun = Math.max(0, toInt(masaKerjaBawaan.year));
  const bulan = Math.min(11, Math.max(0, toInt(masaKerjaBawaan.month)));
  return tahun * 12 + bulan;
}

function buildResult(params: {
  mode: "basic" | "extended";
  masaKerjaDasarMonths: number;
  masaKerjaLanjutanMonths: number;
  masaKerjaBawaanMonths: number;
  golonganAwal: GolonganAwal;
}): CalculationResult {
  const {
    mode,
    masaKerjaDasarMonths,
    masaKerjaLanjutanMonths,
    masaKerjaBawaanMonths,
    golonganAwal,
  } = params;

  const subtotalMonths =
    masaKerjaDasarMonths + masaKerjaLanjutanMonths + masaKerjaBawaanMonths;
  const penguranganMonths = getPenguranganGolongan(golonganAwal);
  const totalMonths = Math.max(0, subtotalMonths - penguranganMonths);

  return {
    mode,
    masaKerjaDasar: toDuration(masaKerjaDasarMonths),
    masaKerjaLanjutan: toDuration(masaKerjaLanjutanMonths),
    masaKerjaBawaan: toDuration(masaKerjaBawaanMonths),
    subtotalSebelumPengurangan: toDuration(subtotalMonths),
    penguranganGolongan: toDuration(penguranganMonths),
    totalMasaKerja: toDuration(totalMonths),
    penguranganLabel: getPenguranganLabel(golonganAwal),
  };
}

export function calculateBasicWorkPeriod(
  tmtCpns: DateInput,
  tmtSkPangkat: DateInput,
  golonganAwal: GolonganAwal,
  masaKerjaBawaan?: DateInput
): CalculationResult {
  const cpnsDate = parseDate(tmtCpns);
  const skPangkatDate = parseDate(tmtSkPangkat);

  const masaKerjaDasarMonths = calculateMonthsDifference(cpnsDate, skPangkatDate);
  const masaKerjaBawaanMonths = getBawaanMonths(masaKerjaBawaan);

  return buildResult({
    mode: "basic",
    masaKerjaDasarMonths,
    masaKerjaLanjutanMonths: 0,
    masaKerjaBawaanMonths,
    golonganAwal,
  });
}

export function calculateExtendedWorkPeriod(
  tmtCpns: DateInput,
  tmtSkPangkat: DateInput,
  tmtBerikutnya: DateInput,
  golonganAwal: GolonganAwal,
  masaKerjaBawaan?: DateInput
): CalculationResult {
  const cpnsDate = parseDate(tmtCpns);
  const skPangkatDate = parseDate(tmtSkPangkat);
  const berikutnyaDate = parseDate(tmtBerikutnya);

  const masaKerjaDasarMonths = calculateMonthsDifference(cpnsDate, skPangkatDate);
  const masaKerjaLanjutanMonths = calculateMonthsDifference(
    skPangkatDate,
    berikutnyaDate
  );
  const masaKerjaBawaanMonths = getBawaanMonths(masaKerjaBawaan);

  return buildResult({
    mode: "extended",
    masaKerjaDasarMonths,
    masaKerjaLanjutanMonths,
    masaKerjaBawaanMonths,
    golonganAwal,
  });
}

function validateDateField(
  input: DateInput,
  fieldLabel: string,
  monthMin: number,
  monthMax: number
): string | undefined {
  if (!input.year || !input.month) {
    return `${fieldLabel} harus diisi`;
  }

  if (!/^\d{4}$/.test(input.year)) {
    return `Tahun ${fieldLabel} harus 4 digit`;
  }

  if (!/^\d{1,2}$/.test(input.month)) {
    return `Bulan ${fieldLabel} harus angka`;
  }

  const month = toInt(input.month);
  if (month < monthMin || month > monthMax) {
    return `Bulan ${fieldLabel} harus ${monthMin}-${monthMax}`;
  }

  return undefined;
}

export function validateMasaKerjaBawaan(input: DateInput): string | undefined {
  if (!input.year || !input.month) {
    return "Masa kerja bawaan harus diisi tahun dan bulan";
  }

  if (!/^\d{1,4}$/.test(input.year)) {
    return "Tahun masa kerja bawaan harus angka (maksimal 4 digit)";
  }

  if (!/^\d{1,2}$/.test(input.month)) {
    return "Bulan masa kerja bawaan harus angka";
  }

  const month = toInt(input.month);
  if (month < 0 || month > 11) {
    return "Bulan masa kerja bawaan harus 0-11";
  }

  return undefined;
}

export function validateBasicDates(
  tmtCpns: DateInput,
  tmtSkPangkat: DateInput
): DateValidationErrors {
  const errors: DateValidationErrors = {};

  const cpnsFieldError = validateDateField(tmtCpns, "TMT CPNS", 1, 12);
  if (cpnsFieldError) errors.tmtCpns = cpnsFieldError;

  const skFieldError = validateDateField(tmtSkPangkat, "TMT SK Pangkat", 1, 12);
  if (skFieldError) errors.tmtSkPangkat = skFieldError;

  if (errors.tmtCpns || errors.tmtSkPangkat) {
    return errors;
  }

  const cpnsDate = parseDate(tmtCpns);
  const skPangkatDate = parseDate(tmtSkPangkat);
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (cpnsDate > currentMonth) {
    errors.tmtCpns = "TMT CPNS tidak boleh di masa depan";
  }

  if (skPangkatDate < cpnsDate) {
    errors.tmtSkPangkat = "TMT SK Pangkat harus setelah atau sama dengan TMT CPNS";
  }

  return errors;
}

export function validateExtendedDates(
  tmtCpns: DateInput,
  tmtSkPangkat: DateInput,
  tmtBerikutnya: DateInput
): DateValidationErrors {
  const errors = validateBasicDates(tmtCpns, tmtSkPangkat);
  const berikutFieldError = validateDateField(
    tmtBerikutnya,
    "TMT Berikutnya",
    1,
    12
  );
  if (berikutFieldError) {
    errors.tmtBerikutnya = berikutFieldError;
    return errors;
  }

  if (errors.tmtCpns || errors.tmtSkPangkat) {
    return errors;
  }

  const skPangkatDate = parseDate(tmtSkPangkat);
  const berikutnyaDate = parseDate(tmtBerikutnya);

  if (berikutnyaDate <= skPangkatDate) {
    errors.tmtBerikutnya =
      "TMT Berikutnya harus setelah TMT SK Pangkat Terakhir";
  }

  return errors;
}
