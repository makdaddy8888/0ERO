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
    <html lang="en-AU">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold text-brand-800">
              0ERO
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-slate-600 hover:text-brand-800">
                Dashboard
              </Link>
              <Link href="/review" className="text-slate-600 hover:text-brand-800">
                Tax review
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
