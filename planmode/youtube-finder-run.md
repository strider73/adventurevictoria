# Community Video Collection - Full Plan

## Overview
Collect YouTube camping videos for ALL 200 Victoria camping sites (5+ videos each), understand the business value first-hand, then reach out to video creators.

## Current Progress
- **Day 1 (2026-01-24):** 49 sites processed, merged & seeded to MongoDB
- **Total sites with videos:** 64 / 200
- **Sites remaining:** 136
- **Estimated completion:** ~3 more days at 50 sites/day
- **Script tracks "not enough" sites** (< 5 videos) in `data/sites-need-more-videos.json`

## Phase 1: Video Collection (Daily Script) ✅ In Progress
**Goal:** All 200 sites with 5+ videos each. First pass covers all sites once — sites with <5 videos are marked "not enough" and revisited later with different search queries.

### Daily routine:
1. Run script (`--limit 50`)
2. Merge daily file into `community-videos.json`
3. Seed to MongoDB
4. Check `sites-need-more-videos.json` for sites needing a second pass

### After first pass complete:
- Review `sites-need-more-videos.json`
- Re-run with different search queries for those sites
- Goal: every site has 5+ quality videos

## Phase 2: Experience the Product
- Browse all 200 sites on the map with their videos
- Understand the value proposition from a user's perspective
- This is crucial before reaching out to creators

---

## The "Party & Invitation" Strategy

The idea: **Prepare the party first, then send invitations.**

### Prepare the Party (Phases 3 & 4)
Before contacting any creator, everything should already be set up and waiting for them:

**Phase 3: Creator Profile Pages**
- Each channel owner gets their own profile page (like `youtube.adventuretube.net/profile/adventurevictoria`)
- Their videos are already featured on camping site pages
- Data loaded from a new **PostgreSQL `channelOwnerMember` table**
- Profile page is live and ready BEFORE they're contacted
- Engineering details TBD

**Phase 4: "For Creators" Landing Page (The Invitation Card)**
- Private page (not in navigation, accessible by direct link only)
- This is the "invitation card" that explains:
  - **Your personal YouTube intro video** — introduce yourself, explain the project face-to-face
  - What AdventureVictoria is
  - Why they should join
  - How their videos are already featured on camping site pages
  - **A link to their own profile page** (already set up for them)
  - Benefits: extra views, backlinks, exposure to active campers
- When they click through, they see their profile already exists — like a VIP guest arriving at a party prepared for them
- TODO: Record a YouTube intro video before launching outreach
- Engineering details TBD

### Send the Invitation (Phase 5)

**Phase 5: YouTube Comment Outreach**
- Leave a comment on **each video that's featured on the site** (from community-videos.json)
- Same comment on each video, includes a link to the "For Creators" page (the invitation card)
- The page shows them their profile and everything ready for them
- Uses OAuth 2.0 (your Google account)
- Rate limited, tracks which videos have already been commented on
- Engineering details TBD

### The Creator's Journey:
1. They see a comment on their video
2. Click the link → "For Creators" page explains the project
3. Page includes a link to **their own profile** on the platform
4. They see their videos already featured → feels like a VIP invitation
5. They opt-in / engage / contribute more content

---

# Phase 1 Details: YouTube Video Finder - Daily Run Plan

## What's Already Done
- Script exists at `scripts/youtube-finder.py`
- Reads sites from `data/victoria-camping-sites.json` (200 sites)
- Checks existing videos in `data/community-videos.json` (64 sites covered after Day 1)
- Also checks any previous daily output files (`data/community-videos-YYYY-MM-DD.json`)
- Writes new results to a dated file: `data/community-videos-YYYY-MM-DD.json`
- API Key: `AIzaSyDEv4QkQb4cX3zk6aOUD1S10uB1szt_CuY`

## Prerequisites
1. Get a YouTube Data API key from Google Cloud Console (https://console.cloud.google.com/apis/credentials)
   - Enable "YouTube Data API v3" in the project
2. Install Python dependency:
   ```bash
   pip install google-api-python-client
   ```

## Daily Run Steps

### Step 1: Dry run to verify
```bash
cd "/Volumes/Programming HD/AdventureTube/adventurevictoria"
python scripts/youtube-finder.py --api-key YOUR_API_KEY --limit 5 --dry-run
```
This shows which sites will be searched and what videos are found, without writing anything.

### Step 2: Actual run
```bash
python scripts/youtube-finder.py --api-key AIzaSyDEv4QkQb4cX3zk6aOUD1S10uB1szt_CuY --limit 50
```
- `--limit 50` processes 50 sites per run
- Each site uses ~2 API calls (search + stats), with fallback adding 2 more if needed
- YouTube daily quota is 10,000 units; each search costs 100 units
- Safe limit per day: ~50 sites (100 searches max = 10,000 units)

### Step 3: Verify output
Check the generated file:
```bash
cat data/community-videos-$(date +%Y-%m-%d).json | python -m json.tool | head -50
```

### Step 4: Merge into main file
```bash
python3 -c "
import json
with open('data/community-videos.json') as f: main = json.load(f)
with open('data/community-videos-$(date +%Y-%m-%d).json') as f: daily = json.load(f)
existing = set(e['campingSiteId'] for e in main['communityVideos'])
new = [e for e in daily['communityVideos'] if e['campingSiteId'] not in existing]
main['communityVideos'].extend(new)
main['metadata']['totalLocations'] = len(main['communityVideos'])
with open('data/community-videos.json', 'w') as f: json.dump(main, f, indent=2)
print(f'Merged {len(new)} entries. Total: {len(main[\"communityVideos\"])}')
"
```

### Step 5: Seed to MongoDB
```bash
npx tsx scripts/seed-mongodb.ts
```
This updates the live app immediately.

## How It Works
- Script skips sites that already have videos (in main file OR any daily file)
- Running multiple times in same day appends to that day's file
- Running on different days creates new dated files
- ~136 sites still need videos (after Day 1), at 50/day = ~3 more days to cover all

## API Quota Notes
- YouTube Data API free tier: 10,000 units/day
- `search.list` = 100 units per call
- `videos.list` = 1 unit per call
- Each site uses: 100 (search) + 1 (stats) = 101 units minimum
- With fallback: up to 202 units per site
- Safe daily limit: `--limit 50`

## Output Format
Each daily file (`community-videos-YYYY-MM-DD.json`):
```json
{
  "communityVideos": [
    {
      "campingSiteId": "site-id-here",
      "videos": [
        {
          "videoId": "abc123xyz",
          "title": "Video Title",
          "channelName": "Channel Name",
          "source": "youtube",
          "views": 5000
        }
      ]
    }
  ],
  "metadata": {
    "date": "2026-01-25",
    "source": "YouTube Data API",
    "totalLocations": 50
  }
}
```
