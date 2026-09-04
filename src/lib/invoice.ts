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
    const res = await fetch("/logo.png");
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

const NAVY: [number, number, number] = [26, 20, 60];
const GOLD: [number, number, number] = [255, 214, 102];

export async function buildInvoice(data: InvoiceData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40; // page margin
  const innerW = W - M * 2;

  /* ---------- Header band ---------- */
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 100, "F");

  const logo = await getLogo();
  if (logo) doc.addImage(logo, "PNG", M, 18, 64, 64);

  const textX = M + (logo ? 78 : 0);
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(SHOP.name.toUpperCase(), textX, 40);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(doc.splitTextToSize(SHOP.address, 300), textX, 56);
  doc.text(`${SHOP.phoneDisplay}   |   ${SHOP.email}`, textX, 84);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...GOLD);
  doc.text("ORDER INVOICE", W - M, 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Order ID : ${data.orderId}`, W - M, 58, { align: "right" });
  doc.text(`Date : ${data.date}`, W - M, 72, { align: "right" });

  /* ---------- Bill To card ---------- */
  const cardY = 122;
  const cardH = 96;
  doc.setDrawColor(220, 220, 228);
  doc.setFillColor(249, 249, 252);
  doc.roundedRect(M, cardY, innerW, cardH, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("BILL TO", M + 14, cardY + 20);

  const labelX = M + 14;
  const valueX = M + 84;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Mobile", data.mobile],
    ["Email", data.email],
    ["Address", `${data.address}, ${data.district}, ${data.state} - ${data.pincode}`],
  ];
  doc.setFontSize(9);
  let ry = cardY + 38;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(90, 90, 105);
    doc.text(`${label}`, labelX, ry);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(25, 25, 35);
    const wrapped = doc.splitTextToSize(String(value || "-"), innerW - 110);
    doc.text(wrapped, valueX, ry);
    ry += 14 * wrapped.length;
  });

  /* ---------- Items table ---------- */
  autoTable(doc, {
    startY: cardY + cardH + 18,
    margin: { left: M, right: M },
    head: [["#", "Product", "Unit", "MRP", "Offer", "Qty", "Amount"]],
    body: data.lines.map((l, i) => [
      String(i + 1),
      l.name,
      l.unit,
      `${l.rate}`,
      `${l.price}`,
      String(l.qty),
      `${l.qty * l.price}`,
    ]),
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
      lineColor: [226, 226, 234],
      lineWidth: 0.5,
      valign: "middle",
      textColor: [30, 30, 40],
    },
    headStyles: {
      fillColor: NAVY,
      textColor: GOLD,
      fontSize: 9,
      halign: "center",
      valign: "middle",
    },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    columnStyles: {
      0: { cellWidth: 26, halign: "center" },
      1: { cellWidth: "auto", halign: "left" },
      2: { cellWidth: 54, halign: "center" },
      3: { cellWidth: 52, halign: "right" },
      4: { cellWidth: 52, halign: "right" },
      5: { cellWidth: 40, halign: "center" },
      6: { cellWidth: 62, halign: "right" },
    },
  });

  /* ---------- Summary box ---------- */
  let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;
  const boxW = 240;
  const boxX = W - M - boxW;
  const boxH = 96;

  if (y + boxH + 70 > H) {
    doc.addPage();
    y = 60;
  }

  doc.setDrawColor(220, 220, 228);
  doc.setFillColor(249, 249, 252);
  doc.roundedRect(boxX, y, boxW, boxH, 6, 6, "FD");

  const lx = boxX + 14;
  const rx = boxX + boxW - 14;
  const line = (label: string, value: string, dy: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9.5);
    doc.setTextColor(bold ? 26 : 80, bold ? 20 : 80, bold ? 60 : 95);
    doc.text(label, lx, y + dy);
    doc.setTextColor(25, 25, 35);
    doc.text(value, rx, y + dy, { align: "right" });
  };

  line("Total Items", String(data.totalQty), 22);
  line("MRP Total", `Rs ${data.mrpTotal}`, 40);
  line(`Discount (${SHOP.discount}%)`, `- Rs ${data.discount}`, 58);

  doc.setDrawColor(226, 226, 234);
  doc.line(lx, y + 66, rx, y + 66);
  line("Net Total", `Rs ${data.netTotal}`, 84, true);

  /* ---------- Footer notes ---------- */
  const fy = y + boxH + 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 120);
  doc.text(
    doc.splitTextToSize(
      "This is an order enquiry confirmation. Our team will call you to confirm packing and delivery.",
      innerW,
    ),
    M,
    fy,
  );
  doc.text(
    doc.splitTextToSize(
      "As per Supreme Court order, online sale of firecrackers is not permitted; orders are completed as direct in-shop billing.",
      innerW,
    ),
    M,
    fy + 12,
  );

  doc.setFillColor(...NAVY);
  doc.rect(0, H - 26, W, 26, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(8.5);
  doc.text(`Thank you for shopping with ${SHOP.name}`, M, H - 9);
  doc.text(SHOP.phoneDisplay, W - M, H - 9, { align: "right" });

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
