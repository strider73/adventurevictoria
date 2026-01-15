# AdventureVictoria iOS App Flow

## Authentication System

### Two-Level Google Login

| Level | Access | Requirements |
|-------|--------|--------------|
| Level 1 | Basic app access | Google Sign-In |
| Level 2 | Full creator access | Google Sign-In + YouTube API Authorization |

---

## Onboarding Screens

### Screen Flow Overview

```
Launching Screen → Initial Screen → [Carousel: 4 slides] → Login/Signup
```

### 1. Launching Screen
- **Figma ID:** `6:2`
- **Purpose:** App splash/intro screen
- **Elements:**
  - AdventureVictoria logo
  - Tagline: "Hot tracks"
  - Subtitle: "All your memories on the map will become lighthouse for next traveller"
  - Background image

### 2. Initial Screen
- **Figma ID:** `234:123`
- **Purpose:** First carousel slide with page indicators
- **Elements:**
  - AdventureVictoria logo
  - "Hot tracks" title
  - Description text
  - 4 dot indicators (first active)
  - Status bar, Home indicator
- **Interaction:** Swipe left to next slide

### 3. Carousel Slide 2 - "Explore Different Stories"
- **Figma ID:** `291:192`
- **Purpose:** Feature highlight - Story exploration
- **Title:** "Explore Different Stories"
- **Description:** "Now you can look at the others' stories and directly point out the place you are interested in. You can quickly move to next one if that is not the one you are looking for"
- **Elements:**
  - Illustration graphic
  - 4 dot indicators (second active)

### 4. Carousel Slide 3 - "Plan Your Adventure"
- **Figma ID:** `293:356`
- **Purpose:** Feature highlight - Activity planning
- **Title:** "Plan Your Adventure"
- **Description:** "There is an indicator symbol that will notify you for the activities you can experience in your destination. You will have much chance to entertain before you get there"
- **Elements:**
  - Illustration graphic
  - 4 dot indicators (third active)

### 5. Carousel Slide 4 - "Share Your Stories"
- **Figma ID:** `297:522`
- **Purpose:** Feature highlight - Content sharing (Final slide with CTA)
- **Title:** "Share Your Stories"
- **Description:** "Publish on our map will promote your story to reach our others not only by Youtube but also your Instagram, GPS tracking, Geocaching and lots of more data we can accept. Your journey will become much more informative than ever before"
- **Elements:**
  - Platform icons (YouTube, Instagram, Google Maps, Geocaching)
  - "Get Start With" button
  - 4 dot indicators (fourth active)
- **Action:** Tap button → Login/Signup screen

### 6. LoginView
- **Figma ID:** `41:61`
- **Purpose:** User login screen
- **Elements:**
  - AdventureVictoria logo
  - Email/Username input field
  - Password input field (with visibility toggle)
  - "Remember me" checkbox
  - "Forgot password?" link
  - Login button
  - Social login options (Google)
  - "Sign up" link

### 7. SignupView
- **Figma ID:** `239:258`
- **Purpose:** New user registration
- **Elements:**
  - AdventureVictoria logo
  - Email input field
  - Password input field (with visibility toggle)
  - Confirm password field
  - "Remember me" checkbox
  - Sign up button
  - Back to login link

### Alternate Screen Variants
- **Launch Screen 2.2** (`213:509`) - Variant of carousel slide 2
- **Launch Screen 3.2** (`213:647`) - Variant of carousel slide 3
- **Launch Screen 4.2** (`213:731`) - Variant of carousel slide 4

---

## Level 1 - Basic User

**Available Features:**
- View Storymap (map with story locations)
- View story details
- Save/bookmark stories (Saved Story tab)
- Access Settings

**Restricted:**
- Cannot create stories
- Cannot access "My Stories" tab
- Cannot upload to YouTube

---

## Level 2 - Creator User

**All Level 1 features, plus:**
- Create and edit stories
- Access "My Stories" tab
- Upload stories to YouTube
- Full chapter editing capabilities

---

## App Navigation (4 Tabs)

### 1. Storymap (Tab 1)
- Map view displaying story locations
- Tap markers to view story previews
- Available to: L1 + L2 users

### 2. My Stories (Tab 2)
- User's created stories
- Create new story button
- Edit existing stories
- Available to: L2 users only

### 3. Saved Story (Tab 3)
- Bookmarked/saved stories from other users
- Quick access to favorite content
- Available to: L1 + L2 users

### 4. Settings (Tab 4)
- User profile management
- App preferences
- Account settings
- Available to: L1 + L2 users

---

## Story Creation Flow (Level 2)

### Chapter Structure
Each chapter contains:
- **GPS Location** - Coordinates of the place
- **Timestamp** - When the chapter was recorded
- **Place Name** - From Google Places API
- **Media** - Photos/videos
- **Description** - User notes

### Creation Steps
1. Tap "+" to create new story
2. Add chapters with location data
3. Edit chapter details
4. Preview story
5. Publish/Upload to YouTube (optional)

---

## Figma Design Pages

| Page | Description |
|------|-------------|
| Onboarding | Login flow, Google auth, YouTube auth |
| Storymap | Map screens, location views |
| My Stories | Story creation, editing, chapter management |
| Saved Story | Bookmarked stories, pop-ups, modals |
| Settings | User profile screens |
| UI Elements | Reusable components, icons, bars |

---

## API Integrations

- **Google Sign-In** - Authentication (L1)
- **YouTube Data API** - Video uploads (L2)
- **Google Places API** - Place name lookup
- **Google Maps SDK** - Map display

---

*Last Updated: January 2026*
