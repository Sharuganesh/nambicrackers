import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ShoppingCart, Minus, Plus } from "lucide-react";
import { CATEGORIES, ALL_PRODUCTS } from "@/data/products";
import { SHOP } from "@/config";
import { Cart, type CartLine } from "@/components/Cart";
import { downloadInvoice, type InvoiceData } from "@/lib/invoice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nambi Crackers Sivakasi | 90% Off Diwali Crackers Price List 2026" },
      {
        name: "description",
        content:
          "Order Sivakasi crackers online from Nambi Crackers at 90% discount. Full 2026 price list with photos, safe packing and fast delivery across Tamil Nadu.",
      },
      { property: "og:title", content: "Nambi Crackers Sivakasi | 90% Off Price List 2026" },
      {
        property: "og:description",
        content:
          "Direct-from-factory Sivakasi crackers at 90% off. Browse the full price list and order online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [qty, setQty] = useState<Record<number, number>>({});
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [done, setDone] = useState<InvoiceData | null>(null);

  const lines: CartLine[] = useMemo(
    () =>
      ALL_PRODUCTS.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({ ...p, qty: qty[p.id] ?? 0 })),
    [qty],
  );

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const netTotal = lines.reduce((s, l) => s + l.qty * l.price, 0);

  const q = query.trim().toLowerCase();
  const categories = q
    ? CATEGORIES.map((c) => ({
        ...c,
        products: c.products.filter(
          (p) => p.name.toLowerCase().includes(q) || p.tamil.includes(query.trim()),
        ),
      })).filter((c) => c.products.length)
    : CATEGORIES;

  const setValue = (id: number, v: number) =>
    setQty((s) => ({ ...s, [id]: Number.isFinite(v) && v > 0 ? Math.floor(v) : 0 }));

  return (
    <div className="min-h-screen pb-28">
      <header className="surface-royal sticky top-0 z-30 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5">
          <img
            src="/logo.jpg"
            alt="Nambi Crackers logo"
            className="h-11 w-11 shrink-0 rounded-full object-contain"
            width={44}
            height={44}
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold sm:text-xl">Nambi Crackers</h1>
            <p className="truncate text-[11px] opacity-80 sm:text-xs">
              Sivakasi &middot; 90% Discount Price List 2026
            </p>
          </div>
          <a
            href={`tel:+91${SHOP.phone}`}
            className="btn-gold ml-auto shrink-0 px-3 py-2 text-xs sm:text-sm"
          >
            Call Us
          </a>
        </div>
      </header>

      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-7 text-center">
          <img
            src="/logo.jpg"
            alt="Nambi Crackers Sivakasi"
            className="mx-auto h-28 w-28 rounded-xl object-contain sm:h-36 sm:w-36"
          />
          <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
            Sivakasi Crackers at 90% Off
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{SHOP.address}</p>
          <p className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
            Minimum order Rs {SHOP.minOrder}
          </p>
        </div>
      </section>

      <div className="sticky top-[64px] z-20 border-b border-border bg-background/95 px-3 py-2 backdrop-blur">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Here"
          className="mx-auto block w-full max-w-5xl rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none focus:border-accent"
        />
      </div>

      <main className="mx-auto max-w-5xl px-2 py-4 sm:px-4">
        {categories.map((cat) => (
          <section key={cat.name} className="mb-6">
            <h3 className="cat-bar rounded-t-md px-3 py-2 text-center text-sm font-bold sm:text-base">
              {cat.name}
            </h3>

            <div className="overflow-hidden rounded-b-md border border-t-0 border-border bg-card">
              <div className="hidden bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[80px_1fr_90px_70px_90px_150px_90px]">
                <span>Image</span>
                <span>Product Name</span>
                <span className="text-right">Price</span>
                <span className="text-center">Unit</span>
                <span className="text-right">Discount</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {cat.products.map((p) => {
                const n = qty[p.id] ?? 0;
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[64px_1fr] items-center gap-3 border-t border-border px-3 py-2.5 sm:grid-cols-[80px_1fr_90px_70px_90px_150px_90px] sm:gap-2"
                  >
                    <img
                      src={`/products/${p.slug}.jpg`}
                      alt={p.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-md border border-border object-cover"
                    />

                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.tamil}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs sm:hidden">
                        <span className="text-muted-foreground line-through">Rs {p.rate}</span>
                        <span className="font-bold text-primary">Rs {p.price}</span>
                        <span className="text-muted-foreground">/ {p.unit}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 sm:hidden">
                        <QtyControl value={n} onChange={(v) => setValue(p.id, v)} />
                        <span className="ml-auto text-sm font-semibold">
                          {n > 0 ? `Rs ${n * p.price}` : "-"}
                        </span>
                      </div>
                    </div>

                    <span className="hidden text-right text-sm text-muted-foreground line-through sm:block">
                      {p.rate}
                    </span>
                    <span className="hidden text-center text-xs text-muted-foreground sm:block">
                      {p.unit}
                    </span>
                    <span className="hidden text-right font-bold text-primary sm:block">
                      {p.price}
                    </span>
                    <span className="hidden justify-center sm:flex">
                      <QtyControl value={n} onChange={(v) => setValue(p.id, v)} />
                    </span>
                    <span className="hidden text-right text-sm font-semibold sm:block">
                      {n > 0 ? n * p.price : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No products found.</p>
        )}
      </main>

      <footer className="surface-royal px-4 py-8 text-center">
        <h3 className="text-lg font-bold">{SHOP.name}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm opacity-85">{SHOP.address}</p>
        <p className="mt-2 text-sm opacity-85">
          <a href={`tel:+91${SHOP.phone}`}>{SHOP.phoneDisplay}</a> &middot;{" "}
          <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
        </p>
        <p className="mt-4 text-xs opacity-70">
          As per Supreme Court order, online sale of firecrackers is not permitted. Orders placed
          here are treated as enquiries and completed as direct in-shop billing.
        </p>
      </footer>

      {/* Floating buttons */}
      <a
        href={`https://wa.me/91${SHOP.phone}`}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.45 1.34 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.2h.01a9.9 9.9 0 0 0 9.9-9.9A9.9 9.9 0 0 0 12.04 2Zm5.8 14.05c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11-.42-.11-.96-.29-1.65-.59-2.9-1.25-4.79-4.17-4.94-4.37-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48l-.44.51c-.14.14-.29.3-.12.59.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.26.09 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.69-.17 1.37Z" />
        </svg>
      </a>

      <button
        onClick={() => setShowCart(true)}
        aria-label="Open cart"
        className="btn-gold fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-xl"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalQty > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
            {totalQty}
          </span>
        )}
      </button>

      {/* Bottom order bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-3 py-2.5 shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.4)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 leading-tight">
            <div className="text-xs text-muted-foreground">Total Items {totalQty}</div>
            <div className="text-lg font-bold text-primary">Total Price: Rs {netTotal}</div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="btn-gold hover:btn-gold-hover ml-auto px-6 py-3 text-sm"
          >
            Order Now
          </button>
        </div>
      </div>

      {showCart && (
        <Cart
          lines={lines}
          setQty={setValue}
          clear={() => setQty({})}
          onClose={() => setShowCart(false)}
          onDone={(data) => {
            setShowCart(false);
            setDone(data);
          }}
        />
      )}

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Enquiry Submitted Successfully!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you! Your enquiry has been received.
            </p>
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Enquiry Number
              </div>
              <div className="text-2xl font-bold text-green-700">{done.orderId}</div>
              <div className="mt-1 text-sm">Total: Rs {done.netTotal}</div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Our team will verify your enquiry and contact you via email or WhatsApp with payment
              and delivery details. The invoice has been emailed to you.
            </p>
            <button
              onClick={() => downloadInvoice(done)}
              className="btn-gold hover:btn-gold-hover mt-5 w-full py-3 text-sm"
            >
              Download Invoice PDF
            </button>
            <button
              onClick={() => setDone(null)}
              className="mt-2 w-full rounded-md border border-input py-2.5 text-sm font-semibold"
            >
              Shop More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QtyControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded border border-input bg-background"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0"
        className="w-12 rounded border border-input bg-background px-1 py-1.5 text-center text-base outline-none focus:border-accent"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded border border-input bg-background"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
