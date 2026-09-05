import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { APPS_SCRIPT_URL, SHOP } from "@/config";
import type { Product } from "@/data/products";
import { invoiceBase64, makeOrderId, type InvoiceData } from "@/lib/invoice";

export type CartLine = Product & { qty: number };

type Props = {
  lines: CartLine[];
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  onClose: () => void;
  onDone: (data: InvoiceData) => void;
};

const EMPTY = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};


export function Cart({ lines, setQty, clear, onClose, onDone }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const closedByBack = useRef(false);

  // Mobile hardware / gesture back closes the cart instead of leaving the site.
  useEffect(() => {
    const cartId = `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.history.pushState({ cartId }, "");
    const onPop = () => {
      // Ignore pops that land back on our own entry (dev double-mount).
      if (window.history.state?.cartId === cartId) return;
      closedByBack.current = true;
      onClose();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (!closedByBack.current && window.history.state?.cartId === cartId) {
        // Swallow the popstate caused by our own cleanup.
        const skip = (e: PopStateEvent) => e.stopImmediatePropagation();
        window.addEventListener("popstate", skip, { capture: true, once: true });
        window.history.back();
      }
    };
  }, [onClose]);

  const mrpTotal = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const netTotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const discount = mrpTotal - netTotal;
  const belowMin = netTotal < SHOP.minOrder;

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildData = (): InvoiceData => ({
    orderId: makeOrderId(),
    date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    ...form,
    lines: lines.map((l) => ({
      name: l.name,
      unit: l.unit,
      qty: l.qty,
      price: l.price,
      rate: l.rate,
    })),
    mrpTotal,
    discount,
    netTotal,
    totalQty,
  });

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^\d{10}$/.test(form.mobile.trim())) return "Please enter a valid 10 digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Please enter a valid email id.";
    if (!form.address.trim()) return "Please enter your delivery address.";
    if (!form.city.trim()) return "Please enter your city.";
    if (!form.district.trim()) return "Please enter your district.";
    if (!form.state.trim()) return "Please enter your state.";
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Please enter a valid 6 digit pincode.";
    if (belowMin) return `Minimum order value is Rs ${SHOP.minOrder}.`;
    return "";
  };


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");

    const data = buildData();
    setSending(true);
    try {
      const pdf = await invoiceBase64(data);
      const body = new URLSearchParams({
        orderId: data.orderId,
        ...form,
        items: lines.map((l) => `${l.name} x ${l.qty} ${l.unit} = Rs.${l.qty * l.price}`).join("\n"),
        totalQty: String(totalQty),
        mrpTotal: String(mrpTotal),
        discountAmount: String(discount),
        totalAmount: String(netTotal),
        pdf,
      });
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      clear();
      onDone(data);
    } catch {
      setError("Could not send your order. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const whatsapp = () => {
    const msg = [
      `New Order - ${SHOP.name}`,
      "",
      ...lines.map((l) => `- ${l.name} x ${l.qty} ${l.unit} = Rs.${l.qty * l.price}`),
      "",
      `Total Items: ${totalQty}`,
      `Net Total: Rs.${netTotal}`,
      form.name ? `\nName: ${form.name}` : "",
      form.mobile ? `Mobile: ${form.mobile}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/91${SHOP.phone}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const field = (label: string, key: keyof typeof EMPTY, type = "text") => (
    <input
      key={key}
      type={type}
      value={form[key]}
      onChange={set(key)}
      placeholder={label}
      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-accent"
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/60">
      <div className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="surface-royal flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">Cart</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-accent/80 py-1.5 text-center text-xs font-semibold text-ink">
          Packing Charges Free
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">Your cart is empty.</p>
          )}

          {lines.length > 0 && (
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
              >
                Clear Cart <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            {lines.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-2"
              >
                <img
                  src={`/products/${l.slug}.jpg`}
                  alt={l.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Price : {l.price} &middot; Qty : {l.qty}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => setQty(l.id, Number(e.target.value))}
                    className="w-14 rounded border border-input bg-background px-1 py-1 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(l.id, 0)}
                    aria-label={`Remove ${l.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 rounded-lg bg-muted px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span>MRP Total</span>
              <span>Rs {mrpTotal}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>- Rs {discount}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Net Total</span>
              <span className="text-primary">Rs {netTotal}</span>
            </div>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <h3 className="text-center text-lg font-bold">Submit your details</h3>
            <p className="text-center text-xs font-semibold text-muted-foreground">
              Minimum Order Value {SHOP.minOrder}
            </p>
            {field("Enter Name", "name")}
            {field("Mobile Number", "mobile", "tel")}
            {field("Email id", "email", "email")}
            {field("Address", "address")}
            {field("City / District", "district")}
            {field("State", "state")}
            {field("Pincode", "pincode")}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex gap-2 pb-6">
              <button
                type="button"
                onClick={whatsapp}
                disabled={lines.length === 0}
                className="flex-1 rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                WhatsApp
              </button>
              <button
                type="submit"
                disabled={sending || lines.length === 0}
                className="btn-gold hover:btn-gold-hover flex-1 px-4 py-3 text-sm disabled:opacity-50"
              >
                {sending ? "Sending..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
