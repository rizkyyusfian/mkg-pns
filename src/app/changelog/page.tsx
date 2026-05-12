import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const changelogEntries = [
  {
    title: 'Fitur Saat Ini',
    date: 'Rilis awal',
    items: [
      'Kalkulator masa kerja PNS untuk masa kerja saat ini dan masa kerja berikutnya.',
      'Input TMT CPNS, TMT SK Pangkat Terakhir, dan TMT Berikutnya untuk mode lanjutan.',
      'Pilihan golongan awal, dukungan masa kerja bawaan, validasi tanggal, serta tampilan hasil dalam tahun dan bulan.',
      'Mode terang dan gelap yang tersimpan di perangkat pengguna.',
    ],
  },
  {
    title: 'Pembaruan Golongan Saat Ini',
    date: '11 Mei 2026',
    items: [
      'Menambahkan dropdown Golongan Saat Ini pada form kalkulator.',
      'Mengubah pengurangan masa kerja agar mengikuti transisi pangkat: Golongan I ke II dikurangi 6 tahun, Golongan II ke III dikurangi 5 tahun, dan transisi lain tidak dikurangi.',
      'Menambahkan validasi agar Golongan Saat Ini tidak lebih rendah dari Golongan Awal.',
      'Menambahkan halaman changelog dan link Changelog di footer.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      <div className="space-y-3">
        <Link href="/" className="text-sm text-primary hover:underline">
          Kembali ke Kalkulator
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Changelog
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Catatan perubahan fitur Kalkulator Masa Kerja PNS.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {changelogEntries.map((entry) => (
          <Card key={entry.title}>
            <CardHeader>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg sm:text-xl">{entry.title}</CardTitle>
                <span className="text-sm text-muted-foreground">{entry.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base text-muted-foreground">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
