import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();

    const [videos, channel] = await Promise.all([
      db.collection("korea_videos").find({}).toArray(),
      db.collection("korea_channels").findOne({}),
    ]);

    return NextResponse.json({ channel, videos });
  } catch (error) {
    console.error("Failed to fetch Korea videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch Korea videos" },
      { status: 500 }
    );
  }
}
