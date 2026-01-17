"use client";

import { useState } from "react";
import { Button, Badge, Navbar, Footer, SocialIcons } from "@/components/ui";
import Link from "next/link";

// Navigation links for the site
const navLinks = [
  { label: "Map - Victoria", href: "/" },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes", isActive: true },
  { label: "About AdventureTube", href: "/about" },
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

// Layout Option A: Hero + Features Grid + How It Works
const LayoutOptionA = () => (
  <div className="space-y-16">
    {/* Hero Section */}
    <section className="text-center py-16 px-4">
      <Badge variant="info" className="mb-4">About the Platform</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-6">
        Map Your Journey,<br />
        <span className="bg-gradient-to-r from-[#4cb782] via-[#4ea7fc] to-[#5e6ad2] bg-clip-text text-transparent">
          Engage Your Audience
        </span>
      </h1>
      <p className="text-xl text-[--color-text-secondary] max-w-3xl mx-auto mb-8">
        AdventureTube bridges YouTube travel content with geographical exploration.
        Map your journey-based stories directly onto specific locations.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg">Try the iOS App</Button>
        <Button size="lg" variant="secondary">Watch Demo</Button>
      </div>
    </section>

    {/* Features Grid */}
    <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4">Benefits</Badge>
          <h2 className="text-3xl font-bold text-[--color-text-primary]">For Creators & Consumers</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Creators */}
          <div className="p-8 bg-[--color-bg-tertiary] rounded-2xl border border-[--color-border-primary]">
            <div className="w-14 h-14 rounded-xl bg-[--color-brand]/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-3">For Creators</h3>
            <ul className="space-y-3 text-[--color-text-secondary]">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enhanced content visibility through location mapping
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reach targeted audience interested in specific places
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Improved engagement with chapter-based navigation
              </li>
            </ul>
          </div>
          {/* For Consumers */}
          <div className="p-8 bg-[--color-bg-tertiary] rounded-2xl border border-[--color-border-primary]">
            <div className="w-14 h-14 rounded-xl bg-[--color-green]/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-[--color-green]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-3">For Consumers</h3>
            <ul className="space-y-3 text-[--color-text-secondary]">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Discover travel content directly on a map
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Find stories relevant to your destination
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Navigate multi-location trips with ease
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="warning" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold text-[--color-text-primary]">Simple 3-Step Process</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Import Videos", desc: "Connect your YouTube channel and import your travel videos" },
            { step: "2", title: "Create Chapters", desc: "Segment videos into chapters based on locations visited" },
            { step: "3", title: "Map Locations", desc: "Pin each chapter to its geographic location on the map" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[--color-brand] text-white text-2xl font-bold flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">{item.title}</h3>
              <p className="text-[--color-text-secondary]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* App Preview */}
    <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="default" className="mb-4">Preview</Badge>
        <h2 className="text-3xl font-bold text-[--color-text-primary] mb-8">See It In Action</h2>
        <div className="aspect-video bg-[--color-bg-tertiary] rounded-2xl border border-[--color-border-primary] flex items-center justify-center">
          <span className="text-[--color-text-tertiary]">[iOS App Prototype Embed]</span>
        </div>
      </div>
    </section>
  </div>
);

