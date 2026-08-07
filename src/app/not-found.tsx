import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-ink/70">
        We couldn&apos;t find that page. It&apos;s possible the cafe you&apos;re looking for
        isn&apos;t part of this pilot yet, we only list cafes we&apos;ve independently verified.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-display text-sm font-semibold text-parchment transition hover:bg-board hover:border-board"
      >
        Back to the directory
      </Link>
    </div>
  );
}
