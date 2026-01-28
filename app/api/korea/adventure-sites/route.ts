import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const adventureSites = await db
      .collection("korea_adventure_sites")
      .find({})
      .toArray();

    return NextResponse.json({ adventureSites });
  } catch (error) {
    console.error("Failed to fetch Korea adventure sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch Korea adventure sites" },
      { status: 500 }
    );
  }
}
