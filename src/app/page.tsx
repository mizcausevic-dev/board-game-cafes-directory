import Link from "next/link";
import type { Metadata } from "next";
import { getAllCafes, getCities } from "@/lib/hub";

export const metadata: Metadata = {
  title: "Board Game Cafe Directory | Austin, Seattle & Chicago",
  description:
    "Find real board game cafes in Austin, Seattle, and Chicago. Every listing is independently sourced and cites where we verified it.",
};

export default function HomePage() {
  const cities = getCities();
  const cafes = getAllCafes();

  return (
    <>
      <section className="bg-dice-grid border-b-2 border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-board">
            Pilot directory &middot; 3 cities &middot; {cafes.length} cafes
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Real board game cafes, not a scraped list.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/80">
            Every cafe below was found through direct web research, cross-checked against the
            business&apos;s own site plus at least one independent source, and cited. If we
            couldn&apos;t verify a place was real and currently open, it isn&apos;t listed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/`}
                className="rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-semibold text-parchment transition hover:bg-board hover:border-board"
              >
                {city.name}, {city.state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-bold tracking-tight">Cities in this pilot</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {cities.map((city) => {
            const cityCafes = cafes.filter((c) => c.citySlug === city.slug);
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}/`}
                className="group flex flex-col rounded-2xl border-2 border-ink/15 bg-white p-6 transition hover:border-board hover:shadow-lg"
              >
                <span className="font-display text-xl font-bold">
                  {city.name}, {city.state}
                </span>
                <span className="mt-1 text-sm font-medium text-board">
                  {cityCafes.length} {cityCafes.length === 1 ? "cafe" : "cafes"} verified
                </span>
                <p className="mt-3 flex-1 text-sm text-ink/70">{city.blurb}</p>
                <span className="mt-4 font-display text-sm font-semibold text-ink underline decoration-board decoration-2 underline-offset-4 group-hover:text-board">
                  View {city.name} cafes &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t-2 border-ink/10 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Why this directory exists
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-base font-semibold text-board">
                No dedicated incumbent
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                &ldquo;Board game cafe near me&rdquo; searches turn up Yelp lists and blog
                round-ups, not a purpose-built directory that tracks these businesses over time.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-board">
                Source-cited, always
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                Every listing carries a note on exactly how we confirmed it&apos;s real, its own
                site, a local news story, or an independent directory, so you can spot-check it
                yourself.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-board">
                Built to grow, honestly
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                This pilot covers 3 cities on purpose. New cities get added only once each cafe
                in them clears the same verification bar, not before.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
