import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Adventure site from MongoDB
interface AdventureSite {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  originalVideoId?: string;
}

// Community video entry from MongoDB
interface CommunityVideoEntry {
  campingSiteId: string;
  videos: Array<{
    videoId: string;
    title: string;
    channelName: string;
    views?: number;
    isOriginal?: boolean;
  }>;
}

export async function GET() {
  try {
    const db = await getDatabase();

    // Fetch adventure sites and community videos
    const [sites, communityVideosData] = await Promise.all([
      db.collection("korea_adventure_sites").find({}).toArray(),
      db.collection("korea_community_videos").find({}).toArray(),
    ]);

    // Create a map of site ID to community videos
    const communityMap = new Map<string, CommunityVideoEntry>();
    (communityVideosData as unknown as CommunityVideoEntry[]).forEach((entry) => {
      communityMap.set(entry.campingSiteId, entry);
    });

    // Convert sites to video-like format for backward compatibility with the map
    const videos = (sites as unknown as AdventureSite[]).map((site) => {
      const communityEntry = communityMap.get(site.id);
      // Get the first video (original or community) for display
      const firstVideo = communityEntry?.videos?.[0];

      return {
        videoId: firstVideo?.videoId || site.originalVideoId || site.id,
        title: site.title,
        duration: "",
        views: firstVideo?.views || 0,
        uploadedAgo: "",
        location: `${site.title}, ${site.location}`,
        category: site.category,
        lat: site.lat,
        lng: site.lng,
        // Additional fields for site-based display
        siteId: site.id,
        description: site.description,
        communityVideoCount: communityEntry?.videos?.length || 0,
      };
    });

    // Channel info for OutboundScape
    const channel = {
      name: "OutboundScape",
      description: "Korea Adventure Travel",
    };

    return NextResponse.json({ channel, videos });
  } catch (error) {
    console.error("Failed to fetch Korea videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch Korea videos" },
      { status: 500 }
    );
  }
}
