import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SHOP } from "@/config";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/track", label: "Track Order" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="surface-royal sticky top-0 z-30 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5">
        <img
          src="/logo.png"
          alt="Nambi Crackers logo"
          className="h-11 w-11 shrink-0 rounded-full object-contain"
          width={44}
          height={44}
        />
        <div className="min-w-0">
          <p className="truncate text-base font-bold sm:text-xl">{SHOP.name}</p>
          <p className="truncate text-[11px] opacity-80 sm:text-xs">
            Sivakasi &middot; 90% Discount Price List 2026
          </p>
        </div>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "bg-white/15" }}
              className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="btn-gold ml-auto flex h-10 w-10 items-center justify-center sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/15 px-3 pb-3 sm:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "bg-white/15" }}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
