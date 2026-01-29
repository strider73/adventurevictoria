import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export type ReportType = "helpful" | "wrongInfo" | "lowQuality";

interface ReportRequest {
  videoId: string;
  siteId: string;
  visitorId: string;
  reportType: ReportType;
}

// POST /api/video/report - Submit a video report/feedback
export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { videoId, siteId, visitorId, reportType } = body;

    // Validate required fields
    if (!videoId || !siteId || !visitorId || !reportType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate report type
    const validTypes: ReportType[] = ["helpful", "wrongInfo", "lowQuality"];
    if (!validTypes.includes(reportType)) {
      return NextResponse.json(
        { success: false, error: "Invalid report type" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const reportsCollection = db.collection("video_reports");
    const statsCollection = db.collection("video_stats");

    // Check for duplicate report (same visitor, same video, same type)
    const existingReport = await reportsCollection.findOne({
      videoId,
      visitorId,
      reportType,
    });

    if (existingReport) {
      return NextResponse.json(
        { success: false, error: "Already reported" },
        { status: 409 }
      );
    }

    // Insert the report
    await reportsCollection.insertOne({
      videoId,
      siteId,
      visitorId,
      reportType,
      createdAt: new Date(),
    });

    // Update the stats (upsert)
    const updateField = `${reportType}Count`;
    await statsCollection.updateOne(
      { videoId },
      {
        $inc: { [updateField]: 1 },
        $set: { siteId, updatedAt: new Date() },
        $setOnInsert: {
          // Initialize other counts to 0 on insert
          ...(reportType !== "helpful" && { helpfulCount: 0 }),
          ...(reportType !== "wrongInfo" && { wrongInfoCount: 0 }),
          ...(reportType !== "lowQuality" && { lowQualityCount: 0 }),
        },
      },
      { upsert: true }
    );

    // Fetch updated stats
    const stats = await statsCollection.findOne({ videoId });

    return NextResponse.json({
      success: true,
      stats: {
        helpfulCount: stats?.helpfulCount || 0,
        wrongInfoCount: stats?.wrongInfoCount || 0,
        lowQualityCount: stats?.lowQualityCount || 0,
      },
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/video/report - Cancel/remove a video report/feedback
export async function DELETE(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { videoId, visitorId, reportType } = body;

    // Validate required fields
    if (!videoId || !visitorId || !reportType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate report type
    const validTypes: ReportType[] = ["helpful", "wrongInfo", "lowQuality"];
    if (!validTypes.includes(reportType)) {
      return NextResponse.json(
        { success: false, error: "Invalid report type" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const reportsCollection = db.collection("video_reports");
    const statsCollection = db.collection("video_stats");

    // Delete the report
    const deleteResult = await reportsCollection.deleteOne({
      videoId,
      visitorId,
      reportType,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // Decrement the stats
    const updateField = `${reportType}Count`;
    await statsCollection.updateOne(
      { videoId },
      {
        $inc: { [updateField]: -1 },
        $set: { updatedAt: new Date() },
      }
    );

    // Fetch updated stats
    const stats = await statsCollection.findOne({ videoId });

    return NextResponse.json({
      success: true,
      stats: {
        helpfulCount: Math.max(0, stats?.helpfulCount || 0),
        wrongInfoCount: Math.max(0, stats?.wrongInfoCount || 0),
        lowQualityCount: Math.max(0, stats?.lowQualityCount || 0),
      },
    });
  } catch (error) {
    console.error("Error canceling report:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
