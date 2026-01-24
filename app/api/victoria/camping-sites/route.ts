import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const campingSites = await db
      .collection("victoria_camping_sites")
      .find({})
      .toArray();

    return NextResponse.json({ campingSites });
  } catch (error) {
    console.error("Failed to fetch camping sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch camping sites" },
      { status: 500 }
    );
  }
}
