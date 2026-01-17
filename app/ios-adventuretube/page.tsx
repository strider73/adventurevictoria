"use client";

import { useState } from "react";
import { Button, Badge, Navbar, Footer, SocialIcons } from "@/components/ui";

// Flow definitions with Figma node IDs
const flows = [
  { id: 1, name: "Splash Screen", nodeId: "6-2", description: "App launch screen" },
  { id: 2, name: "Onboarding", nodeId: "234-123", description: "Welcome slides" },
  { id: 3, name: "Home Feed", nodeId: "234-456", description: "Main content feed" },
  { id: 4, name: "Map View", nodeId: "234-789", description: "Explore locations" },
  { id: 5, name: "Video Player", nodeId: "234-1012", description: "Watch adventures" },
  { id: 6, name: "Profile", nodeId: "234-1315", description: "User profile" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Channel", href: "/channel" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "iOS App", href: "/ios-adventuretube", isActive: true },
  { label: "Wireframes", href: "/wireframes" },
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

export default function iOSAdventuretubePage() {
  const [selectedFlow, setSelectedFlow] = useState(flows[0]);

  // Generate Figma embed URL based on selected flow
  const getFigmaEmbedUrl = (nodeId: string) => {
    return `https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FRZCJw60n7wgWTN4jMYfkoy%2FAdventureVictoria%3Fpage-id%3D0%253A1%26node-id%3D${nodeId}%26p%3Df%26m%3Ddev%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D${nodeId}%26hide-ui%3D1`;
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] flex flex-col">
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

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[--color-bg-secondary] to-[--color-bg-primary]">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="info" className="mb-4">iOS App Prototype</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[--color-text-primary] mb-4">
            AdventureTube iOS App
          </h1>
          <p className="text-[--color-text-secondary] text-lg max-w-2xl mx-auto mb-6">
            Preview the upcoming iOS app design. Click and interact with the prototype below to explore the user experience.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="success" dot>Interactive Prototype</Badge>
            <Badge variant="warning">Work in Progress</Badge>
          </div>
        </div>
      </section>

      {/* Figma Prototype Embed with Flows Sidebar */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8 items-start justify-center">
            {/* Flows Sidebar - Simple links */}
            <div className="hidden sm:block">
              <h3 className="text-[--color-text-secondary] text-xs font-semibold uppercase tracking-wider mb-3">
                Flows
              </h3>
              <div className="space-y-2">
                {flows.map((flow) => (
                  <button
                    key={flow.id}
                    onClick={() => setSelectedFlow(flow)}
                    className={`block text-left text-sm transition-all ${
                      selectedFlow.id === flow.id
                        ? "text-[--color-brand] font-medium"
                        : "text-[--color-text-tertiary] hover:text-[--color-text-primary]"
                    }`}
                  >
                    {flow.id}. {flow.name}
                  </button>
                ))}
              </div>
              <a
                href="https://www.figma.com/proto/RZCJw60n7wgWTN4jMYfkoy/AdventureVictoria?page-id=0%3A1&node-id=6-2&p=f&m=dev&scaling=scale-down&content-scaling=fixed&starting-point-node-id=6%3A2"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 text-[--color-brand] hover:text-[--color-brand-hover] text-sm font-medium flex items-center gap-1"
              >
                Open in Figma
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Figma Embed - Phone sized */}
            <div className="w-[473px] sm:w-[541px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                key={selectedFlow.nodeId}
                src={getFigmaEmbedUrl(selectedFlow.nodeId)}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[--color-bg-secondary] rounded-xl border border-[--color-border-primary]">
              <div className="w-10 h-10 rounded-lg bg-[--color-brand]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-[--color-text-primary] font-semibold mb-1">Click to Navigate</h3>
              <p className="text-[--color-text-tertiary] text-sm">
                Click on buttons and elements to navigate through the app screens.
              </p>
            </div>
            <div className="p-4 bg-[--color-bg-secondary] rounded-xl border border-[--color-border-primary]">
              <div className="w-10 h-10 rounded-lg bg-[--color-green]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[--color-green]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-[--color-text-primary] font-semibold mb-1">Fullscreen Mode</h3>
              <p className="text-[--color-text-tertiary] text-sm">
                Click the expand icon in Figma for a better viewing experience.
              </p>
            </div>
            <div className="p-4 bg-[--color-bg-secondary] rounded-xl border border-[--color-border-primary]">
              <div className="w-10 h-10 rounded-lg bg-[--color-orange]/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[--color-orange]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-[--color-text-primary] font-semibold mb-1">Send Feedback</h3>
              <p className="text-[--color-text-tertiary] text-sm">
                Have suggestions? Let us know what you think about the design!
              </p>
            </div>
          </div>
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
