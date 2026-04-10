import { Calculator } from '@/components/Calculator';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ThemeToggle />
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Kalkulator Masa Kerja PNS
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Hitung masa kerja golongan PNS dengan mudah dan akurat
          </p>
        </div>
        <Calculator />
      </main>
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <a
          href="https://rizkyyusfian.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          © MRYY 2026
        </a>
      </footer>
    </div>
  );
}
