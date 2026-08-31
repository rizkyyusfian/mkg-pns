import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kalkulator Masa Kerja PNS",
  description: "Aplikasi sederhana untuk menghitung masa kerja golongan PNS",
  icons: {
    icon: "/logokabsor.ico",
    shortcut: "/logokabsor.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Script to set initial theme before page renders (prevents flash)
  const themeScript = `
    (function() {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    })();
  `;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="light"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <div className="min-h-screen bg-background flex flex-col">
          <ThemeToggle />
          <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
            {children}
          </main>
          <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <a
                href="https://rizkyyusfian.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                © MRYY 2026
              </a>
              <Link href="/changelog" className="text-primary hover:underline">
                Changelog
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
