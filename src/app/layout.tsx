import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "0ERO — Local myTax helper",
  description: "Fully local Australian tax prep review engine. No AI. No cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className="dark">
      <body className="min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-agent-glow" aria-hidden />
        <header className="relative z-10 border-b border-white/10 bg-ground/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold agent-heading">
              0ERO
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-zinc-400 transition hover:text-agent-300">
                Dashboard
              </Link>
              <Link href="/setup" className="text-zinc-400 transition hover:text-agent-300">
                Setup
              </Link>
              <Link href="/institutions" className="text-zinc-400 transition hover:text-agent-300">
                Institutions
              </Link>
              <Link
                href="/review"
                className="font-medium text-agent-pink-400 transition hover:text-agent-pink-400/80"
              >
                Tax review
              </Link>
            </nav>
          </div>
        </header>
        <main className="relative z-10 mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
