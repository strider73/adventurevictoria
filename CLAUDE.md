# Project CLAUDE.md

## Project Overview
A Next.js web application project based on the Linear theme.

## Deployment
- **Production URL:** https://my-app-phi-eight-27.vercel.app
- **Map Page:** https://my-app-phi-eight-27.vercel.app/map

## Important Rules

### 0. Feature Documentation (MANDATORY)
- **Always update `FEATURES.md` when creating new features or functions**
- The `FEATURES.md` file contains a comprehensive list of all features, functions, and capabilities
- After implementing any new feature, filter, component, or functionality, add it to the appropriate section in `FEATURES.md`
- Keep the "Last Updated" date current
- This ensures the project documentation stays in sync with the codebase

### 1. UI Component Usage Rules
- **Always check and use components from `/components/ui` folder first**
- Do not create new components if existing ones can solve the problem
- Always import components from `@/components/ui`

### 2. New Component Creation Rules
- **Always ask the user before creating a new component**
- Create in `/components/ui` folder after approval
- Add export to `components/ui/index.ts` after creation

### 3. Theme & Styling Rules
- **Always follow the Linear theme for colors**
- Use CSS variables: `var(--color-*)` format
- Use Tailwind with CSS variables together

### 4. Playwright Visual Validation (MANDATORY)
- **NEVER run Playwright tools directly in the main conversation**
- **ALWAYS use the Task tool to spawn a sub-agent for all Playwright operations**
- This prevents verbose Playwright output (page snapshots, console logs) from consuming context

**Required pattern:**
```
Task tool with:
  - subagent_type: "general-purpose"
  - prompt: "Navigate to [URL], [actions], take screenshot, verify [what to check]. Report findings concisely."
```

**Example:**
```
Task(
  subagent_type="general-purpose",
  prompt="Navigate to http://localhost:3000, scroll to iOS section, take screenshot. Verify the prototype displays correctly. Report concisely."
)
```

**Why:** Playwright outputs large page snapshots and console logs that rapidly consume conversation context. Sub-agents run in separate context and return only a brief summary.

---

## Theme (Linear Theme)

### Colors
```
Primary Brand:     --color-brand: #5e6ad2
Brand Hover:       --color-brand-hover: #828fff
Brand Tint:        --color-brand-tint: #18182f

Background:
  Primary:         --color-bg-primary: #08090a
  Secondary:       --color-bg-secondary: #1c1c1f
  Tertiary:        --color-bg-tertiary: #232326

Text:
  Primary:         --color-text-primary: #f7f8f8
  Secondary:       --color-text-secondary: #d0d6e0
  Tertiary:        --color-text-tertiary: #8a8f98

Border:
  Primary:         --color-border-primary: #23252a
  Secondary:       --color-border-secondary: #34343a

Accent:
  Accent:          --color-accent: #7170ff
  Accent Hover:    --color-accent-hover: #828fff

Semantic:
  Red:             --color-red: #eb5757
  Orange:          --color-orange: #fc7840
  Yellow:          --color-yellow: #f2c94c
  Green:           --color-green: #4cb782
  Blue:            --color-blue: #4ea7fc
```

### Border Radius
```
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px
--radius-xl: 10px
--radius-full: 9999px
```

### Shadows
```
--shadow-low: 0px 2px 4px rgba(0, 0, 0, 0.1)
--shadow-medium: 0px 4px 24px rgba(0, 0, 0, 0.2)
--shadow-high: 0px 7px 32px rgba(0, 0, 0, 0.35)
```

---

## Component Library

Import all components from `@/components/ui`:
```tsx
import { Button, Input, Card, Badge, Navbar, Footer, Hero, Carousel } from "@/components/ui";
```

### Button
A button component supporting various variants and sizes.

```tsx
import { Button } from "@/components/ui";

// Variants: primary | secondary | ghost | danger
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes: sm | md | lg
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>

// With Icons
<Button leftIcon={<IconComponent />}>With Left Icon</Button>
<Button rightIcon={<IconComponent />}>With Right Icon</Button>

// Full Width
<Button fullWidth>Full Width Button</Button>
```

### Input
A text input component for form entries.

```tsx
import { Input } from "@/components/ui";

// Basic
<Input placeholder="Enter text..." />

// With Label & Helper Text
<Input
  label="Email"
  placeholder="Enter email..."
  helperText="We'll never share your email"
/>

// States: default | error | success
<Input state="error" errorMessage="Invalid email" />
<Input state="success" />
<Input disabled />

// Sizes: sm | md | lg
<Input size="sm" />
<Input size="md" />
<Input size="lg" />

// With Icons
<Input leftIcon={<SearchIcon />} placeholder="Search..." />
<Input rightIcon={<MailIcon />} placeholder="Email" />

// Full Width
<Input fullWidth />
```

