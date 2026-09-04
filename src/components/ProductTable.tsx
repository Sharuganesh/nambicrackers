import { Minus, Plus } from "lucide-react";
import type { Category } from "@/data/products";

export function QtyControl({
  value,
  onChange,
  compact,
}: {
  value: number;
  onChange: (v: number) => void;
  compact?: boolean;
}) {
  const btn = compact ? "h-7 w-7" : "h-8 w-8";
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(0, value - 1))}
        className={`flex ${btn} shrink-0 items-center justify-center rounded border border-input bg-background`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0"
        className={`${compact ? "w-9 text-sm" : "w-12 text-base"} rounded border border-input bg-background px-1 py-1 text-center outline-none focus:border-accent`}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={`flex ${btn} shrink-0 items-center justify-center rounded border border-input bg-background`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

const ROW =
  "grid grid-cols-[40px_minmax(0,1fr)_46px_40px_46px_96px] items-center gap-1 sm:grid-cols-[72px_minmax(0,1fr)_80px_70px_80px_150px_80px] sm:gap-2";

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
      <div
        className={`${ROW} bg-muted px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-3 sm:text-xs`}
      >
        <span>Image</span>
        <span>Product Name</span>
        <span className="text-right">Price</span>
        <span className="text-center">Unit</span>
        <span className="text-right">Discount</span>
        <span className="text-center">Quantity</span>
        <span className="hidden text-right sm:block">Total</span>
      </div>

      {cat.products.map((p) => {
        const n = qty[p.id] ?? 0;
        return (
          <div key={p.id} className={`${ROW} border-t border-border px-2 py-2 sm:px-3 sm:py-2.5`}>
            <img
              src={`/products/${p.slug}.jpg`}
              alt={p.name}
              loading="lazy"
              className="h-10 w-10 rounded border border-border object-cover sm:h-16 sm:w-16"
            />

            <div className="min-w-0">
              <div className="text-xs font-semibold leading-tight sm:text-sm">{p.name}</div>
              <div className="truncate text-[10px] text-muted-foreground sm:text-xs">{p.tamil}</div>
              {n > 0 && (
                <div className="text-[10px] font-semibold text-primary sm:hidden">
                  Total Rs {n * p.price}
                </div>
              )}
            </div>

            <span className="text-right text-[11px] text-muted-foreground line-through sm:text-sm">
              {p.rate}
            </span>
            <span className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
              {p.unit}
            </span>
            <span className="text-right text-xs font-bold text-primary sm:text-base">
              {p.price}
            </span>
            <span className="flex justify-center">
              <QtyControl value={n} onChange={(v) => setValue(p.id, v)} compact />
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
