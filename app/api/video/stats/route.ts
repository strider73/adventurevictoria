import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export interface VideoStats {
  helpfulCount: number;
  wrongInfoCount: number;
  lowQualityCount: number;
}

// GET /api/video/stats?videoId=xxx - Get stats for a single video
// GET /api/video/stats?videoIds=a,b,c - Get stats for multiple videos (batch)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const videoIds = searchParams.get("videoIds");

    const db = await getDatabase();
    const statsCollection = db.collection("video_stats");

    // Single video stats
    if (videoId) {
      const stats = await statsCollection.findOne({ videoId });

      return NextResponse.json({
        helpfulCount: stats?.helpfulCount || 0,
        wrongInfoCount: stats?.wrongInfoCount || 0,
        lowQualityCount: stats?.lowQualityCount || 0,
      });
    }

    // Batch video stats
    if (videoIds) {
      const ids = videoIds.split(",").filter((id) => id.trim());

      if (ids.length === 0) {
        return NextResponse.json({});
      }

      // Limit batch size to prevent abuse
      if (ids.length > 50) {
        return NextResponse.json(
          { error: "Too many video IDs. Maximum is 50." },
          { status: 400 }
        );
      }

      const statsList = await statsCollection
        .find({ videoId: { $in: ids } })
        .toArray();

      // Build response object with videoId as key
      const result: Record<string, VideoStats> = {};

      // Initialize all requested IDs with zero counts
      ids.forEach((id) => {
        result[id] = {
          helpfulCount: 0,
          wrongInfoCount: 0,
          lowQualityCount: 0,
        };
      });

      // Fill in actual stats
      statsList.forEach((stats) => {
        result[stats.videoId] = {
          helpfulCount: stats.helpfulCount || 0,
          wrongInfoCount: stats.wrongInfoCount || 0,
          lowQualityCount: stats.lowQualityCount || 0,
        };
      });

      return NextResponse.json(result);
    }

    // No videoId or videoIds provided
    return NextResponse.json(
      { error: "Missing videoId or videoIds parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching video stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
