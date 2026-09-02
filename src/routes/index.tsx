import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import logo from "@/assets/nambi-logo.png.asset.json";
import { CATEGORIES, ALL_PRODUCTS } from "@/data/products";
import { SHOP } from "@/config";
import { OrderForm, type OrderLine } from "@/components/OrderForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nambi Crackers Sivakasi | 80% Off Diwali Crackers Online Order" },
      {
        name: "description",
        content:
          "Order Sivakasi crackers online from Nambi Crackers at 80% discount. Full 2026 price list, safe packing and fast delivery across Tamil Nadu.",
      },
      { property: "og:title", content: "Nambi Crackers Sivakasi | 80% Off Price List 2026" },
      {
        property: "og:description",
        content:
          "Direct-from-factory Sivakasi crackers at 80% off. Browse the full price list and place your order online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [qty, setQty] = useState<Record<number, number>>({});
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  const lines: OrderLine[] = useMemo(
    () =>
      ALL_PRODUCTS.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({
        id: p.id,
        name: p.name,
        qty: qty[p.id] ?? 0,
        price: p.price,
        unit: p.unit,
      })),
    [qty],
  );

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const totalAmount = lines.reduce((s, l) => s + l.qty * l.price, 0);

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

  const openForm = () => {
    if (totalAmount < SHOP.minOrder) return;
    setShowForm(true);
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="surface-royal sticky top-0 z-30 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5">
          <img
            src={logo.url}
            alt="Nambi Crackers logo"
            className="h-11 w-11 shrink-0 rounded-full bg-ink/40 object-contain"
            width={44}
            height={44}
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold sm:text-xl">Nambi Crackers</h1>
            <p className="truncate text-[11px] opacity-80 sm:text-xs">
              Sivakasi &middot; 80% Discount Price List 2026
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
            src={logo.url}
            alt="Nambi Crackers Sivakasi"
            className="mx-auto h-28 w-28 object-contain sm:h-36 sm:w-36"
          />
          <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
            Sivakasi Crackers at 80% Off
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            {SHOP.address}
          </p>
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
            <h3 className="cat-bar rounded-t-md px-3 py-2.5 text-center text-sm font-bold sm:text-base">
              {cat.name}
            </h3>
            <div className="overflow-hidden rounded-b-md border border-t-0 border-border bg-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-2">Product</th>
                    <th className="px-1 py-2 text-right">Rate</th>
                    <th className="px-1 py-2 text-right">Price</th>
                    <th className="px-1 py-2 text-center">Qty</th>
                    <th className="px-2 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.products.map((p) => {
                    const n = qty[p.id] ?? 0;
                    return (
                      <tr key={p.id} className="border-t border-border align-middle">
                        <td className="px-2 py-2">
                          <div className="font-semibold leading-tight">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.tamil} &middot; {p.unit}
                          </div>
                        </td>
                        <td className="px-1 py-2 text-right text-xs text-muted-foreground line-through">
                          {p.rate}
                        </td>
                        <td className="px-1 py-2 text-right font-bold text-primary">
                          {p.price}
                        </td>
                        <td className="px-1 py-2 text-center">
                          <input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={n === 0 ? "" : n}
                            onChange={(e) => setValue(p.id, Number(e.target.value))}
                            className="w-14 rounded border border-input bg-background px-1.5 py-1.5 text-center text-base outline-none focus:border-accent"
                          />
                        </td>
                        <td className="px-2 py-2 text-right font-semibold">
                          {n > 0 ? n * p.price : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
          As per Supreme Court order, online sale of firecrackers is not permitted. Orders
          placed here are treated as enquiries and completed as direct in-shop billing.
        </p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-3 py-2.5 shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.4)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 leading-tight">
            <div className="text-xs text-muted-foreground">Total Items {totalQty}</div>
            <div className="text-lg font-bold text-primary">Rs {totalAmount}</div>
          </div>
          <button
            onClick={openForm}
            disabled={totalAmount < SHOP.minOrder}
            className="btn-gold hover:btn-gold-hover ml-auto px-5 py-3 text-sm disabled:opacity-50"
          >
            {totalAmount < SHOP.minOrder
              ? `Min Rs ${SHOP.minOrder}`
              : "Place Order"}
          </button>
        </div>
      </div>

      {showForm && (
        <OrderForm
          lines={lines}
          totalQty={totalQty}
          totalAmount={totalAmount}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setQty({});
            setDone(true);
          }}
        />
      )}

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-primary">Order Received</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you! Our team will call you shortly on your mobile number to confirm
              your order.
            </p>
            <button
              onClick={() => setDone(false)}
              className="btn-gold hover:btn-gold-hover mt-5 w-full py-2.5 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
