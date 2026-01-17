"use client";

import { Button, Badge, Card, Navbar, Footer, SocialIcons } from "@/components/ui";
import Link from "next/link";

// Navigation links for the site
const navLinks = [
  { label: "Map - Victoria", href: "/" },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes", isActive: true },
  { label: "About", href: "/about" },
];

const footerSections = [
  {
    title: "Content",
    links: [
      { label: "Latest Videos", href: "https://www.youtube.com/@Adventurevictoria/videos" },
      { label: "Playlists", href: "https://www.youtube.com/@Adventurevictoria/playlists" },
      { label: "Community", href: "https://www.youtube.com/@Adventurevictoria/community" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Destination Guides", href: "#" },
      { label: "Gear Reviews", href: "#" },
      { label: "Camp Cooking", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Subscribe", href: "https://www.youtube.com/@Adventurevictoria?sub_confirmation=1" },
      { label: "YouTube", href: "https://www.youtube.com/@Adventurevictoria" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
];

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/@Adventurevictoria", icon: SocialIcons.YouTube },
  { name: "Instagram", href: "#", icon: SocialIcons.Instagram },
];

// Tent/Camping Logo Component
const CampingLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 22l5-10 5 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const wireframeOptions = [
  {
    id: 1,
    title: "Classic Location Detail",
    description: "Traditional two-column layout with hero image, location info, video grid, community videos, and reviews section.",
    file: "location-detail/classic-location-detail.html",
    preview: "/wireframes/location-detail/classic-location-detail-preview.png",
    features: [
      "Hero image banner",
      "Two-column layout (info + sidebar)",
      "Stats, description, features",
      "Video grid sections",
      "Reviews with ratings",
    ],
    newComponents: ["InfoCard", "ReviewCard"],
    badge: "Classic",
    badgeVariant: "info" as const,
  },
  {
    id: 2,
    title: "Immersive Story-Driven",
    description: "Narrative-focused design with timeline-based storytelling showing day-by-day adventure experience.",
    file: "location-detail/immersive-story-driven.html",
    preview: "/wireframes/location-detail/immersive-story-driven-preview.png",
    features: [
      "Full-width hero with overlay",
      "Tab navigation",
      "Timeline storytelling",
      "Community highlights",
      "Sticky sidebar with actions",
    ],
    newComponents: ["StoryTimeline", "CommunityHighlight", "ActionCard"],
    badge: "Storytelling",
    badgeVariant: "success" as const,
  },
  {
    id: 3,
    title: "Interactive Social Hub",
    description: "Social media-style three-column layout with activity feeds, trending content, and community engagement.",
    file: "location-detail/interactive-social-hub.html",
    preview: "/wireframes/location-detail/interactive-social-hub-preview.png",
    features: [
      "Split hero (image + stats)",
      "Three-column layout",
      "Social feed with filters",
      "Trending & activity sidebar",
      "Members online section",
    ],
    newComponents: ["SocialFeedItem"],
    badge: "Social",
    badgeVariant: "warning" as const,
  },
];

export default function LocationDetailWireframesPage() {
  const openWireframe = (file: string) => {
    window.open(`/wireframes/${file}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      {/* Navbar */}
      <Navbar
        logo={
          <div className="w-10 h-10 rounded-[--radius-lg] bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center text-white">
            <CampingLogo />
          </div>
        }
        logoText="Adventure Victoria"
        links={navLinks}
        ctaButton={
          <a
            href="https://www.youtube.com/@Adventurevictoria?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-[#FF0000] hover:bg-[#CC0000]">
              Subscribe
            </Button>
          </a>
        }
        sticky
      />

      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/wireframes" className="inline-flex items-center gap-2 text-[--color-text-tertiary] hover:text-[--color-text-secondary] mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Wireframes
          </Link>
          <Badge variant="success" className="mb-4">Complete</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-4">
            Location Detail Wireframes
          </h1>
          <p className="text-[--color-text-secondary] max-w-2xl mx-auto text-lg">
            Explore three different layout options for the camping location detail page.
            Each wireframe shows how users can discover videos, reviews, and information about camping spots.
          </p>
        </div>
      </section>

      {/* Wireframe Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {wireframeOptions.map((option) => (
              <Card
                key={option.id}
                variant="elevated"
                padding="none"
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Preview Area */}
                <div
                  className="h-64 bg-[--color-bg-tertiary] border-b border-[--color-border-primary] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden relative group"
                  onClick={() => openWireframe(option.file)}
                >
                  <img
                    src={option.preview}
                    alt={`${option.title} preview`}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[--color-brand] text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Click to view
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={option.badgeVariant}>{option.badge}</Badge>
                    <span className="text-[--color-text-tertiary] text-sm">Option {option.id}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
                    {option.title}
                  </h3>
                  <p className="text-[--color-text-secondary] text-sm mb-4">
                    {option.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[--color-text-tertiary] uppercase tracking-wider mb-2">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-[--color-text-secondary] flex items-center gap-2">
                          <svg className="w-4 h-4 text-[--color-green] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* New Components */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-[--color-text-tertiary] uppercase tracking-wider mb-2">
                      New Components Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {option.newComponents.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-[--color-orange]/10 text-[--color-orange] rounded-md"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => openWireframe(option.file)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Wireframe
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Components Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Existing Components</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[--color-text-primary] mb-4">
              Reusable UI Components
            </h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              All three wireframes reuse these existing components from the design system
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {["Navbar", "Footer", "Button", "Badge", "Card"].map((component) => (
              <div
                key={component}
                className="px-4 py-2 bg-[--color-green]/10 text-[--color-green] rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {component}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Wireframes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/wireframes">
            <Button variant="secondary" size="lg">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Wireframes
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer
        logo={
          <div className="w-10 h-10 rounded-[--radius-lg] bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center text-white">
            <CampingLogo />
          </div>
        }
        logoText="Adventure Victoria"
        description="Family camping adventures in Victoria, Australia. Inspiring families to explore the great outdoors together."
        sections={footerSections}
        socialLinks={socialLinks}
        copyright="© 2026 Adventure Victoria. All rights reserved."
        bottomLinks={[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ]}
      />
    </div>
  );
}
