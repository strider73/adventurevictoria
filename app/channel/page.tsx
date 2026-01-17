"use client";

import {
  Button,
  Badge,
  Navbar,
  Footer,
  Hero,
  HeroGradientText,
  SocialIcons,
} from "@/components/ui";

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

// Actual videos from your channel (most popular)
const featuredVideos = [
  {
    id: "hOmbxnF7sh0",
    title: "Lake Eildon National Park - Kayak and Korean bush cooking",
    views: "2.5K views",
  },
  {
    id: "5taI0vAm5Fw",
    title: "Bush Camping and Hiking - Great Otway National Park",
    views: "2.3K views",
  },
  {
    id: "RKHe9BbLTiM",
    title: "Port Campbell Holiday Park - Camping and Hiking",
    views: "2.2K views",
  },
];

// More videos for the grid section
const moreVideos = [
  {
    id: "pT_dDWd17gY",
    title: "Bush Camping - Blackwood Forest (Cooking in the Rain)",
    views: "1.9K views",
  },
  {
    id: "4qkCQ1F-8KE",
    title: "Hiking and Bush Camping - Wombat State Forest",
    views: "1.2K views",
  },
  {
    id: "vA774gsNutA",
    title: "Wilsons Promontory National Park Part 1 - Stock Yard Camping",
    views: "1.1K views",
  },
];

const videoCategories = [
  {
    title: "National Parks",
    description: "Victoria's best national parks for camping",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    videos: [
      { title: "Wilsons Promontory", id: "vA774gsNutA" },
      { title: "Great Otway", id: "5taI0vAm5Fw" },
      { title: "Lake Eildon", id: "hOmbxnF7sh0" },
      { title: "Lerderderg", id: "kcwuj8EuCP8" },
    ],
  },
  {
    title: "State Forests",
    description: "Free bush camping in Victoria's forests",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    videos: [
      { title: "Wombat Forest", id: "9U1m_LiJALg" },
      { title: "Blackwood Forest", id: "pT_dDWd17gY" },
      { title: "Briagolong", id: "D4zAOubdqNA" },
      { title: "Nolans Creek", id: "HL6FR_Kr4GU" },
    ],
  },
  {
    title: "Great Ocean Road",
    description: "Coastal camping adventures",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    videos: [
      { title: "Johanna Beach", id: "2s-IFKwgFyA" },
      { title: "Port Campbell", id: "RKHe9BbLTiM" },
      { title: "12 Apostles", id: "BQ_IE8Kv12E" },
      { title: "Surf Coast Walk", id: "gu2F2qi6p2k" },
    ],
  },
  {
    title: "Hiking Trails",
    description: "Best hiking spots in Victoria",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    videos: [
      { title: "Lerderderg Gorge", id: "tMbw_UXgR_k" },
      { title: "Mt Oberon", id: "TOs6qC1J-Qo" },
      { title: "Macedon", id: "YGIUYz2V7eg" },
      { title: "Sheoak Picnic", id: "CCIS3-ohsJE" },
    ],
  },
  {
    title: "Holiday Parks",
    description: "Family-friendly camping facilities",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    videos: [
      { title: "BIG4 Yarra Valley", id: "SMngB9Ae_4M" },
      { title: "Anderson's", id: "BrBitvmjpX0" },
      { title: "Dandos", id: "MpvNLoyGQsM" },
      { title: "Surfside", id: "RO7q54e307I" },
    ],
  },
  {
    title: "Bush Cooking",
    description: "Campfire meals & outdoor recipes",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    videos: [
      { title: "Korean Bush Cooking", id: "hOmbxnF7sh0" },
      { title: "Cooking in Rain", id: "pT_dDWd17gY" },
      { title: "Stevensons Camp", id: "yKDBw3uSy8A" },
      { title: "Nolans Creek", id: "AahyBJMV1Aw" },
    ],
  },
  {
    title: "Family Holidays",
    description: "Fun adventures for all ages",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    videos: [
      { title: "Phillip Island", id: "03-JfDNVKwk" },
      { title: "Portland Farm", id: "pURlGTAsOig" },
      { title: "Luna Park", id: "WsghFCuoZ6Q" },
      { title: "Portland Boat", id: "GKx2TFgqgVc" },
    ],
  },
  {
    title: "Water Activities",
    description: "Kayaking, beaches & water fun",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    videos: [
      { title: "Lake Eildon Kayak", id: "hOmbxnF7sh0" },
      { title: "Squeaky Beach", id: "ReX_9UkJB2M" },
      { title: "Snowy River", id: "cXWxeoVuLF4" },
      { title: "Howqua Hills", id: "N4qiHN4_SvI" },
    ],
  },
];

