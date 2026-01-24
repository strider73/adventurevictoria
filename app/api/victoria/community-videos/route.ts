import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const communityVideos = await db
      .collection("victoria_community_videos")
      .find({})
      .toArray();

    return NextResponse.json({ communityVideos });
  } catch (error) {
    console.error("Failed to fetch community videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch community videos" },
      { status: 500 }
    );
  }
}
