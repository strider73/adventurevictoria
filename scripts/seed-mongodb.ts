import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

const uri =
  "mongodb://strider:5785Ch00@mongodb.adventuretube.net:27017/adventuretube?authSource=admin";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("adventuretube");

    // Read all JSON files
    const dataDir = resolve(__dirname, "../data");

    const campingSites = JSON.parse(
      readFileSync(resolve(dataDir, "victoria-camping-sites.json"), "utf-8")
    );
    const chrisVideos = JSON.parse(
      readFileSync(resolve(dataDir, "chris-video.json"), "utf-8")
    );
    const koreaTravelVideo = JSON.parse(
      readFileSync(resolve(dataDir, "korea-travel-video.json"), "utf-8")
    );
    const communityVideos = JSON.parse(
      readFileSync(resolve(dataDir, "community-videos.json"), "utf-8")
    );
    const koreaCommunityVideos = JSON.parse(
      readFileSync(resolve(dataDir, "korea-community-videos.json"), "utf-8")
    );

    // Drop existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    for (const name of [
      "victoria_camping_sites",
      "chris_video",
      "korea_videos",
      "korea_channels",
      "victoria_community_videos",
      "korea_community_videos",
      // Also drop old names if they exist
      "victoria_camping_sites",
      "victoria_videos",
    ]) {
      if (collectionNames.includes(name)) {
        await db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      }
    }

    // 1. victoria_camping_sites (200 camping locations)
    await db
      .collection("victoria_camping_sites")
      .insertMany(campingSites.campingSites);
    console.log(
      `Inserted ${campingSites.campingSites.length} docs into victoria_camping_sites`
    );

    // 2. chris_video (Chris's videos for profile page only)
    await db.collection("chris_video").insertMany(chrisVideos.videos);
    console.log(
      `Inserted ${chrisVideos.videos.length} docs into chris_video`
    );

    // 3. korea_videos
    await db
      .collection("korea_videos")
      .insertMany(koreaTravelVideo.videos);
    console.log(
      `Inserted ${koreaTravelVideo.videos.length} docs into korea_videos`
    );

    // 4. korea_channels
    await db
      .collection("korea_channels")
      .insertOne(koreaTravelVideo.channel);
    console.log(`Inserted 1 doc into korea_channels`);

    // 5. victoria_community_videos (ALL videos for the map - single source)
    await db
      .collection("victoria_community_videos")
      .insertMany(communityVideos.communityVideos);
    console.log(
      `Inserted ${communityVideos.communityVideos.length} docs into victoria_community_videos`
    );

    // 6. korea_community_videos
    await db
      .collection("korea_community_videos")
      .insertMany(koreaCommunityVideos.communityVideos);
    console.log(
      `Inserted ${koreaCommunityVideos.communityVideos.length} docs into korea_community_videos`
    );

    // Create indexes
    console.log("\nCreating indexes...");

    await db
      .collection("victoria_camping_sites")
      .createIndex({ id: 1 }, { unique: true });
    await db
      .collection("victoria_camping_sites")
      .createIndex({ category: 1 });

    await db
      .collection("chris_video")
      .createIndex({ id: 1 }, { unique: true });
    await db
      .collection("chris_video")
      .createIndex({ campingSiteId: 1 });

    await db
      .collection("korea_videos")
      .createIndex({ videoId: 1 }, { unique: true });
    await db.collection("korea_videos").createIndex({ category: 1 });

    await db
      .collection("victoria_community_videos")
      .createIndex({ campingSiteId: 1 }, { unique: true });

    await db
      .collection("korea_community_videos")
      .createIndex({ campingSiteId: 1 }, { unique: true });

    console.log("Indexes created successfully");
    console.log("\nSeed completed!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
