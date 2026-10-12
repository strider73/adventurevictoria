import { NextRequest, NextResponse } from "next/server";
import { rentalKeyMatches } from "@/lib/rental/auth";
import { isRentalRatingInput } from "@/lib/rental/ratingValidation";
import { getRentalPool } from "@/lib/rentalDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RATING_SQL = `INSERT INTO rental_client_houses (client_id, house_key, stars, inspected_on, rating_updated_at, updated_at)
SELECT 1, $1, $2::int, NULLIF($3, '')::date, now(), now()
WHERE EXISTS (SELECT 1 FROM rental_houses WHERE key = $1)
ON CONFLICT (client_id, house_key) DO UPDATE SET
  stars = EXCLUDED.stars,
  inspected_on = EXCLUDED.inspected_on,
  rating_updated_at = now(),
  updated_at = now();`;

function notFound(): NextResponse {
  return new NextResponse(null, { status: 404 });
}

export async function POST(request: NextRequest) {
  const candidate = request.nextUrl.searchParams.get("k");
  if (!rentalKeyMatches(candidate, process.env.RENTAL_SITE_KEY)) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return notFound();
  }
  if (!isRentalRatingInput(body)) return notFound();

  try {
    await getRentalPool().query(RATING_SQL, [body.key, body.stars, body.inspected]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save rental rating:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
