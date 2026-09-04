import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/products";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingActions } from "@/components/FloatingActions";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Crackers Categories | Nambi Crackers Sivakasi Price List" },
      {
        name: "description",
        content:
          "Browse all Sivakasi crackers categories — sparklers, flower pots, sky shots, rockets, gift boxes and more at 90% off.",
      },
      { property: "og:title", content: "Crackers Categories | Nambi Crackers" },
      {
        property: "og:description",
        content: "All Sivakasi crackers categories with 90% off price list 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Categories</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap a category to view its products and add them to your cart.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to="/"
              hash={`cat-${c.name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`}
              className="cat-bar flex items-center justify-between rounded-md px-4 py-3 text-sm font-bold"
            >
              <span>{c.name}</span>
              <span className="text-xs opacity-80">{c.products.length} items</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