### Card
A card component for grouping content.

```tsx
import { Card, CardHeader, CardImage, CardContent, CardFooter } from "@/components/ui";

// Variants: default | elevated | outlined
<Card variant="default">
  <CardHeader title="Title" subtitle="Subtitle" />
  <CardContent>Content here</CardContent>
</Card>

// With Image
<Card padding="none" hoverable>
  <CardImage
    src="/image.jpg"
    alt="Description"
    aspectRatio="video" // video | square | wide
  />
  <div className="p-4">
    <CardHeader title="Title" action={<Badge>New</Badge>} />
    <CardContent>Description</CardContent>
    <CardFooter>
      <Button size="sm">Action</Button>
    </CardFooter>
  </div>
</Card>

// Padding: none | sm | md | lg
<Card padding="lg">Large padding</Card>

// Hoverable
<Card hoverable>Hover effect enabled</Card>
```

### Badge
A badge component for displaying status or categories.

```tsx
import { Badge } from "@/components/ui";

// Variants: success | warning | error | info | default
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="default">Default</Badge>

// With Dot
<Badge variant="success" dot>Active</Badge>

// With Icon
<Badge variant="success" icon={<CheckIcon />}>Completed</Badge>

// Sizes: sm | md
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

### Navbar
A responsive navigation bar component.

```tsx
import { Navbar } from "@/components/ui";

const links = [
  { label: "Home", href: "/", isActive: true },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

<Navbar
  logo={<LogoComponent />}  // Optional custom logo
  logoText="Brand Name"
  links={links}
  ctaButton={<Button size="sm">Sign Up</Button>}
  sticky={true}             // Sticky positioning
  transparent={false}       // Transparent background
/>
```

### Footer
A website footer component.

```tsx
import { Footer, SocialIcons } from "@/components/ui";

const sections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  // ... more sections
];

const socialLinks = [
  { name: "Twitter", href: "#", icon: SocialIcons.Twitter },
  { name: "GitHub", href: "#", icon: SocialIcons.GitHub },
  { name: "LinkedIn", href: "#", icon: SocialIcons.LinkedIn },
  { name: "YouTube", href: "#", icon: SocialIcons.YouTube },
  { name: "Instagram", href: "#", icon: SocialIcons.Instagram },
];

<Footer
  logoText="Company"
  description="Company description here"
  sections={sections}
  socialLinks={socialLinks}
  copyright="© 2026 Company. All rights reserved."
  bottomLinks={[
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]}
/>
```

### Hero
A hero section component for landing pages.

```tsx
import { Hero, HeroGradientText } from "@/components/ui";

// Centered (default)
<Hero
  badge={<Badge variant="info" dot>New</Badge>}
  title={<>Build with <HeroGradientText>speed</HeroGradientText></>}
  description="Your product description here"
  primaryAction={<Button size="lg">Get Started</Button>}
  secondaryAction={<Button size="lg" variant="secondary">Learn More</Button>}
  showGradient={true}
/>

// Split Layout (with image)
<Hero
  variant="split"
  title="Your Title"
  description="Description"
  primaryAction={<Button>CTA</Button>}
  image={<img src="/hero.jpg" alt="Hero" />}
/>

// Variants: centered | default | split
// Sizes: sm | md | lg
<Hero variant="centered" size="lg" />

// Custom Gradient Colors
<Hero
  gradientColors={{
    from: "#5e6ad2",
    via: "#7170ff",
    to: "transparent",
  }}
/>
```

### Carousel
An image/content slider component.

```tsx
import { Carousel, CarouselSlide } from "@/components/ui";

<Carousel
  autoPlay={true}
  autoPlayInterval={5000}  // ms
  showDots={true}
  showArrows={true}
  loop={true}
>
  <CarouselSlide
    image="/slide1.jpg"
    alt="Slide 1"
    overlay={true}  // Dark gradient overlay
  >
    <div className="text-white">
      <h3>Slide Title</h3>
      <p>Slide description</p>
    </div>
  </CarouselSlide>

  <CarouselSlide image="/slide2.jpg" alt="Slide 2" />

  {/* Custom content slide */}
  <div className="p-8 bg-[--color-bg-secondary]">
    Custom content here
  </div>
</Carousel>
```

---

## File Structure

```
my-app/
├── app/
│   ├── globals.css          # Global styles & CSS variables
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── components/
│       └── page.tsx         # Component demo page
├── components/
│   └── ui/
│       ├── index.ts         # Central exports
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       └── Carousel.tsx
├── lib/
│   └── theme.ts             # Theme configuration
└── CLAUDE.md                # This file
```

---

## Demo Page

View component demos at: http://localhost:3000/components

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
