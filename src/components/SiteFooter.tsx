import { SHOP } from "@/config";

export function SiteFooter() {
  return (
    <footer className="surface-royal px-4 py-8 text-center">
      <p className="text-lg font-bold">{SHOP.name}</p>
      <p className="mx-auto mt-2 max-w-md text-sm opacity-85">{SHOP.address}</p>
      <p className="mt-2 text-sm opacity-85">
        <a href={`tel:+91${SHOP.phone}`}>{SHOP.phoneDisplay}</a> &middot;{" "}
        <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
      </p>
      <p className="mt-4 text-xs opacity-70">
        As per Supreme Court order, online sale of firecrackers is not permitted. Orders placed here
        are treated as enquiries and completed as direct in-shop billing.
      </p>
    </footer>
  );
}
