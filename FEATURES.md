# Adventure Victoria - Features & Functions List

> Last Updated: 2026-01-12 (Share Your Video button styling)

## Navigation Menu

| Menu Item | Route | Description |
|-----------|-------|-------------|
| Home | `/` | Main landing page with video carousel |
| Map Playground | `/map` | Interactive map with camping locations |
| About | `/about` | About page |
| Subscribe | External | Links to YouTube channel subscription |

---

## Home Page (`/`)

### Hero Section
- Channel branding and description
- Subscribe button (links to YouTube)

### Video Carousel
- Displays Adventure Victoria YouTube videos
- Auto-advances through videos
- Click to play video

---

## Map Playground (`/map`)

### Header Section
- Page title and description
- Shows total camping spots count (81)

### Filters

#### Video Source Filter
| Filter | Description |
|--------|-------------|
| All (81) | Shows all camping locations |
| Has Video (30) | Shows locations with any video (yours or community) |
| My Videos (24) | Shows only locations with Adventure Victoria videos |

#### Activity Filter
| Filter | Categories Included |
|--------|---------------------|
| All | All categories |
| Camping | National Parks, State Forests, Bush Camping |
| Hiking | Hiking |
| Beach | Great Ocean Road, Water Activities |
| Family | Holiday Parks, Family Holidays |

#### Dynamic Section Heading
- Updates based on filter combination
- Examples: "All Camping Locations", "My Hiking Videos", "Beach Locations with Videos"

### Interactive Map
- Leaflet-based map centered on Victoria
- Custom markers with YouTube thumbnails (original video OR first community video)
- Placeholder markers only for locations without any videos
- Tooltips showing location name on hover (with "Coming Soon" for no-video locations)
- Click marker to open modal

### Map Thumbnail Row
- Horizontal scrollable row of location thumbnails
- Synced with current filter
- Click thumbnail to open modal

### Category Legend
- Color-coded legend for all categories:
  - National Parks (green)
  - State Forests (purple)
  - Great Ocean Road (blue)
  - Hiking (yellow)
  - Holiday Parks (orange)
  - Family Holidays (red)
  - Water Activities (violet)
  - Bush Camping (gray)

### Location Cards Grid
- Responsive grid of location cards
- Shows thumbnail from original video OR first community video
- Category badge, title, location displayed
- NotificationBadge shows community video count
- "Coming Soon" overlay only for locations without any videos
- Play button overlay on cards with videos (original or community)
- Click card to open modal

### Location Modal

#### Video Player
- Plays YouTube video in embedded iframe
- Auto-plays when modal opens (original video OR first community video)
- Shows "Video Coming Soon" placeholder only for locations without any videos
- Automatically starts with first available video (original takes priority)

#### Location Info
- Location title and description
- Category badge (color-coded)
- "Play on YouTube" button (opens in new tab)

#### Request Feature (for Coming Soon locations)
- "Request This Location" button
- Vote count display
- Stores votes in localStorage

#### Community Videos Section
| Feature | Description |
|---------|-------------|
| Video Playlist | Combined list of original + community videos |
| Original Video First | Adventure Victoria video appears first with "ORIGINAL" badge |
| In-Modal Playback | Click any video to play in modal (not redirect to YouTube) |
| Now Playing Indicator | Shows which video is currently playing |
| Recommend Button | Upvote community videos |
| Share Your Video | Styled button with brand background color; Submit YouTube URL to add community video |
| Video Count | Shows number of community videos |

#### NotificationBadge Component
- iOS-style notification badge
- Shows community video count
- Positioned at top-right corner with overlap
- Blur background with shadow
- Only counts community videos (not original)

---

## Footer

### Sections
- **Brand**: Logo, description, social links (YouTube, Instagram)
- **Content**: Latest Videos, Playlists, Community (YouTube links)
- **Categories**: Destination Guides, Gear Reviews, Camp Cooking
- **Connect**: Subscribe, YouTube, Contact Us

### Bottom Bar
- Copyright notice
- Privacy Policy link
- Terms of Service link

---

## Data Sources

| File | Description |
|------|-------------|
| `/data/victoria-camping-sites.json` | 81 camping locations with coordinates |
| `/data/chris-video.json` | Adventure Victoria YouTube videos (24) |
| `/data/community-videos.json` | Pre-loaded community videos (16 locations) |

---

## localStorage Data

| Key | Description |
|-----|-------------|
| `locationVotes` | Vote counts for "Coming Soon" locations |
| `userVotedLocations` | Locations user has voted for |
| `communityVideos` | User-submitted community videos |
| `videoRecommendations` | Recommendation counts for community videos |
| `userRecommendedVideos` | Videos user has recommended |

---

## UI Components (`/components/ui`)

| Component | Description |
|-----------|-------------|
| Button | Multi-variant button (primary, secondary, ghost, danger) |
| Input | Form input with states |
| Card | Content card with header, image, content, footer |
| Badge | Status/category badges |
| Navbar | Responsive navigation bar |
| Footer | Site footer with sections |
| Hero | Landing page hero section |
| Carousel | Image/content slider |
| NotificationBadge | iOS-style count badge |

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with CSS variables (Linear theme)
- **Map**: Leaflet + react-leaflet
- **Deployment**: Vercel
- **Production URL**: https://my-app-phi-eight-27.vercel.app
