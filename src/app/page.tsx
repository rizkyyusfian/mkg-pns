import { Calculator } from '@/components/Calculator';

export default function Home() {
  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
          Kalkulator Masa Kerja PNS
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Hitung masa kerja golongan PNS dengan mudah dan akurat
        </p>
      </div>
      <Calculator />
    </>
  );
}
