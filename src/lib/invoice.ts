import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SHOP } from "@/config";

export type InvoiceLine = {
  name: string;
  unit: string;
  qty: number;
  price: number;
  rate: number;
};

export type InvoiceData = {
  orderId: string;
  date: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  lines: InvoiceLine[];
  mrpTotal: number;
  discount: number;
  netTotal: number;
  totalQty: number;
};

let logoCache: string | null = null;

async function getLogo(): Promise<string | null> {
  if (logoCache !== null) return logoCache;
  try {
    const res = await fetch("/logo.jpg");
    const blob = await res.blob();
    logoCache = await new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(blob);
    });
    return logoCache;
  } catch {
    return null;
  }
}

export async function buildInvoice(data: InvoiceData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(26, 20, 60);
  doc.rect(0, 0, W, 92, "F");

  const logo = await getLogo();
  if (logo) doc.addImage(logo, "JPEG", 32, 14, 64, 64);

  doc.setTextColor(255, 214, 102);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(SHOP.name.toUpperCase(), 110, 40);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(SHOP.address, 110, 56);
  doc.text(`${SHOP.phoneDisplay}  |  ${SHOP.email}`, 110, 70);

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ORDER INVOICE", 32, 124);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID : ${data.orderId}`, W - 32, 116, { align: "right" });
  doc.text(`Date : ${data.date}`, W - 32, 132, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 32, 152);
  doc.setFont("helvetica", "normal");
  const billLines = [
    data.name,
    data.mobile,
    data.email,
    data.address,
    `${data.district}, ${data.state} - ${data.pincode}`,
  ].filter(Boolean);
  billLines.forEach((l, i) => doc.text(String(l), 32, 168 + i * 14));

  autoTable(doc, {
    startY: 176 + billLines.length * 14,
    head: [["#", "Product", "Unit", "Rate", "Price", "Qty", "Total"]],
    body: data.lines.map((l, i) => [
      String(i + 1),
      l.name,
      l.unit,
      `${l.rate}`,
      `${l.price}`,
      String(l.qty),
      `${l.qty * l.price}`,
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [26, 20, 60], textColor: [255, 214, 102] },
    columnStyles: {
      0: { cellWidth: 26 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
  });

  const y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  const right = W - 32;
  doc.setFontSize(10);
  doc.text("Total Items", right - 150, y);
  doc.text(String(data.totalQty), right, y, { align: "right" });
  doc.text("MRP Total", right - 150, y + 16);
  doc.text(`Rs ${data.mrpTotal}`, right, y + 16, { align: "right" });
  doc.text(`Discount (${SHOP.discount}%)`, right - 150, y + 32);
  doc.text(`- Rs ${data.discount}`, right, y + 32, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Net Total", right - 150, y + 54);
  doc.text(`Rs ${data.netTotal}`, right, y + 54, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(
    "This is an order enquiry confirmation. Our team will call you to confirm packing and delivery.",
    32,
    y + 84,
  );
  doc.text(
    "As per Supreme Court order, online sale of firecrackers is not permitted; orders are completed as direct in-shop billing.",
    32,
    y + 96,
  );

  return doc;
}

export async function invoiceBase64(data: InvoiceData): Promise<string> {
  const doc = await buildInvoice(data);
  const out = doc.output("datauristring");
  return out.substring(out.indexOf(",") + 1);
}

export async function downloadInvoice(data: InvoiceData) {
  const doc = await buildInvoice(data);
  doc.save(`${data.orderId}-${SHOP.name.replace(/\s+/g, "-")}.pdf`);
}

export function makeOrderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${ymd}-${rnd}`;
}
