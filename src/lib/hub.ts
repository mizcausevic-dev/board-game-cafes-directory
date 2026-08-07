import { boardGameCafes, type BoardGameCafe } from "@/data/board-game-cafes-bundle";

export type { BoardGameCafe };

export interface CityInfo {
  slug: string;
  name: string;
  state: string;
  blurb: string;
}

/**
 * Editorial copy per city. Not sourced data (no facts about specific
 * businesses live here), just directory framing text. Add a new city here
 * when its cafes are added to data/board_game_cafes.json.
 */
const CITY_BLURBS: Record<string, string> = {
  austin:
    "Austin has real search demand for board game cafes, but the dedicated cafe format is thin on the ground. Most of the city's tabletop scene runs through comic and hobby stores with open play tables rather than food-and-drink cafes.",
  seattle:
    "Seattle has the deepest bench of dedicated board game cafes of the three pilot cities, spread from Ballard to West Seattle to Capitol Hill, several of them tracing back to the city's tabletop-and-Magic-card retail scene.",
  chicago:
    "Chicago's board game cafe scene consolidated hard after 2020. Cards Against Humanity's flagship closed and was absorbed by Snakes & Lattes, while newer neighborhood spots opened in Rogers Park and Irving Park.",
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getAllCafes(): BoardGameCafe[] {
  return boardGameCafes;
}

export function getCities(): CityInfo[] {
  const bySlug = new Map<string, CityInfo>();
  for (const cafe of boardGameCafes) {
    if (!bySlug.has(cafe.citySlug)) {
      bySlug.set(cafe.citySlug, {
        slug: cafe.citySlug,
        name: cafe.city,
        state: cafe.state,
        blurb: CITY_BLURBS[cafe.citySlug] ?? `Board game cafes in ${cafe.city}, ${cafe.state}.`,
      });
    }
  }
  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCityBySlug(citySlug: string): CityInfo | undefined {
  return getCities().find((c) => c.slug === citySlug);
}

export function getCafesByCity(citySlug: string): BoardGameCafe[] {
  return boardGameCafes
    .filter((cafe) => cafe.citySlug === citySlug)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCafeBySlugs(citySlug: string, cafeSlug: string): BoardGameCafe | undefined {
  return boardGameCafes.find((cafe) => cafe.citySlug === citySlug && cafe.slug === cafeSlug);
}

export function getCafeCount(): number {
  return boardGameCafes.length;
}

export interface ParsedAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
}

/**
 * Best-effort parse of a "Street, [Suite,] City, ST ZIP" address string into
 * schema.org PostalAddress parts, for JSON-LD only. Falls back gracefully
 * (empty postal code, etc.) rather than throwing on an address without a
 * ZIP, since a couple of listings intentionally omit ZIP precision.
 */
export function parseAddress(address: string): ParsedAddress {
  const parts = address.split(",").map((p) => p.trim());
  const stateZip = parts[parts.length - 1] ?? "";
  const addressLocality = parts[parts.length - 2] ?? "";
  const streetAddress = parts.slice(0, Math.max(parts.length - 2, 1)).join(", ");

  const stateZipMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5}(-\d{4})?)?$/);
  const addressRegion = stateZipMatch?.[1] ?? stateZip;
  const postalCode = stateZipMatch?.[2] ?? "";

  return { streetAddress, addressLocality, addressRegion, postalCode };
}

export { slugToTitle };
