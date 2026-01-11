"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardImage,
  CardContent,
  CardFooter,
  Badge,
  Navbar,
  Footer,
  SocialIcons,
  Hero,
  HeroGradientText,
  Carousel,
  CarouselSlide,
} from "@/components/ui";

export default function ComponentsPage() {
  const [inputValue, setInputValue] = useState("");

  // Demo data
  const navLinks = [
    { label: "Features", href: "#", isActive: true },
    { label: "Pricing", href: "#" },
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
  ];

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Docs", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Community", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Partners", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: SocialIcons.Twitter },
    { name: "GitHub", href: "#", icon: SocialIcons.GitHub },
    { name: "LinkedIn", href: "#", icon: SocialIcons.LinkedIn },
    { name: "YouTube", href: "#", icon: SocialIcons.YouTube },
  ];

  const carouselImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&h=600&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      {/* Navbar Demo */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Navbar</h2>
            <p className="text-[--color-text-tertiary]">
              Responsive navigation bar with logo, menu, and CTA button
            </p>
          </div>

          <div className="rounded-[--radius-xl] border border-[--color-border-primary] overflow-hidden">
            <Navbar
              logoText="Acme Inc"
              links={navLinks}
              sticky={false}
              ctaButton={<Button size="sm">Get Started</Button>}
            />
          </div>
        </div>
      </section>

      {/* Hero Demo */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Hero Section</h2>
            <p className="text-[--color-text-tertiary]">
              Landing page hero section with gradient background, title, and CTA
            </p>
          </div>

          <div className="rounded-[--radius-xl] border border-[--color-border-primary] overflow-hidden bg-[--color-bg-primary]">
            <Hero
              size="sm"
              badge={<Badge variant="info" dot>New Release</Badge>}
              title={
                <>
                  Build products with{" "}
                  <HeroGradientText>lightning speed</HeroGradientText>
                </>
              }
              description="The modern platform for building exceptional digital experiences. Ship faster, scale effortlessly, and delight your users."
              primaryAction={<Button size="lg">Start Building</Button>}
              secondaryAction={<Button size="lg" variant="secondary">View Demo</Button>}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Split Layout
            </h3>
            <div className="rounded-[--radius-xl] border border-[--color-border-primary] overflow-hidden bg-[--color-bg-primary]">
              <Hero
                variant="split"
                size="sm"
                title="Design without limits"
                description="Create beautiful interfaces with our intuitive design system. No compromises, just pure creativity."
                primaryAction={<Button>Get Started</Button>}
                secondaryAction={<Button variant="ghost">Learn More</Button>}
                showGradient={false}
                image={
                  <div className="rounded-[--radius-xl] overflow-hidden border border-[--color-border-primary]">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop"
                      alt="Hero image"
                      className="w-full h-auto"
                    />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Demo */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Carousel</h2>
            <p className="text-[--color-text-tertiary]">
              Image/content slider with autoplay, navigation, and dot indicators
            </p>
          </div>

          <div className="max-w-3xl">
            <Carousel autoPlay autoPlayInterval={4000}>
              {carouselImages.map((image, index) => (
                <CarouselSlide key={index} image={image} alt={`Slide ${index + 1}`} overlay>
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">Slide {index + 1}</h3>
                    <p className="text-white/80">Beautiful gradient backgrounds</p>
                  </div>
                </CarouselSlide>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Button Section */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Button</h2>
            <p className="text-[--color-text-tertiary]">
              Button component supporting various variants and sizes
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Variants
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              States
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                With Icon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Input</h2>
            <p className="text-[--color-text-tertiary]">
              Text input component for form entries
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              States
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
              <Input
                label="Default"
                placeholder="Enter text..."
                helperText="This is helper text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Disabled"
                placeholder="Disabled input"
                disabled
                helperText="This input is disabled"
              />
              <Input
                label="Error"
                placeholder="Enter email..."
                state="error"
                errorMessage="Please enter a valid email"
                defaultValue="invalid-email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Sizes
            </h3>
            <div className="flex flex-col gap-4 max-w-md">
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input" />
              <Input size="lg" placeholder="Large input" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              With Icons
            </h3>
            <div className="flex flex-col gap-4 max-w-md">
              <Input
                placeholder="Search..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Input
                type="email"
                placeholder="Email address"
                rightIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Card</h2>
            <p className="text-[--color-text-tertiary]">
              Card component for grouping content
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Variants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader title="Default Card" subtitle="With border style" />
                <CardContent className="mt-4">
                  <p className="text-sm">Default card style with border.</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader title="Elevated Card" subtitle="With shadow" />
                <CardContent className="mt-4">
                  <p className="text-sm">Card with shadow effect applied.</p>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardHeader title="Outlined Card" subtitle="Transparent bg" />
                <CardContent className="mt-4">
                  <p className="text-sm">Card with transparent background and border only.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              With Image
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card padding="none" hoverable>
                <CardImage
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop"
                  alt="Abstract gradient"
                  aspectRatio="video"
                />
                <div className="p-4 space-y-3">
                  <CardHeader title="Featured Project" subtitle="Design System" />
                  <CardContent>
                    <p className="text-sm">Example card with image included.</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="secondary">View</Button>
                    <Button size="sm" variant="ghost">Share</Button>
                  </CardFooter>
                </div>
              </Card>

              <Card padding="none" hoverable>
                <CardImage
                  src="https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=400&fit=crop"
                  alt="Colorful gradient"
                  aspectRatio="video"
                />
                <div className="p-4 space-y-3">
                  <CardHeader
                    title="New Feature"
                    action={<Badge variant="success">Live</Badge>}
                  />
                  <CardContent>
                    <p className="text-sm">Card used with a badge.</p>
                  </CardContent>
                </div>
              </Card>

              <Card padding="none" hoverable>
                <CardImage
                  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop"
                  alt="Gradient background"
                  aspectRatio="video"
                />
                <div className="p-4 space-y-3">
                  <CardHeader title="Coming Soon" subtitle="Q1 2026" />
                  <CardContent>
                    <p className="text-sm">Card for upcoming features.</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Notify Me</Button>
                  </CardFooter>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Section */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Badge</h2>
            <p className="text-[--color-text-tertiary]">
              Badge component for displaying status or categories
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="default">Default</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              With Dot
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success" dot>Active</Badge>
              <Badge variant="warning" dot>Pending</Badge>
              <Badge variant="error" dot>Failed</Badge>
              <Badge variant="info" dot>Processing</Badge>
              <Badge variant="default" dot>Inactive</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge size="sm" variant="info">Small</Badge>
              <Badge size="md" variant="info">Medium</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[--color-text-secondary] uppercase tracking-wider">
              With Icon
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="success"
                icon={
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Completed
              </Badge>
              <Badge
                variant="warning"
                icon={
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                In Progress
              </Badge>
              <Badge
                variant="error"
                icon={
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Cancelled
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Example */}
      <section className="border-b border-[--color-border-primary]">
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Combined Example</h2>
            <p className="text-[--color-text-tertiary]">
              Real-world example combining multiple components
            </p>
          </div>

          <Card variant="default" padding="lg" className="max-w-lg">
            <CardHeader
              title="Create New Project"
              subtitle="Fill in the details below"
              action={<Badge variant="info">Draft</Badge>}
            />
            <CardContent className="mt-6 space-y-4">
              <Input label="Project Name" placeholder="Enter project name" fullWidth />
              <Input label="Description" placeholder="Brief description of your project" fullWidth />
            </CardContent>
            <CardFooter>
              <Button variant="primary">Create Project</Button>
              <Button variant="ghost">Cancel</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer Demo */}
      <section>
        <div className="max-w-6xl mx-auto px-8 py-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">Footer</h2>
            <p className="text-[--color-text-tertiary]">
              Website footer with link sections, social icons, and copyright
            </p>
          </div>
        </div>

        <Footer
          logoText="Acme Inc"
          description="Building the future of digital experiences. We help teams ship products faster."
          sections={footerSections}
          socialLinks={socialLinks}
          copyright="© 2026 Acme Inc. All rights reserved."
          bottomLinks={[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookies", href: "#" },
          ]}
        />
      </section>
    </div>
  );
}
