"use client";

import {
  Button,
  Badge,
  Navbar,
  Footer,
  SocialIcons,
} from "@/components/ui";

const navLinks = [
  { label: "Map - Victoria", href: "/" },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes" },
  { label: "About AdventureTube", href: "/about", isActive: true },
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
      { label: "Contact Us", href: "mailto:momentale@gmail.com" },
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

export default function AboutPage() {
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

      {/* ===== PART 1: WEB APPLICATION (from Option B) ===== */}

      {/* Split Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="info" className="mb-4">Web Application</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-6">
              Transform Videos Into<br />
              <span className="bg-gradient-to-r from-[#4cb782] via-[#4ea7fc] to-[#5e6ad2] bg-clip-text text-transparent">
                Interactive Maps
              </span>
            </h1>
            <p className="text-lg text-[--color-text-secondary] mb-8">
              AdventureTube integrates YouTube videos with Google Maps, allowing travelers
              to map their journey-based stories directly onto specific locations.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://adventuretube.net" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Visit adventuretube.net</Button>
              </a>
              <Button size="lg" variant="secondary">Learn More</Button>
            </div>
          </div>
          <div className="aspect-video bg-[--color-bg-secondary] rounded-2xl border border-[--color-border-primary] overflow-hidden shadow-xl">
            <iframe
              src="https://adventuretube.net"
              title="AdventureTube Web"
              className="w-full h-full"
            />
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
              <div key={index} className="relative pl-20 pb-10 last:pb-0">
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

      {/* ===== PART 2: iOS APPLICATION (from Option C) ===== */}

      {/* iOS App Section Header */}
      <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">iOS Application</Badge>
            <h2 className="text-3xl font-bold text-[--color-text-primary] mb-4">AdventureTube on Mobile</h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Experience AdventureTube on your iPhone. Explore mapped adventures, discover locations,
              and plan your trips on the go.
            </p>
          </div>

          {/* Screenshots Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 overflow-hidden">
                <img
                  src="https://adventuretube.net/wp-content/uploads/2024/05/Storymap-2-473x1024-1.png"
                  alt="Storymap Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-[--color-text-primary]">Visual Representation</h4>
              <p className="text-sm text-[--color-text-tertiary]">Map videos to locations</p>
            </div>
            <div className="text-center">
              <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 overflow-hidden">
                <img
                  src="https://adventuretube.net/wp-content/uploads/2024/05/StoryMap11.png"
                  alt="Map Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-[--color-text-primary]">Google Maps Integration</h4>
              <p className="text-sm text-[--color-text-tertiary]">Interactive exploration</p>
            </div>
            <div className="text-center">
              <div className="aspect-[9/16] bg-[--color-bg-tertiary] rounded-xl border border-[--color-border-primary] mb-3 overflow-hidden">
                <img
                  src="https://adventuretube.net/wp-content/uploads/2024/05/Chapter-Visualization-953x2048-1.png"
                  alt="Chapter Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-[--color-text-primary]">Chapter Functionality</h4>
              <p className="text-sm text-[--color-text-tertiary]">Navigate by location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">Benefits</Badge>
            <h2 className="text-3xl font-bold text-[--color-text-primary]">For Creators & Consumers</h2>
          </div>
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
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enhanced content visibility through location mapping
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Targeted audience interested in specific places
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Better engagement with chapter-based navigation
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Location-based content categorization
                </li>
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
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Discover travel content directly on a map
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Find stories relevant to your destination
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Plan multi-location trips with ease
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[--color-green] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Get firsthand travel insights before visiting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary] py-16">
        <div className="max-w-4xl mx-auto text-center p-8 bg-gradient-to-r from-[--color-brand]/10 to-[--color-green]/10 rounded-2xl">
          <h3 className="text-xl font-semibold text-[--color-text-primary] mb-4">Experience AdventureTube</h3>
          <p className="text-[--color-text-secondary] mb-6 max-w-lg mx-auto">
            Try the iOS app prototype or visit our main website to learn more about the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/ios-adventuretube">
              <Button>View iOS Prototype</Button>
            </a>
            <a href="https://adventuretube.net" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">Visit adventuretube.net</Button>
            </a>
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
