import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { HEALTH_RESOURCES } from "@/data/healthData";

// Map database UUIDs to healthData.ts string IDs
const UUID_TO_SLUG: Record<string, string> = {
  "7400747e-caf6-4fbd-977b-c9ea3546427c": "clinical-nutrition-gut",
  "b2a35804-4f83-4c03-b348-8d8607fb00a2": "longevity-blueprint",
  "f15a64d5-9bb0-44f7-ba50-3abd16b24e33": "7-day-metabolic-reset",
  "a6cee02b-b6cf-464e-bcea-a9294d64dbbf": "intermittent-fasting-autophagy",
  "d7cf4c36-c87e-4746-b7d8-f6632246cf35": "cardiovascular-vitality",
  "90848bb8-e7da-4309-bec5-db3d7362e28e": "sleep-architecture-cortisol",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Resolve UUID to string slug if needed
  const slug = UUID_TO_SLUG[id] || id;
  const resource = HEALTH_RESOURCES.find((r) => r.id === slug);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const doc = new PDFDocument({
    margin: 72,
    size: "A4",
    info: {
      Title: resource.title,
      Author: "Dr. Arif Chowdhury",
      Subject: resource.subtitle,
      Keywords: "health, nutrition, longevity, wellness",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  // Cover / Title Page
  doc.fontSize(10).fillColor("#64748b").text("CONCIOUSLIVIN HEALTH ACADEMY", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(28).fillColor("#0f766e").font("Helvetica-Bold").text(resource.title, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor("#1e293b").font("Helvetica").text(resource.subtitle, { align: "center" });
  doc.moveDown(1);
  doc.fontSize(12).fillColor("#64748b").text("by Dr. Arif Chowdhury, PhD, M.S. Clinical Nutrition", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#94a3b8").text(`Version: ${new Date().getFullYear()} Edition`, { align: "center" });
  doc.moveDown(2);
  doc.fontSize(10).fillColor("#64748b").text(`Pages: ${resource.pages} | Reading Time: ${resource.readingTime}`, { align: "center" });
  doc.moveDown(2);
  doc.fontSize(12).fillColor("#0f766e").text("Table of Contents", { align: "center", underline: true });
  doc.moveDown(1);

  resource.tableOfContents.forEach((chapter, i) => {
    doc.fontSize(11).fillColor("#1e293b").text(`${i + 1}. ${chapter}`, { indent: 36 });
    doc.moveDown(0.3);
  });

  doc.addPage();

  // Introduction
  doc.fontSize(18).fillColor("#0f766e").font("Helvetica-Bold").text("Introduction", { align: "left" });
  doc.moveDown(1);
  doc.fontSize(11).fillColor("#1e293b").font("Helvetica").text(resource.fullContent.introduction, { align: "justify" });
  doc.moveDown(2);

  // Chapters
  resource.fullContent.chapters.forEach((chapter, idx) => {
    doc.addPage();
    doc.fontSize(18).fillColor("#0f766e").font("Helvetica-Bold").text(chapter.title, { align: "left" });
    doc.moveDown(1);

    // Process markdown-like content
    const content = chapter.content
      .replace(/\*\*(.+?)\*\*/g, "$1") // bold
      .replace(/\*(.+?)\*/g, "$1") // italic
      .replace(/`(.+?)`/g, "$1") // code
      .replace(/^###\s+(.+)$/gm, "$1") // h3
      .replace(/^##\s+(.+)$/gm, "$1") // h2
      .replace(/^#\s+(.+)$/gm, "$1"); // h1

    doc.fontSize(11).fillColor("#1e293b").font("Helvetica").text(content, { align: "justify" });
    doc.moveDown(1.5);

    if (chapter.keyTakeaways && chapter.keyTakeaways.length > 0) {
      doc.fontSize(13).fillColor("#0f766e").font("Helvetica-Bold").text("Key Action Steps & Clinical Pearls:");
      doc.moveDown(0.5);
      chapter.keyTakeaways.forEach((takeaway) => {
        doc.fontSize(10.5).fillColor("#1e293b").font("Helvetica").text(`• ${takeaway}`, { indent: 24 });
        doc.moveDown(0.3);
      });
      doc.moveDown(1);
    }

    if (chapter.doctorTip) {
      doc.fontSize(11).fillColor("#0f766e").font("Helvetica-BoldOblique").text("Dr. Arif's Clinical Pearl:");
      doc.moveDown(0.3);
      doc.fontSize(10.5).fillColor("#1e293b").font("Helvetica-Oblique").text(chapter.doctorTip, { indent: 12 });
      doc.moveDown(1.5);
    }
  });

  // Conclusion
  if (resource.fullContent.conclusion) {
    doc.addPage();
    doc.fontSize(18).fillColor("#0f766e").font("Helvetica-Bold").text("Conclusion");
    doc.moveDown(1);
    doc.fontSize(11).fillColor("#1e293b").font("Helvetica").text(resource.fullContent.conclusion, { align: "justify" });
    doc.moveDown(2);
  }

  // Protocol Summary
  if (resource.fullContent.protocolSummary && resource.fullContent.protocolSummary.length > 0) {
    doc.fontSize(16).fillColor("#0f766e").font("Helvetica-Bold").text("Protocol Summary");
    doc.moveDown(1);
    resource.fullContent.protocolSummary.forEach((step) => {
      doc.fontSize(11).fillColor("#1e293b").font("Helvetica").text(`• ${step}`, { indent: 24 });
      doc.moveDown(0.3);
    });
  }

  // Footer disclaimer
  doc.moveDown(2);
  doc.fontSize(8).fillColor("#94a3b8").font("Helvetica-Oblique").text(
    "This guide is for educational purposes only and does not constitute medical advice. Consult your physician before making health changes.",
    { align: "center" }
  );

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const pdfUint8Array = new Uint8Array(pdfBuffer);
  const filename = `${resource.title.replace(/[^a-zA-Z0-9]/g, "_")}_Dr_Arif_Chowdhury.pdf`;

  return new NextResponse(pdfUint8Array, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}