// Layout Option B: Split Hero + Vertical Timeline
const LayoutOptionB = () => (
  <div className="space-y-16">
    {/* Split Hero */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="info" className="mb-4">AdventureTube Platform</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-6">
            Transform Videos Into<br />
            <span className="text-[--color-brand]">Interactive Maps</span>
          </h1>
          <p className="text-lg text-[--color-text-secondary] mb-8">
            AdventureTube integrates YouTube videos with Google Maps, allowing travelers
            to map their journey-based stories directly onto specific locations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="secondary">Learn More</Button>
          </div>
        </div>
        <div className="aspect-square bg-[--color-bg-secondary] rounded-2xl border border-[--color-border-primary] flex items-center justify-center">
          <span className="text-[--color-text-tertiary]">[Hero Image/Animation]</span>
        </div>
      </div>
    </section>

    {/* Introduction */}
    <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[--color-text-primary] mb-6">What is AdventureTube?</h2>
        <p className="text-lg text-[--color-text-secondary] mb-4">
          AdventureTube is an innovative application designed to bridge the gap between
          YouTube travel content and geographical exploration.
        </p>
        <p className="text-[--color-text-secondary]">
          By leveraging YouTube&apos;s chapter functionality, the platform ensures that each
          segment of a travel story is accurately mapped, making it easier for others to
          explore, follow, and engage with content in a meaningful geographic context.
        </p>
      </div>
    </section>

    {/* Vertical Timeline - How It Works */}
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="warning" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold text-[--color-text-primary]">Your Journey, Mapped</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[--color-border-primary]" />

          {/* Timeline items */}
          {[
            { title: "Content Utilization", desc: "Use videos already uploaded to your YouTube channel. No need to produce new content." },
            { title: "Content Segmentation", desc: "Divide videos into chapters based on different segments of your adventure." },
            { title: "Mapping the Chapters", desc: "Assign each chapter to a geographic location on the map." },
            { title: "Visualization", desc: "Drag, adjust, and manage chapters directly on the map interface." },
            { title: "Content Repackaging", desc: "Present your content as multiple, distinct chapters mapped to specific locations." },
          ].map((item, index) => (
            <div key={index} className="relative pl-20 pb-10">
              <div className="absolute left-4 w-8 h-8 rounded-full bg-[--color-brand] text-white text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">{item.title}</h3>
              <p className="text-[--color-text-secondary]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features Cards */}
    <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold text-[--color-text-primary]">Key Capabilities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🗺️", title: "Visual Representation", desc: "Map videos onto geographical locations showing travel routes and landmarks" },
            { icon: "📍", title: "Google Maps Integration", desc: "Familiar and interactive interface to explore mapped adventures" },
            { icon: "📹", title: "Chapter Functionality", desc: "Segment videos based on locations along the travel route" },
            { icon: "🎯", title: "Targeted Discovery", desc: "Help viewers find content relevant to their destination" },
            { icon: "📱", title: "iOS App", desc: "Native mobile experience for on-the-go exploration" },
            { icon: "👥", title: "Community", desc: "Connect with other travelers and content creators" },
          ].map((item, index) => (
            <div key={index} className="p-6 bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary]">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">{item.title}</h3>
              <p className="text-sm text-[--color-text-secondary]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// Layout Option C: Compact Single Page with Screenshots
const LayoutOptionC = () => (
  <div className="space-y-12">
    {/* Compact Hero */}
    <section className="text-center py-12 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
        About AdventureTube
      </h1>
      <p className="text-lg text-[--color-text-secondary] max-w-2xl mx-auto">
        Map Your Journey, Engage Your Audience
      </p>
    </section>

    {/* Main Content Grid */}
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Introduction Card */}
        <div className="p-8 bg-[--color-bg-secondary] rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-[--color-text-primary] mb-4">What is AdventureTube?</h2>
          <p className="text-[--color-text-secondary] mb-4">
            AdventureTube is an innovative application designed to bridge the gap between
            YouTube travel content and geographical exploration. By integrating YouTube videos
            with Google Maps, it allows adventurers to map their journey-based stories directly
            onto specific locations.
          </p>
          <p className="text-[--color-text-secondary]">
            This transforms static video content into an interactive experience, enabling users
            to visualize and navigate real-world adventures in a more immersive way.
          </p>
        </div>

        {/* Screenshots Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 flex items-center justify-center">
              <span className="text-[--color-text-tertiary] text-sm">[Storymap Screenshot]</span>
            </div>
            <h4 className="font-medium text-[--color-text-primary]">Visual Representation</h4>
            <p className="text-sm text-[--color-text-tertiary]">Map videos to locations</p>
          </div>
          <div className="text-center">
            <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 flex items-center justify-center">
              <span className="text-[--color-text-tertiary] text-sm">[Map Screenshot]</span>
            </div>
            <h4 className="font-medium text-[--color-text-primary]">Google Maps Integration</h4>
            <p className="text-sm text-[--color-text-tertiary]">Interactive exploration</p>
          </div>
          <div className="text-center">
            <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 flex items-center justify-center">
              <span className="text-[--color-text-tertiary] text-sm">[Chapter Screenshot]</span>
            </div>
            <h4 className="font-medium text-[--color-text-primary]">Chapter Functionality</h4>
            <p className="text-sm text-[--color-text-tertiary]">Navigate by location</p>
          </div>
        </div>

        {/* Two Column Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-[--color-bg-secondary] rounded-xl">
            <h3 className="text-lg font-semibold text-[--color-text-primary] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[--color-brand]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
              For Creators
            </h3>
            <ul className="space-y-2 text-sm text-[--color-text-secondary]">
              <li>• Enhanced content visibility</li>
              <li>• Targeted audience reach</li>
              <li>• Better engagement metrics</li>
              <li>• Location-based categorization</li>
            </ul>
          </div>
          <div className="p-6 bg-[--color-bg-secondary] rounded-xl">
            <h3 className="text-lg font-semibold text-[--color-text-primary] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[--color-green]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[--color-green]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </span>
              For Consumers
            </h3>
            <ul className="space-y-2 text-sm text-[--color-text-secondary]">
              <li>• Discover content on a map</li>
              <li>• Find destination-relevant stories</li>
              <li>• Plan multi-location trips</li>
              <li>• Get firsthand travel insights</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-gradient-to-r from-[--color-brand]/10 to-[--color-green]/10 rounded-2xl">
          <h3 className="text-xl font-semibold text-[--color-text-primary] mb-4">Try the iOS App</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button>View Prototype</Button>
            <Button variant="secondary">Visit adventuretube.net</Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default function AboutAdventureTubeWireframe() {
  const [selectedLayout, setSelectedLayout] = useState<"A" | "B" | "C">("A");

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

      {/* Wireframe Header */}
      <div className="bg-[--color-bg-secondary] border-b border-[--color-border-primary] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/wireframes">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            </Link>
            <Badge variant="warning">Wireframe</Badge>
          </div>
          <h1 className="text-2xl font-bold text-[--color-text-primary] mb-2">About AdventureTube Page</h1>
          <p className="text-[--color-text-secondary]">
            Choose a layout option for the About page explaining the AdventureTube platform.
          </p>
        </div>
      </div>

      {/* Layout Selector */}
      <div className="sticky top-16 z-40 bg-[--color-bg-primary] border-b border-[--color-border-primary] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedLayout("A")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLayout === "A"
                ? "bg-[--color-brand] text-white"
                : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
            }`}
          >
            Option A: Hero + Grid
          </button>
          <button
            onClick={() => setSelectedLayout("B")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLayout === "B"
                ? "bg-[--color-brand] text-white"
                : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
            }`}
          >
            Option B: Split + Timeline
          </button>
          <button
            onClick={() => setSelectedLayout("C")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLayout === "C"
                ? "bg-[--color-brand] text-white"
                : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
            }`}
          >
            Option C: Compact + Screenshots
          </button>
        </div>
      </div>

      {/* Layout Preview */}
      <div className="pb-16">
        {selectedLayout === "A" && <LayoutOptionA />}
        {selectedLayout === "B" && <LayoutOptionB />}
        {selectedLayout === "C" && <LayoutOptionC />}
      </div>

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
