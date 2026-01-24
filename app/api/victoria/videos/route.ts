import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const videos = await db
      .collection("victoria_videos")
      .find({})
      .toArray();

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
