# Korea Adventure Video Collection Plan

## Overview
Collect YouTube adventure videos for Korean sites (hiking, camping, fishing, national parks), similar to what we did for Victoria camping sites.

## Current Status
- **Sites data created:** `data/korea-adventure-sites.json`
- **Total sites:** 107
- **Community videos:** Not yet collected

### Sites by Category
| Category | Count |
|----------|-------|
| Mountain | 33 |
| Nature | 12 |
| National Park | 12 |
| Fishing | 9 |
| Valley | 8 |
| Beach | 7 |
| Camping | 6 |
| Urban | 6 |
| Temple | 4 |
| Cultural | 3 |
| Garden | 2 |
| Glamping | 2 |
| Trail | 1 |
| Scenic Drive | 1 |
| Waterfall | 1 |
| **Total** | **107** |

### Data Sources
- **72 sites** from OutboundScape video locations (already have your videos)
- **35 sites** added from research (national parks, camping, fishing spots)

## Phase 1: Video Collection

### Option A: Adapt Victoria script for Korea
Modify `scripts/youtube-finder.py` to work with Korea data:
- Read from `korea-adventure-sites.json`
- Write to `korea-community-videos.json`
- Use Korean search queries (site name + 캠핑/등산/낚시)

### Option B: Create new Korea-specific script
Create `scripts/korea-video-finder.py` with:
- Korean language support
- Category-specific search queries
- Different search strategies per category

### Search Query Strategies
| Category | Primary Query | Fallback Query |
|----------|---------------|----------------|
| Mountain | "{title} 등산" | "{location} 하이킹" |
| Camping | "{title} 캠핑" | "{location} 야영장" |
| Fishing | "{title} 낚시" | "{location} 낚시터" |
| Valley | "{title} 계곡" | "{location} 물놀이" |
| National Park | "{title} 국립공원" | "{title} hiking" |
| Beach | "{title} 해변" | "{location} 바다" |

## Phase 2: Seed to Database
- Create new MongoDB collection for Korea sites
- Update seed script to include Korea data

## Phase 3: Update Korea Map
- Ensure map reads from new data structure
- Display community videos alongside OutboundScape videos

## Next Steps
1. [ ] Create Korea video finder script
2. [ ] Run first batch (50 sites)
3. [ ] Review results and adjust search queries
4. [ ] Complete all 107 sites
5. [ ] Seed to MongoDB
6. [ ] Test on live map

## Notes
- YouTube API quota: Same 10,000 units/day limit
- Korean searches may need different filtering (check video language/region)
- Some sites already have OutboundScape videos (72 sites) - community videos supplement these
