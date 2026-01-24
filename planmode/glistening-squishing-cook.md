# YouTube Video Finder Script

## Goal
Create a Python script that uses the YouTube Data API to find relevant camping videos for the ~185 Victoria camping sites that don't currently have community videos, and insert them into MongoDB.

## Data Structures

**victoria_camping_sites:**
```json
{ "id": "wilsons-prom-tidal-river", "title": "Tidal River", "location": "Wilsons Promontory National Park", "lat": -39.04, "lng": 146.33, "category": "National Parks" }
```

**victoria_community_videos:**
```json
{ "campingSiteId": "mt-buffalo-lake-catani", "videos": [{ "videoId": "abc123", "title": "...", "channelName": "...", "source": "youtube", "views": 1234 }] }
```

## Implementation

### File: `scripts/youtube-finder.py`

**Dependencies:** `pymongo`, `google-api-python-client`

**Logic:**
1. Connect to MongoDB (`mongodb://strider:5785Ch00@mongodb.adventuretube.net:27017/adventuretube?authSource=admin`)
2. Query `victoria_camping_sites` for all site IDs
3. Query `victoria_community_videos` to find which sites already have videos
4. For each site without videos (up to 100 per run due to API quota):
   - Search YouTube for: `"{title}" camping {location} victoria australia`
   - Filter results: English, >1000 views preferred, relevant content
   - Take top 3-5 videos per site
   - Insert into `victoria_community_videos` collection
5. Print progress and summary

**Features:**
- `--api-key` argument (required) for YouTube API key
- `--limit` argument to control how many sites to process per run (default: 100)
- `--dry-run` flag to preview searches without inserting
- Progress logging showing which site is being processed
- Skips sites that already have community videos
- Handles API quota exhaustion gracefully

**Search Strategy:**
- Primary search: `"{site title}" camping victoria`
- If few results: fallback to `{site title} {location} camping`
- Filter out shorts (<60s), non-English, very low view count (<100)
- Sort by relevance (YouTube's default)

### Setup
```bash
pip install pymongo google-api-python-client
```

### Usage
```bash
# Dry run first
python scripts/youtube-finder.py --api-key YOUR_KEY --limit 10 --dry-run

# Actual run (100 sites, ~100 API calls = 10,000 quota units)
python scripts/youtube-finder.py --api-key YOUR_KEY --limit 100
```

## Verification
- Run with `--dry-run --limit 5` to see search queries and results without DB writes
- Check MongoDB `victoria_community_videos` collection for new entries
- Verify the app displays the new videos on the map page
