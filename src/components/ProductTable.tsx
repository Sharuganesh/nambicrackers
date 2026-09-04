import { Minus, Plus } from "lucide-react";
import type { Category } from "@/data/products";

export function QtyControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
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

export function ProductTable({
  cat,
  qty,
  setValue,
}: {
  cat: Category;
  qty: Record<number, number>;
  setValue: (id: number, v: number) => void;
}) {
  return (
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
            <span className="hidden text-right font-bold text-primary sm:block">{p.price}</span>
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
  );
}
