# Adventure Victoria - Features & Functions List

> Last Updated: 2026-01-17 (Website restructure: Map as landing, new profile page, channel page)

## Navigation Menu

| Menu Item | Route | Description |
|-----------|-------|-------------|
| Home | `/` | Interactive map (landing page) - Map Playground |
| Channel | `/channel` | YouTube channel showcase with video carousel |
| My Profile | `/profile/adventurevictoria` | User profile with map + video split view |
| Map - Korea | `/map-korea` | Interactive map with camping locations (Korea) |
| iOS App | `/ios-adventuretube` | iOS app Figma prototype preview |
| Wireframes | `/wireframes` | Wireframe designs for app features |
| About | `/about` | About page |
| Subscribe | External | Links to YouTube channel subscription |

---

## Home Page (`/`) - Map Playground (Landing)

### Hero Section
- Large title: "Adventure Victoria"
- Tagline: "Family Camping Adventures Across Victoria"
- Description about 81 camping spots

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
- Fullscreen toggle button

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
(Same features as previous Map Playground)
- Video Player with auto-play
- Location Info with category badge
- Request Feature for Coming Soon locations
- Community Videos Section with playlist

---

## Channel Page (`/channel`)

### Hero Section
- Channel branding and description
- Subscribe button (links to YouTube)
- "7+ Years Experience" badge

### Video Sections
| Section | Description |
|---------|-------------|
| Channel Introduction | Large featured video embed |
| Popular Adventures | 3-column grid of featured videos |
| Bush Camping Adventures | 3-column grid of more videos |
| Your Complete Camping Guide | 8 category cards with video links |

### Video Categories
| Category | Description |
|----------|-------------|
| National Parks | Victoria's best national parks |
| State Forests | Free bush camping locations |
| Great Ocean Road | Coastal camping adventures |
| Hiking Trails | Best hiking spots |
| Holiday Parks | Family-friendly facilities |
| Bush Cooking | Campfire meals & recipes |
| Family Holidays | Fun for all ages |
| Water Activities | Kayaking, beaches & water fun |

### About Section
- Team introduction
- Statistics (496 subscribers, 44 videos)
- Embedded video

### iOS App Preview Section
- Figma prototype embed
- Feature list: Interactive Map, Video Integration, Community Sharing
- "View Interactive Prototype" CTA

### CTA Section
- "Ready for Your Next Adventure?" call to action
- Subscribe and Visit Channel buttons

---

## Profile Page (`/profile/[username]`)

### Layout
Split-view design based on "Map-First Split View" wireframe

### ProfileHero Component (Compact)
| Element | Description |
|---------|-------------|
| Avatar | 80px circular with gradient (or custom image) |
| Name | Profile name (e.g., "Adventure Victoria") |
| Tagline | Short description |
| Experience Badge | Success badge (e.g., "7+ Years Experience") |
| Subscribe Button | YouTube red button |
| Watch Videos Button | Secondary button |

### Split Container (50/50 Grid)

#### Left Panel - Map
- Header: "Locations Explored" with region filter dropdown
- MapComponent (reuses shared component)
- StatsCard with 3 statistics

#### Right Panel - Videos
- Header: "Videos"
- FilterTabs: Latest, Hiking, Camping, Cooking
- VideoCard grid (scrollable, 500px height)

### Components Used
| Component | Description |
|-----------|-------------|
| ProfileHero | Compact hero with avatar and CTAs |
| StatsCard | 3-column stats display |
| FilterTabs | Horizontal filter tabs |
| VideoCard | Video thumbnail with metadata |

---

## Map - Korea (`/map-korea`)

### Features
Same interactive map features as Home page, but:
- Centered on Korea
- Uses Korea camping/travel data
- Separate localStorage keys for community videos

---

## iOS - AdventureTube (`/ios-adventuretube`)

### Overview
- Preview page for the upcoming AdventureTube iOS app
- Embeds interactive Figma prototype with custom flows sidebar
- Dark theme matching site design (no white Figma UI)

### Page Sections

#### Hero Section
- "iOS App Prototype" badge
- Title: "AdventureTube iOS App"
- Description of the prototype
- Status badges: "Interactive Prototype", "Work in Progress"

#### Flows Links
Simple text links on left side of prototype:
| Flow | Name |
|------|------|
| 1 | Splash Screen |
| 2 | Onboarding |
| 3 | Home Feed |
| 4 | Map View |
| 5 | Video Player |
| 6 | Profile |

#### Figma Embed
| Feature | Description |
|---------|-------------|
| Large Phone Size | 541px wide, 9:16 aspect ratio |
| No Borders | Clean display without white lines |
| No Figma UI | `hide-ui=1` parameter removes white sidebar |
| Dynamic Loading | Changes when flow is selected |
| Shadow Effect | Subtle shadow for depth |

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
| `/data/chris-video.json` | Adventure Victoria YouTube videos (24+) |
| `/data/community-videos.json` | Pre-loaded community videos (16 locations) |
| `/data/korea-travel-video.json` | Korea travel videos |
| `/data/korea-community-videos.json` | Korea community videos |

---

## localStorage Data

| Key | Description |
|-----|-------------|
| `locationVotes` | Vote counts for "Coming Soon" locations |
| `userVotedLocations` | Locations user has voted for |
| `communityVideos` | User-submitted community videos |
| `videoRecommendations` | Recommendation counts for community videos |
| `userRecommendedVideos` | Videos user has recommended |
| `koreaMapCommunityVideos` | Korea map community videos |
| `koreaVideoRecommendations` | Korea video recommendations |
| `koreaUserRecommendedVideos` | Korea recommended videos |

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
| StatsCard | 3-column statistics display |
| FilterTabs | Horizontal filter tab bar |
| VideoCard | Video thumbnail card with metadata |
| ProfileHero | Compact profile hero with avatar |

---

## Map Components (`/components/map`)

| Component | Description |
|-----------|-------------|
| MapComponent | Reusable Leaflet map with markers |

---

## Route Structure

| Route | Content | Status |
|-------|---------|--------|
| `/` | Map Playground (landing) | Active |
| `/channel` | YouTube channel showcase | Active |
| `/profile/[username]` | User profile page | Active |
| `/map-korea` | Korea map playground | Active |
| `/ios-adventuretube` | iOS app prototype | Active |
| `/wireframes` | Wireframe designs | Active |
| `/about` | About page | Active |
| `/map` | Deprecated (moved to `/`) | Removed |

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with CSS variables (Linear theme)
- **Map**: Leaflet + react-leaflet
- **Deployment**: Vercel
- **Production URL**: https://my-app-phi-eight-27.vercel.app
