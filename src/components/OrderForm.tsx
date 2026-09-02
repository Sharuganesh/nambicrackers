import { useState } from "react";
import { APPS_SCRIPT_URL, SHOP } from "@/config";

export type OrderLine = {
  id: number;
  name: string;
  qty: number;
  price: number;
  unit: string;
};

type Props = {
  lines: OrderLine[];
  totalQty: number;
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
};

const EMPTY = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  district: "",
  state: "",
  pincode: "",
};

export function OrderForm({ lines, totalQty, totalAmount, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.mobile.trim())) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Please enter a valid 6 digit pincode.");
      return;
    }
    if (!APPS_SCRIPT_URL) {
      setError("Order system is not configured yet. Please call us to place the order.");
      return;
    }

    const items = lines
      .map((l) => `${l.name} x ${l.qty} ${l.unit} = Rs.${l.qty * l.price}`)
      .join(" | ");

    const params = new URLSearchParams({
      ...form,
      items,
      totalQty: String(totalQty),
      totalAmount: String(totalAmount),
    });

    setSending(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        redirect: "follow",
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (!data.success) throw new Error("failed");
      onSuccess();
    } catch {
      setError("Could not send your order. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof EMPTY,
    type = "text",
    inputMode?: "text" | "tel" | "numeric" | "email",
  ) => (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">
        {label} <span className="text-destructive">*</span>
      </span>
      <input
        required
        type={type}
        inputMode={inputMode}
        value={form[key]}
        onChange={set(key)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl">
        <div className="surface-royal flex items-center justify-between rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">Shipping Address</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none opacity-80 hover:opacity-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          {field("User Name", "name")}
          {field("Mobile Number", "mobile", "tel", "tel")}
          {field("Email id", "email", "email", "email")}
          {field("Address", "address")}
          {field("Delivery (City / District)", "district")}
          {field("State", "state")}
          {field("Pincode", "pincode", "text", "numeric")}

          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span className="font-semibold">{totalQty}</span>
            </div>
            <div className="mt-1 flex justify-between text-base">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-primary">Rs {totalAmount}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={sending}
              className="btn-gold hover:btn-gold-hover px-6 py-2.5 text-sm disabled:opacity-60"
            >
              {sending ? "Sending..." : "Confirm Order"}
            </button>
          </div>

          <p className="pb-2 text-center text-xs text-muted-foreground">
            Any help? Call {SHOP.phoneDisplay}
          </p>
        </form>
      </div>
    </div>
  );
}
