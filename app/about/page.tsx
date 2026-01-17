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
  { label: "About", href: "/about", isActive: true },
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
      { label: "Contact Us", href: "/about" },
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

// YouTube Video Embed Component
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[--color-bg-secondary]">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="w-full h-full"
    />
  </div>
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="success" className="mb-4">About Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[--color-text-primary] mb-6">
            Hi, We&apos;re Adventure Victoria!
          </h1>
          <p className="text-xl text-[--color-text-secondary] max-w-2xl mx-auto">
            A family passionate about camping and exploring Victoria&apos;s beautiful outdoors together.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Video */}
            <div className="space-y-4">
              <YouTubeEmbed videoId="53yb306y28c" title="Introducing Adventure Victoria" />
              <p className="text-[--color-text-tertiary] text-sm text-center">
                Watch our channel introduction video
              </p>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <div className="space-y-4 text-[--color-text-secondary]">
                <p className="text-lg">
                  Our family has been camping around Victoria for over <span className="text-[--color-green] font-semibold">7 years</span>, building experience and memories together as a team.
                </p>
                <p>
                  We want to inspire other families - especially those with kids aged 2-18 - who have never camped before or want to become self-sufficient in the bush.
                </p>
                <p>
                  Our videos help you answer the important questions before your trip:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[--color-text-secondary]">
                  <li>How many days should we stay?</li>
                  <li>How many people can the site accommodate?</li>
                  <li>What season is best to visit?</li>
                  <li>What activities can we try there?</li>
                </ul>
                <p className="text-[--color-green] font-medium pt-2">
                  Hope to see you at the campsite - especially more Asian families! Say hello if you spot us!
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-[--color-bg-secondary] rounded-[--radius-lg]">
                  <span className="text-[--color-text-primary] font-bold text-2xl">496</span>
                  <span className="text-[--color-text-tertiary] text-sm">Subscribers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-[--color-bg-secondary] rounded-[--radius-lg]">
                  <span className="text-[--color-text-primary] font-bold text-2xl">44</span>
                  <span className="text-[--color-text-tertiary] text-sm">Videos</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-[--color-bg-secondary] rounded-[--radius-lg]">
                  <span className="text-[--color-text-primary] font-bold text-2xl">7+</span>
                  <span className="text-[--color-text-tertiary] text-sm">Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Get In Touch</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
              Contact Us
            </h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Have questions about camping in Victoria? Want to collaborate? We&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Card */}
            <a
              href="mailto:momentale@gmail.com"
              className="p-6 bg-[--color-bg-tertiary] border border-[--color-border-secondary] rounded-2xl hover:border-[--color-brand] transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[--color-bg-secondary] flex items-center justify-center text-[--color-brand] group-hover:bg-[--color-brand] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">Email</h3>
                  <p className="text-[--color-brand] group-hover:underline">momentale@gmail.com</p>
                  <p className="text-[--color-text-tertiary] text-sm mt-2">
                    For inquiries and collaborations
                  </p>
                </div>
              </div>
            </a>

            {/* Website Card */}
            <a
              href="https://adventuretube.net"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-[--color-bg-tertiary] border border-[--color-border-secondary] rounded-2xl hover:border-[--color-brand] transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[--color-bg-secondary] flex items-center justify-center text-[--color-brand] group-hover:bg-[--color-brand] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">Website</h3>
                  <p className="text-[--color-brand] group-hover:underline">adventuretube.net</p>
                  <p className="text-[--color-text-tertiary] text-sm mt-2">
                    Visit our main website
                  </p>
                </div>
              </div>
            </a>

            {/* YouTube Card */}
            <a
              href="https://www.youtube.com/@Adventurevictoria"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-[--color-bg-tertiary] border border-[--color-border-secondary] rounded-2xl hover:border-[#FF0000] transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[--color-bg-secondary] flex items-center justify-center text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">YouTube</h3>
                  <p className="text-[#FF0000] group-hover:underline">@Adventurevictoria</p>
                  <p className="text-[--color-text-tertiary] text-sm mt-2">
                    Subscribe and watch our videos
                  </p>
                </div>
              </div>
            </a>

            {/* Location Card */}
            <div className="p-6 bg-[--color-bg-tertiary] border border-[--color-border-secondary] rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[--color-bg-secondary] flex items-center justify-center text-[--color-green]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">Location</h3>
                  <p className="text-[--color-text-secondary]">Victoria, Australia</p>
                  <p className="text-[--color-text-tertiary] text-sm mt-2">
                    Exploring camping spots across the state
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-[--color-text-secondary] mb-8 max-w-2xl mx-auto">
            Subscribe to our channel and join our community of family campers exploring Victoria&apos;s beautiful outdoors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.youtube.com/@Adventurevictoria?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-[#FF0000] hover:bg-[#CC0000] gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Subscribe Now
              </Button>
            </a>
            <a href="/">
              <Button size="lg" variant="secondary">
                Back to Home
              </Button>
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
