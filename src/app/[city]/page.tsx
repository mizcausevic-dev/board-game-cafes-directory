import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCafesByCity, getCities, getCityBySlug } from "@/lib/hub";

export function generateStaticParams() {
  return getCities().map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  return {
    title: `Board Game Cafes in ${city.name}, ${city.state}`,
    description: `Verified, independently-sourced board game cafes in ${city.name}, ${city.state}. ${city.blurb}`,
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const cafes = getCafesByCity(city.slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: `${city.name}, ${city.state}`, item: `/${city.slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="border-b-2 border-ink/10 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <nav className="text-sm text-ink/60">
            <Link href="/" className="hover:text-board">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{city.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">
            Board Game Cafes in {city.name}, {city.state}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">{city.blurb}</p>
          <p className="mt-3 font-display text-sm font-semibold text-board">
            {cafes.length} verified {cafes.length === 1 ? "listing" : "listings"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {cafes.map((cafe) => (
            <Link
              key={cafe.id}
              href={`/${city.slug}/${cafe.slug}/`}
              className="group flex flex-col rounded-2xl border-2 border-ink/15 bg-white p-6 transition hover:border-board hover:shadow-lg"
            >
              <span className="font-display text-lg font-bold group-hover:text-board">
                {cafe.name}
              </span>
              <span className="mt-1 text-sm text-ink/60">{cafe.address}</span>
              <p className="mt-3 flex-1 text-sm text-ink/75">{cafe.description}</p>
              <span className="mt-4 font-display text-sm font-semibold text-ink underline decoration-board decoration-2 underline-offset-4 group-hover:text-board">
                View details &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
