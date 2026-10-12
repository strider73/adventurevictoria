import { NextRequest, NextResponse } from "next/server";
import { rentalKeyMatches } from "@/lib/rental/auth";
import { buildSite } from "@/lib/rental/buildSite";
import { rentalHomeFromEnv } from "@/lib/rental/home";
import { SITE_READ_SQL } from "@/lib/rental/siteRead";
import { getRentalPool } from "@/lib/rentalDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function notFound(): NextResponse {
  return new NextResponse(null, { status: 404 });
}

export async function GET(request: NextRequest) {
  const candidate = request.nextUrl.searchParams.get("k");
  if (!rentalKeyMatches(candidate, process.env.RENTAL_SITE_KEY)) return notFound();

  try {
    const result = await getRentalPool().query(SITE_READ_SQL);
    const data = result.rows[0]?.data;
    if (!data) throw new Error("Rental site query returned no data");
    return NextResponse.json(buildSite(data.listings, data.ratings, new Date(), rentalHomeFromEnv()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to build rental site data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
