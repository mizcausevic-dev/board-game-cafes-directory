import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";
import { getCities } from "@/lib/hub";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_NAME = "Board Game Cafe Directory";
const SITE_DESCRIPTION =
  "A curated, honestly-sourced directory of real board game cafes across the US.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Verified US Cafes`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = getCities();

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-parchment font-body text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b-2 border-ink/10 bg-parchment/95 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
              <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                <span aria-hidden="true" className="text-2xl">
                  &#9861;
                </span>
                Board Game Cafe Directory
              </Link>
              <nav className="hidden flex-wrap justify-end gap-x-5 gap-y-1 text-sm font-medium sm:flex">
                {cities.map((city) => (
                  <Link key={city.slug} href={`/${city.slug}/`} className="hover:text-board">
                    {city.name}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-ink/10 bg-ink text-meeple">
            <div className="mx-auto max-w-5xl px-6 py-10 text-sm">
              <p className="font-display text-base font-semibold text-parchment">
                Board Game Cafe Directory
              </p>
              <p className="mt-2 max-w-2xl text-meeple/80">
                A pilot directory of real, independently verified board game cafes. Every listing
                links to how we confirmed it, no invented businesses, no scraped placeholder data.
              </p>
              <p className="mt-4 text-xs text-meeple/60">
                Local pilot build. Kinetic Gain LLC.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
