import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCafes, getCafeBySlugs, getCityBySlug, parseAddress } from "@/lib/hub";

export function generateStaticParams() {
  // Full enumeration (city + slug pairs) rather than relying on parent-child
  // generateStaticParams chaining, so `output: 'export'` reliably discovers
  // every /[city]/[slug]/ route regardless of build-tool version quirks.
  return getAllCafes().map((cafe) => ({ city: cafe.citySlug, slug: cafe.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { city: string; slug: string };
}): Metadata {
  const cafe = getCafeBySlugs(params.city, params.slug);
  if (!cafe) return {};
  return {
    title: `${cafe.name} | ${cafe.city}, ${cafe.state}`,
    description: cafe.description,
  };
}

export default function CafePage({ params }: { params: { city: string; slug: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const cafe = getCafeBySlugs(params.city, params.slug);
  if (!cafe) notFound();

  const { streetAddress, addressLocality, addressRegion, postalCode } = parseAddress(cafe.address);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `/${city.slug}/${cafe.slug}/`,
    name: cafe.name,
    description: cafe.description,
    ...(cafe.website ? { url: cafe.website } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "US",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: `${city.name}, ${city.state}`, item: `/${city.slug}/` },
      {
        "@type": "ListItem",
        position: 3,
        name: cafe.name,
        item: `/${city.slug}/${cafe.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-14">
        <nav className="text-sm text-ink/60">
          <Link href="/" className="hover:text-board">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${city.slug}/`} className="hover:text-board">
            {city.name}
          </Link>
          <span className="mx-2">/</span>
          <span>{cafe.name}</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {cafe.name}
        </h1>
        <p className="mt-2 text-ink/60">{cafe.address}</p>

        <p className="mt-6 text-lg leading-relaxed text-ink/85">{cafe.description}</p>

        {cafe.website && (
          <a
            href={cafe.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-semibold text-parchment transition hover:bg-board hover:border-board"
          >
            Visit official site &rarr;
          </a>
        )}

        <div className="mt-10 rounded-2xl border-2 border-board/30 bg-board/5 p-6">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-board">
            How we verified this listing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{cafe.sourceNote}</p>
        </div>

        <div className="mt-10">
          <Link
            href={`/${city.slug}/`}
            className="font-display text-sm font-semibold text-ink underline decoration-board decoration-2 underline-offset-4 hover:text-board"
          >
            &larr; Back to all {city.name} cafes
          </Link>
        </div>
      </article>
    </>
  );
}