// Navigation links for the site
const navLinks = [
  { label: "Map - Victoria", href: "/" },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes" },
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

export default function ChannelPage() {
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
      <Hero
        size="lg"
        badge={<Badge variant="success" dot>7+ Years Experience</Badge>}
        title={
          <>
            Family Camping Adventures in{" "}
            <HeroGradientText gradient="from-[#4cb782] via-[#4ea7fc] to-[#5e6ad2]">
              Victoria, Australia
            </HeroGradientText>
          </>
        }
        description="Join our family as we explore Victoria's best camping destinations. From destination guides and campsite reviews to cooking tips and gear recommendations - everything you need for your next family outdoor adventure."
        primaryAction={
          <a
            href="https://www.youtube.com/@Adventurevictoria?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-[#FF0000] hover:bg-[#CC0000] gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe to Channel
            </Button>
          </a>
        }
        secondaryAction={
          <a
            href="https://www.youtube.com/@Adventurevictoria/videos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="secondary">
              Watch Videos
            </Button>
          </a>
        }
        gradientColors={{
          from: "#4cb782",
          via: "#5e6ad2",
          to: "transparent",
        }}
      />

      {/* Featured Video - Large Hero Video */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="warning" className="mb-4">Most Popular</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[--color-text-primary] mb-2">
              Channel Introduction
            </h2>
            <p className="text-[--color-text-secondary]">
              Learn more about our family camping adventures
            </p>
          </div>
          <YouTubeEmbed videoId="53yb306y28c" title="Introducing Adventure Victoria" />
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Featured Content</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
              Popular Adventures
            </h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Our most watched camping videos - kayaking, hiking, and cooking in Victoria&apos;s beautiful outdoors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVideos.map((video) => (
              <div key={video.id} className="space-y-4">
                <YouTubeEmbed videoId={video.id} title={video.title} />
                <div>
                  <h3 className="text-[--color-text-primary] font-semibold line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[--color-text-tertiary] text-sm mt-1">{video.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Videos Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">More Videos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
              Bush Camping Adventures
            </h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Explore Victoria&apos;s state forests and national parks with our family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreVideos.map((video) => (
              <div key={video.id} className="space-y-4">
                <YouTubeEmbed videoId={video.id} title={video.title} />
                <div>
                  <h3 className="text-[--color-text-primary] font-semibold line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[--color-text-tertiary] text-sm mt-1">{video.views}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@Adventurevictoria/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                View All 44 Videos
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">What We Cover</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
              Your Complete Camping Guide
            </h2>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Everything you need to plan your family camping trip - from choosing the perfect spot to cooking delicious outdoor meals
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {videoCategories.map((category, index) => (
              <div
                key={index}
                className="p-3 sm:p-6 bg-[--color-bg-tertiary] border border-[--color-border-secondary] rounded-2xl hover:border-[--color-border-primary] hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-[--color-bg-secondary] flex items-center justify-center text-[--color-brand]">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-[--color-text-tertiary] text-xs mb-4">
                    {category.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {category.videos.map((video) => (
                    <a
                      key={video.id}
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[--color-bg-secondary] hover:bg-[--color-bg-primary] text-[--color-text-secondary] hover:text-[--color-text-primary] text-sm transition-colors group"
                    >
                      <svg className="w-4 h-4 text-[#FF0000] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span className="truncate">{video.title}</span>
                      <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Embedded Video */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="success" className="mb-4">About Us</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-6">
                Hi, We&apos;re Adventure Victoria!
              </h2>
              <div className="space-y-4 text-[--color-text-secondary]">
                <p>
                  Our family has been camping around Victoria for over 7 years, building experience and memories together as a team.
                </p>
                <p>
                  We want to inspire other families - especially those with kids aged 2-18 - who have never camped before or want to become self-sufficient in the bush.
                </p>
                <p>
                  Our videos help you answer the important questions before your trip:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>How many days should we stay?</li>
                  <li>How many people can the site accommodate?</li>
                  <li>What season is best to visit?</li>
                  <li>What activities can we try there?</li>
                </ul>
                <p className="text-[--color-green] font-medium">
                  Hope to see you at the campsite - especially more Asian families! Say hello if you spot us!
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.youtube.com/@Adventurevictoria/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">Learn More About Us</Button>
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-[--color-bg-secondary] rounded-[--radius-lg]">
                  <span className="text-[--color-text-primary] font-bold text-xl">496</span>
                  <span className="text-[--color-text-tertiary] text-sm">Subscribers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[--color-bg-secondary] rounded-[--radius-lg]">
                  <span className="text-[--color-text-primary] font-bold text-xl">44</span>
                  <span className="text-[--color-text-tertiary] text-sm">Videos</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <YouTubeEmbed videoId="YXsIWSPdwkQ" title="Bush Camping at Digger's track in Lerderderg" />
              <p className="text-[--color-text-tertiary] text-sm text-center">
                Latest: Bush Camping at Digger&apos;s track in Lerderderg
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* iOS App Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - App Preview */}
            <div className="relative flex justify-center">
              <div className="w-[473px] sm:w-[541px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FRZCJw60n7wgWTN4jMYfkoy%2FAdventureVictoria%3Fpage-id%3D0%253A1%26node-id%3D6-2%26p%3Df%26m%3Ddev%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D6%253A2%26hide-ui%3D1"
                  className="w-full h-full border-0"
                  title="AdventureTube iOS App Preview"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div>
              <Badge variant="warning" className="mb-4">Coming Soon</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-6">
                AdventureTube iOS App
              </h2>
              <p className="text-[--color-text-secondary] mb-6">
                We&apos;re building an iOS app to help you discover camping adventures on an interactive map.
                Browse locations, watch videos, and plan your next family trip - all in one place.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[--color-brand]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[--color-text-primary] font-medium">Interactive Map</h4>
                    <p className="text-[--color-text-tertiary] text-sm">Explore camping locations across Victoria and Korea</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[--color-green]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[--color-green]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[--color-text-primary] font-medium">Video Integration</h4>
                    <p className="text-[--color-text-tertiary] text-sm">Watch camping videos directly in the app</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[--color-orange]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[--color-orange]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[--color-text-primary] font-medium">Community Sharing</h4>
                    <p className="text-[--color-text-tertiary] text-sm">Share your own camping videos and discoveries</p>
                  </div>
                </div>
              </div>

              <a href="/ios-adventuretube">
                <Button size="lg" className="gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Interactive Prototype
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[--color-bg-secondary] to-[--color-bg-tertiary]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-[--color-text-secondary] mb-8 max-w-2xl mx-auto">
            Subscribe to Adventure Victoria and never miss a video. Join our community of family campers exploring Victoria&apos;s beautiful outdoors.
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
            <a
              href="https://www.youtube.com/@Adventurevictoria"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary">
                Visit Channel
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
