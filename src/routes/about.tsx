import { createFileRoute } from "@tanstack/react-router";
import { SHOP } from "@/config";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingActions } from "@/components/FloatingActions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Nambi Crackers | Sivakasi Fireworks Supplier" },
      {
        name: "description",
        content:
          "Nambi Crackers supplies quality Sivakasi crackers all year round for every festival, with fast and safe doorstep delivery.",
      },
      { property: "og:title", content: "About Nambi Crackers | Sivakasi Fireworks Supplier" },
      {
        property: "og:description",
        content:
          "Quality Sivakasi crackers for every festival, delivered safely to your doorstep at the best price.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">About Us</h1>
        <p className="mt-4 text-base leading-relaxed text-foreground">
          Buy crackers online at the best price! We supply a wide range of products throughout the
          year for all festivals and celebrations. Fast, safe delivery to your doorstep. We have the
          good relationship with our valuable customers.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Best Price", d: "Crackers discount at 90% off MRP." },
            { t: "Safe Packing", d: "Carefully packed and dispatched for a safe journey." },
            { t: "Fast Delivery", d: "Quick doorstep delivery across Tamil Nadu." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-bold text-primary">{c.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-secondary p-5">
          <h2 className="font-bold text-primary">Visit Our Shop</h2>
          <p className="mt-1 text-sm text-muted-foreground">{SHOP.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {SHOP.phoneDisplay} &middot; {SHOP.email}
          </p>
        </div>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
