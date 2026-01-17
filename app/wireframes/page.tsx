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

// All wireframe sections
const wireframeSections = [
  {
    id: "location-detail",
    title: "Location Detail",
    description: "Camping location detail pages showing videos, reviews, and information about camping spots.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    optionsCount: 3,
    status: "complete" as const,
    href: "/wireframes/location-detail",
  },
  {
    id: "user-profile",
    title: "User Profile",
    description: "User profile pages showing personal info, saved locations, uploaded videos, and activity history.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    optionsCount: 3,
    status: "complete" as const,
    href: "/wireframes/user-profile",
  },
  {
    id: "video-player",
    title: "Video Player",
    description: "Full video viewing experience with comments, related videos, and location information.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    optionsCount: 0,
    status: "planned" as const,
    href: "/wireframes/video-player",
  },
  {
    id: "search-results",
    title: "Search & Filters",
    description: "Search results and filtering interface for discovering camping locations and videos.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    optionsCount: 0,
    status: "planned" as const,
    href: "/wireframes/search-results",
  },
  {
    id: "home-feed",
    title: "Home Feed",
    description: "Main landing page with personalized content, featured locations, and recent activity.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    optionsCount: 0,
    status: "planned" as const,
    href: "/wireframes/home-feed",
  },
];

const statusConfig = {
  complete: { label: "Complete", variant: "success" as const, color: "text-[--color-green]" },
  "in-progress": { label: "In Progress", variant: "warning" as const, color: "text-[--color-orange]" },
  planned: { label: "Planned", variant: "default" as const, color: "text-[--color-text-tertiary]" },
};

export default function WireframesPage() {
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
          <Badge variant="info" className="mb-4">Design Phase</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-4">
            Wireframes
          </h1>
          <p className="text-[--color-text-secondary] max-w-2xl mx-auto text-lg">
            Explore wireframe options for different sections of the AdventureTube app.
            Each section has multiple layout variations to choose from.
          </p>
        </div>
      </section>

      {/* Wireframe Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {wireframeSections.map((section) => {
              const status = statusConfig[section.status];
              const isClickable = section.status !== "planned";

              return (
                <Link
                  key={section.id}
                  href={isClickable ? section.href : "#"}
                  className={`block ${!isClickable ? "pointer-events-none" : ""}`}
                >
                  <Card
                    variant="elevated"
                    padding="none"
                    className={`overflow-hidden transition-all duration-300 ${
                      isClickable
                        ? "hover:shadow-xl hover:border-[--color-brand] cursor-pointer"
                        : "opacity-60"
                    }`}
                  >
                    <div className="p-6 flex items-center gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        section.status === "complete"
                          ? "bg-[--color-green]/10 text-[--color-green]"
                          : "bg-[--color-bg-tertiary] text-[--color-text-tertiary]"
                      }`}>
                        {section.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-[--color-text-primary]">
                            {section.title}
                          </h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-[--color-text-secondary] text-sm">
                          {section.description}
                        </p>
                        {section.optionsCount > 0 && (
                          <p className="text-[--color-text-tertiary] text-xs mt-2">
                            {section.optionsCount} layout options available
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      {isClickable && (
                        <div className="flex-shrink-0 text-[--color-text-tertiary]">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[--color-green]"></div>
              <span className="text-[--color-text-secondary]">Complete - Ready for review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[--color-orange]"></div>
              <span className="text-[--color-text-secondary]">In Progress - Being designed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[--color-text-tertiary]"></div>
              <span className="text-[--color-text-secondary]">Planned - Coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/">
            <Button variant="secondary" size="lg">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
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
