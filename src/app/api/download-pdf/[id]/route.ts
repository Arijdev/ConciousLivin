import { NextRequest, NextResponse } from "next/server";
import { HEALTH_RESOURCES } from "@/data/healthData";
import { generateBookPdf } from "@/lib/pdf-generator";
import { createClient } from "@supabase/supabase-js";
import { HealthResource } from "@/types/health";

// Map database UUIDs to healthData.ts string IDs
const UUID_TO_SLUG: Record<string, string> = {
  // Current Supabase UUIDs
  "e5f4eb62-263c-40b8-a595-a81bdd427011": "clinical-nutrition-gut",
  "53474f48-4781-4210-a532-a3677d2116be": "longevity-blueprint",
  "93d6f36b-f650-486f-aff0-cbc040a3b3ed": "7-day-metabolic-reset",
  "c1811d30-c1f9-4239-96c6-149891edeb00": "intermittent-fasting-autophagy",
  "a26396cb-e066-4820-b806-be3798ab727c": "cardiovascular-vitality",
  "027e7c28-cd3e-4501-8d96-bf1eea78b9fd": "sleep-architecture-cortisol",
  // Legacy UUIDs
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

  // 1. Direct match by slug
  let resource: HealthResource | undefined = HEALTH_RESOURCES.find((r) => r.id === id);

  // 2. Map from UUID map
  if (!resource && UUID_TO_SLUG[id]) {
    resource = HEALTH_RESOURCES.find((r) => r.id === UUID_TO_SLUG[id]);
  }

  // 3. Match by filename or slug without extension
  if (!resource) {
    const cleanId = id.replace(/\.pdf$/, "");
    resource = HEALTH_RESOURCES.find((r) => r.id === cleanId || UUID_TO_SLUG[cleanId] === r.id);
  }

  // 4. Fallback: query Supabase by ID or title
  if (!resource && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data: dbRes } = await supabase
        .from("health_resources")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (dbRes) {
        resource = HEALTH_RESOURCES.find(
          (r) => r.title.toLowerCase().trim() === dbRes.title.toLowerCase().trim()
        );
        if (!resource && dbRes.full_content) {
          resource = {
            id: dbRes.id,
            title: dbRes.title,
            subtitle: dbRes.subtitle || "A Clinical Protocol by Dr. Arif Chowdhury",
            category: dbRes.category,
            isFree: dbRes.is_free,
            price: dbRes.price,
            rating: dbRes.rating,
            reviewCount: dbRes.review_count,
            pages: dbRes.pages,
            readingTime: dbRes.reading_time,
            coverImage: dbRes.cover_image_url || "/images/book_nutrition.jpg",
            description: dbRes.description || "",
            highlights: dbRes.highlights || [],
            tableOfContents: dbRes.table_of_contents || [],
            fullContent: dbRes.full_content,
          };
        }
      }
    } catch (e) {
      console.warn("Supabase lookup in download-pdf failed:", e);
    }
  }

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await generateBookPdf(resource);
    const pdfUint8Array = new Uint8Array(pdfBuffer);
    const filename = `${resource.title.replace(/[^a-zA-Z0-9]/g, "_")}_Dr_Arif_Chowdhury.pdf`;

    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("PDF Generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF document" }, { status: 500 });
  }
}
