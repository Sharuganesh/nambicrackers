import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Minus, Plus } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingActions } from "@/components/FloatingActions";
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
  const [open, setOpen] = useState<Record<string, boolean>>({});

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
      <SiteHeader />

      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-7 text-center">
          <img
            src="/logo.jpg"
            alt="Nambi Crackers Sivakasi"
            className="mx-auto h-28 w-28 rounded-xl object-contain sm:h-36 sm:w-36"
          />
          <h1 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
            Sivakasi Crackers at 90% Off
          </h1>
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
        {categories.map((cat) => {
          const slug = cat.name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
          const isOpen = q ? true : (open[cat.name] ?? false);
          return (
          <section key={cat.name} id={`cat-${slug}`} className="mb-3">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [cat.name]: !isOpen }))}
              aria-expanded={isOpen}
              className="cat-bar flex w-full items-center justify-between gap-2 rounded-md px-3 py-3 text-sm font-bold sm:text-base"
            >
              <span className="text-left">{cat.name}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
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
            )}
          </section>
          );
        })}

        {categories.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No products found.</p>
        )}
      </main>

      <SiteFooter />

      <FloatingActions totalQty={totalQty} onCart={() => setShowCart(true)} />

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
