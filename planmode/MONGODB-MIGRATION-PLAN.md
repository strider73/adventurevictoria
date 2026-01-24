# MongoDB Migration Plan - AdventureVictoria Map Data

## Overview
Migrate all 5 static JSON data files to MongoDB at `mongodb.adventuretube.net` (database: `adventuretube`), create Next.js API routes, and update pages to fetch from API instead of static imports.

## Implementation Steps

### Step 1: Install MongoDB MCP Server
Install the official MongoDB MCP server for Claude Code to enable direct database interaction during development.

**Add to `.mcp.json` (project MCP servers):**
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    },
    "figma": {
      "type": "http",
      "url": "http://localhost:38450/mcp"
    },
    "mongodb": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mongodb-mcp-server@latest"],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://strider:5785Ch00@mongodb.adventuretube.net:27017/adventuretube?authSource=admin"
      }
    }
  }
}
```

**Add `"mongodb"` to `enabledMcpjsonServers` in `.claude/settings.local.json`:**
```json
{
  "permissions": {
    "allow": [...]
  },
  "plansDirectory": "planmode",
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": [
    "playwright",
    "mongodb"
  ]
}
```

This enables Claude Code to:
- Query collections directly to verify seeded data
- Inspect schemas and indexes
- Validate data relationships
- Debug API route issues by checking database state

### Step 2: Install Project Dependencies
```bash
npm install mongodb
npm install -D tsx
```

### Step 3: Create `.env.local`
```env
MONGODB_URI=mongodb://strider:5785Ch00@mongodb.adventuretube.net:27017/adventuretube?authSource=admin
```

### Step 4: Create MongoDB Connection Utility
**File:** `lib/mongodb.ts`
- Singleton connection pattern for Next.js (handles HMR in dev)
- Exports `getDatabase()` helper

### Step 5: Create Seed Script
**File:** `scripts/seed-mongodb.ts`
- Reads all 5 JSON files from `/data/`
- Inserts into MongoDB collections:
  - `victoria_camping_sites` (81 docs)
  - `victoria_videos`
  - `korea_videos`
  - `korea_channels` (1 doc)
  - `victoria_community_videos`
  - `korea_community_videos`
- Creates indexes for efficient querying
- Add `"seed": "npx tsx scripts/seed-mongodb.ts"` to package.json

### Step 6: Create API Routes (5 routes)
| Route | Collection | Response |
|-------|-----------|----------|
| `app/api/victoria/camping-sites/route.ts` | victoria_camping_sites | `{ campingSites }` |
| `app/api/victoria/videos/route.ts` | victoria_videos | `{ videos }` |
| `app/api/victoria/community-videos/route.ts` | victoria_community_videos | `{ communityVideos }` |
| `app/api/korea/videos/route.ts` | korea_videos + korea_channels | `{ channel, videos }` |
| `app/api/korea/community-videos/route.ts` | korea_community_videos | `{ communityVideos }` |

### Step 7: Update `app/page.tsx`
- Remove static imports of 3 JSON files
- Add `useState` + `useEffect` to fetch from API routes
- Move data processing logic inside `useEffect`
- Add loading state while data is fetching

### Step 8: Update `app/map-korea/page.tsx`
- Remove static imports of 2 JSON files
- Add `useState` + `useEffect` to fetch from API routes
- Move data processing logic inside `useEffect`
- Add loading state while data is fetching

### Step 9: Keep JSON files as backup
- Don't delete `/data/` files (they serve as backup/reference)
- Just remove the static imports from pages

## MongoDB Collections

| Collection | Source File | Documents | Key Fields |
|---|---|---|---|
| `victoria_camping_sites` | victoria-camping-sites.json | 81 | id, title, lat, lng, category |
| `victoria_videos` | chris-video.json | ~25 | id, videoId, campingSiteId |
| `korea_videos` | korea-travel-video.json | ~84 | videoId, lat, lng, category |
| `korea_channels` | korea-travel-video.json (channel) | 1 | name, handle, url |
| `victoria_community_videos` | community-videos.json | varies | campingSiteId, videos[] |
| `korea_community_videos` | korea-community-videos.json | varies | campingSiteId, locationName, videos[] |

## Indexes
- `victoria_camping_sites.id` (unique)
- `victoria_camping_sites.category`
- `victoria_videos.campingSiteId`
- `victoria_videos.id` (unique)
- `korea_videos.videoId` (unique)
- `korea_videos.category`
- `victoria_community_videos.campingSiteId` (unique)
- `korea_community_videos.campingSiteId` (unique)

## Files to Create
- `lib/mongodb.ts`
- `scripts/seed-mongodb.ts`
- `.env.local`
- `app/api/victoria/camping-sites/route.ts`
- `app/api/victoria/videos/route.ts`
- `app/api/victoria/community-videos/route.ts`
- `app/api/korea/videos/route.ts`
- `app/api/korea/community-videos/route.ts`

## Files to Modify
- `.mcp.json` - Add MongoDB MCP server
- `.claude/settings.local.json` - Add `"mongodb"` to `enabledMcpjsonServers`
- `app/page.tsx` - Remove static imports, add API fetching
- `app/map-korea/page.tsx` - Remove static imports, add API fetching
- `package.json` - Add seed script

## Data Relationships
```
Victoria:
  victoria_camping_sites (id) → victoria_videos (campingSiteId) → victoria_community_videos (campingSiteId)

Korea:
  korea_videos (videoId) → korea_community_videos (campingSiteId references videoId)
```

## Verification
1. Run `npm run seed` to populate MongoDB
2. Run `npm run dev` to start the dev server
3. Test API routes: `curl http://localhost:3000/api/victoria/camping-sites`
4. Verify Victoria map loads correctly at `http://localhost:3000`
5. Verify Korea map loads correctly at `http://localhost:3000/map-korea`
6. Verify community videos still load and user submissions still work via localStorage
