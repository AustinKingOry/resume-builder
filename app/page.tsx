"use client"

import Image from "next/image"
import Link from "next/link"
import { JSX, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Flame, FileText, PenLine, ImageIcon, CheckCircle2, Sparkles, ShieldCheck, Globe, LineChart, Zap, Crown, Menu, X, Sun, Moon, ArrowRight, Award, Star } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Footer } from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

// Pricing data (Roast My CV) incl. Free plan
const plans = [
  {
    id: "free" as const,
    name: "Starter Plan",
    price: "Free",
    period: "",
    icon: Sparkles,
    color: "sky",
    popular: false,
    features: ["5 CV roasts per month", "Standard AI processing", "Core feedback summary"],
    description: "Get started—no card required",
  },
  {
    id: "hustler" as const,
    name: "Hustler Plan",
    price: "KSh 50",
    period: "/month",
    icon: Zap,
    color: "emerald",
    popular: true,
    features: [
      "50 CV roasts per day",
      "Priority AI processing",
      "Advanced Kenya job market insights",
      "Export to PDF & Word",
      "Email support",
      "LinkedIn optimization tips",
    ],
    description: "Perfect for active job seekers",
  },
  {
    id: "pro" as const,
    name: "Professional Plan",
    price: "KSh 200",
    period: "/month",
    icon: Crown,
    color: "purple",
    popular: false,
    features: [
      "200 CV roasts per day",
      "Instant AI processing",
      "Industry-specific feedback",
      "Custom CV templates",
      "Priority support",
      "Interview preparation tips",
      "Salary negotiation guidance",
      "Career coaching insights",
    ],
    description: "For serious career advancement",
  },
]

// Lightweight reveal-on-scroll using IntersectionObserver
function Reveal({
  children,
  className,
//   as: Tag = "div",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const t = setTimeout(() => setVisible(true), delay)
                obs.unobserve(entry.target)
                return () => clearTimeout(t)
            }
            })
        },
        { threshold: 0.2 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [delay])


    const translate =
        direction === "up"
        ? "translate-y-6"
        : direction === "down"
        ? "-translate-y-6"
        : direction === "left"
        ? "translate-x-6"
        : direction === "right"
        ? "-translate-x-6"
        : "";

    return (
        <div
        // <Tag
        ref={ref}
        className={cn(
            "transition-all duration-700 ease-out will-change-transform",
            visible ? "opacity-100 translate-x-0 translate-y-0" : cn("opacity-0", translate),
            className
        )}
        >
        {children}
        {/* </Tag> */}
        </div>
    )
}

function Hero() {
  return (
    <section id="hero" className="relative pt-24 pb-12 md:pb-20 overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* <Image
          src="/images/World-Map.svg"
          // src="/images/africa-motif.jpg"
          alt="Subtle African geometric pattern"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.08] dark:opacity-10"
        /> */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -top-20 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-[#1E3A8A] dark:text-blue-600">
              Craft. <br /><span className="text-primary">Stand Out.</span><br /> Grow.
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-prose dark:text-gray-400">
              KaziKit is your all-in-one toolkit to build a standout professional profile and thrive in your career
              journey.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" className="bg-emerald-600 hover:bg-primary/90" asChild>
                    <Link href={'/builder'}>Start Building <ArrowRight className="ml-2 h-4 w-4" /></Link>                    
                </Button>
                <Button size="lg" variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] dark:text-blue-700 hover:bg-[#1E3A8A]/10" asChild>
                    <Link href={'#features'}>Explore Tools</Link>
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Badge variant="outline" className="border-emerald-600/50 text-emerald-700 dark:text-emerald-400">Africa-first</Badge>
                <Badge variant="outline" className="border-sky-600/50 text-sky-700 dark:text-sky-400">Global-ready</Badge>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-border/60 min-h-[420px] md:min-h-[520px]">
              <Image
                src="/images/hero-kazikit.jpg"
                alt="Ambitious African professionals collaborating in a modern workspace"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/0 to-background/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs border">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Built for Africa. Ready for the world.</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        <Reveal>
          <div>
            <Badge variant="outline" className="mb-3 border-emerald-600/40 text-emerald-700 dark:text-emerald-400">
              What is Kazikit?
            </Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                A premium suite of AI career tools
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground max-w-prose dark:text-gray-400">
              Kazikit gives African youth everything needed to build a credible, competitive professional brand. Create powerful resumes and cover letters, generate a studio-quality cover photo, keep your skills sharp, and get instant, honest feedback with Roast My CV.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg" asChild>
                <Link href="#tools">See the toolkit</Link>
              </Button>
              <Button variant="outline" className="border-emerald-500/40 hover:border-emerald-500/70" asChild>
                <Link href="#how">How it works</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left">
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-border/60 min-h-[320px] md:min-h-[420px]">
            <Image
              src="/images/about-collage.png"
              alt="Kazikit toolkit in action across laptop and mobile devices"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {["Resume Builder", "Cover Photo", "Roast My CV"].map((chip) => (
                <div key={chip} className="rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs border">
                  {chip}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ToolsSection() {
  const tools = [
    { title: "Resume Builder", desc: "Craft world-class resumes with impact-driven bullet points, optimized for ATS and global markets.", href: "/builder", icon: FileText, accent: "from-emerald-500 to-emerald-700" },
    { title: "Cover Photos", desc: "Create professional cover images that make your social media profiles stand out and leave a lasting impression", href: "/cooking", icon: ImageIcon, accent: "from-sky-500 to-sky-700" },
    { title: "Cover Letters", desc: "Tailor persuasive letters for each role with company-aware, role-specific context.", href:"/cooking", icon: PenLine, accent: "from-emerald-500 to-sky-500" },
    { title: "Professional Templates", desc: "Choose from a variety of professionally designed templates that stand out.", href: "/templates", icon: Award, accent: "from-emerald-600 to-sky-600" },
    { title: "Skills Tracker", desc: "Track, validate, and showcase your growth with goals and micro-achievements.", href: "/cooking", icon: CheckCircle2, accent: "from-sky-500 to-emerald-500" },
    { title: "Roast My CV", desc: "Instant, unfiltered feedback that turns your CV into an authentic, competitive narrative.", href: "/roast-my-cv", icon: Flame, accent: "from-emerald-600 to-sky-600" },
  ] as const

  return (
    <section id="tools" className="relative py-16 md:py-24 overflow-hidden">
      {/* <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      </div> */}
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 border-sky-600/40 text-sky-700 dark:text-sky-400">Your Career Toolkit</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              Everything you need to succeed
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
              Every tool is trained to amplify your strengths, respect your story, and elevate your professional presence.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <Card className="relative overflow-hidden group border-emerald-600/10 dark:border-emerald-400/10">
                <div className={cn("absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition bg-gradient-to-br", t.accent)} />
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br text-white from-emerald-600 to-sky-600 shadow-md shadow-emerald-600/20">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-2">{t.title}</CardTitle>
                  <CardDescription className=" dark:text-gray-400">{t.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="ml-auto" asChild>
                    <Link href={t.href} className="inline-flex items-center">
                      Try now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Redesigned "How it works"
 * - Horizontal stepper (desktop) + vibrant step cards with imagery
 * - Smooth, lightweight Reveal animations (no sticky effects)
 */
function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Create your profile",
      desc: "Tell us about your goals, experience, and industries of interest.",
      img: "/images/profile.svg?height=160&width=320",
      badge: "Step 1",
    },
    {
      step: 2,
      title: "Build your resume",
      desc: "Generate a strong resume, cover letters, and a professional cover photo.",
      img: "/images/build.svg?height=160&width=320",
      badge: "Step 2",
    },
    {
      step: 3,
      title: "Roast and refine",
      desc: "Get instant feedback with Roast My CV and polish until you’re ready.",
      img: "/images/refine.svg?height=160&width=320",
      badge: "Step 3",
    },
    {
      step: 4,
      title: "Track skills, apply confidently",
      desc: "Show measurable growth and present a brand that travels.",
      img: "/images/growth.svg?height=160&width=320",
      badge: "Step 4",
    },
  ] as const

  return (
    <section id="how" className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 bottom-10 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 border-sky-600/40 text-sky-700 dark:text-sky-400">How it works</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                From curiosity to confidence, in four clear steps
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
              The entire flow guides you from exploration to action with clarity and encouragement.
            </p>
          </div>
        </Reveal>

        {/* Horizontal stepper on desktop */}
        <Reveal>
          <ol className="mt-8 hidden lg:flex items-center gap-4">
            {steps.map((s, idx) => (
              <li key={s.step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 text-white grid place-items-center text-xs font-medium shadow">
                    {s.step}
                  </div>
                  <span className="text-sm font-medium">{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="mx-4 h-px flex-1 bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-sky-500/50" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Step cards with imagery */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <Reveal key={s.step} delay={idx * 80}>
              <Card className="group border-emerald-600/10 dark:border-emerald-400/10 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{s.badge}</Badge>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{s.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="relative rounded-lg overflow-hidden ring-1 ring-border/60">
                    <Image
                      src={s.img || "/placeholder.svg"}
                      alt={s.title}
                      width={320}
                      height={160}
                      className="w-full h-40 object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                    <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-gradient-to-tr from-emerald-600/30 to-sky-600/30 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex gap-3">
            <Button className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg" asChild>
              <Link href="/login">Get started free</Link>
            </Button>
            <Button variant="outline" className="border-emerald-500/40 hover:border-emerald-500/70" asChild>
              <Link href="/roast-my-cv">Try Roast My CV</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  const items = [
    { title: "Africa-first, globally aligned", desc: "Localized insights and templates tuned to African markets with global best practices.", icon: Globe },
    { title: "Serious about quality", desc: "ATS-friendly outputs, clear impact metrics, and clean design built-in.", icon: ShieldCheck },
    { title: "Complete Career Toolkit", desc: "KaziKit goes beyond to provide a comprehensive set of tools for career advancement.", icon: Sparkles },
    { title: "Growth you can see", desc: "Track skills and milestones with a clear path from first draft to hired.", icon: LineChart },
  ] as const

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 h-60 w-60 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 border-emerald-600/40 text-emerald-700 dark:text-emerald-400">Why choose Kazikit</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                Premium. Professional. Rooted in African excellence.
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
              We blend world-class standards with cultural authenticity to help you compete anywhere.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((it, idx) => (
            <Reveal key={it.title} delay={idx * 80}>
              <Card className="relative border-emerald-600/10 dark:border-emerald-400/10 overflow-hidden">
                <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-600/15 to-sky-600/15 blur-2xl" />
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br from-emerald-600 to-sky-600 text-white shadow">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-2">{it.title}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{it.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const people = [
    {
      name: "David K.",
      role: "Marketing Associate",
      quote: "As a recent graduate, I was struggling to create a professional resume. KaziKit made it simple and I received multiple interview calls.",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Lydia O.",
      role: "Data Analyst",
      quote: "The resume builder and skills tracker made my progress visible. I feel ready for global roles.",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Thandi D.",
      role: "Marketing Specialist",
      quote: "My cover photo is a life saver. Now I don't have to design from scratch everytime I need to change my LinkedIn cover photo.",
      avatar: "/placeholder-user.jpg",
    },
  ] as const

  return (
    <section id="testimonials" className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="outline" className="mb-3 border-emerald-600/40 text-emerald-700 dark:text-emerald-400">Testimonials</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                Real stories. Real momentum.
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
            Hear from professionals who have transformed their career journey with KaziKit.
            </p>
            <div className="inline-flex items-center justify-center space-x-1 pt-2">
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
                <Star className="h-5 w-5 fill-[#10B981] text-[#10B981]" />
            </div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Loved by early professionals across Africa</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 80}>
              <Card className="h-full border-emerald-600/10 dark:border-emerald-400/10">
                <CardHeader className="pb-3">
                <div className="flex items-center space-x-1 justify-end">
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={p.avatar || "/placeholder.svg"} alt={`${p.name} headshot`} />
                      <AvatarFallback>{p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <CardDescription>{p.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{'"'}{p.quote}{'"'}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 -top-10 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 border-sky-600/40 text-sky-700 dark:text-sky-400">Pricing</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Roast My CV—pick your plan
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
              Honest, instant feedback tailored to the African job market with global quality standards.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const Icon = plan.icon
            const highlight = plan.popular
            return (
              <Reveal key={plan.id} delay={idx * 80}>
                <Card
                  className={cn(
                    "relative overflow-hidden border-emerald-600/10 dark:border-emerald-400/10",
                    highlight && "ring-2 ring-emerald-600/60"
                  )}
                >
                  <div
                    className={cn(
                      "absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-20",
                      plan.color === "emerald" && "bg-emerald-500/30",
                      plan.color === "purple" && "bg-purple-600/30",
                      plan.color === "sky" && "bg-sky-500/30"
                    )}
                  />
                  {highlight && (
                    <div className="absolute right-4 top-4">
                      <Badge className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">Most popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg grid place-items-center text-white shadow",
                          plan.color === "emerald" && "bg-gradient-to-br from-emerald-600 to-emerald-700",
                          plan.color === "purple" && "bg-gradient-to-br from-purple-600 to-purple-700",
                          plan.color === "sky" && "bg-gradient-to-br from-sky-600 to-sky-700"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-semibold">{plan.price}</div>
                      {plan.period && <div className="text-muted-foreground">{plan.period}</div>}
                    </div>
                    <ul className="mt-4 grid gap-2 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={cn(
                        "w-full",
                        plan.color === "emerald" &&
                          "bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg",
                        plan.color === "purple" &&
                          "bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg",
                        plan.color === "sky" && "bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-lg"
                      )}
                    >
                      {plan.id === "free" ? "Start free" : `Choose ${plan.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Note: Resume builder, cover letters, cover photo generator, and skills tracker are included in the free toolkit during Beta. Roast My CV is a paid upgrade.
        </p>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faqs" className="relative py-16 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 border-emerald-600/40 text-emerald-700 dark:text-emerald-400">FAQs</Badge>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Questions, answered
              </span>
            </h3>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">Can’t find what you’re looking for? Reach out to our team any time.</p>
          </div>
        </Reveal>

        <div className="mt-8">
          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is Kazikit only for African job markets?</AccordionTrigger>
                <AccordionContent>
                  We{"'"}re proudly Africa-first with localized insights for markets like Kenya, Ghana, South Africa, and more—while aligning to global hiring standards so your materials travel anywhere.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What file types can I upload for Roast My CV?</AccordionTrigger>
                <AccordionContent>
                  PDF and DOCX work best. We{"'"}ll parse and evaluate your CV, then provide specific, prioritized improvements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Does the AI replace my judgment?</AccordionTrigger>
                <AccordionContent>
                  No. Kazikit augments your voice and experience with guidance and structure. You remain the author of your story.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use the tools free?</AccordionTrigger>
                <AccordionContent>
                  During Beta, yes. The toolkit is free to explore. Roast My CV is a paid add-on with monthly plans.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Do you support LinkedIn optimization?</AccordionTrigger>
                <AccordionContent>
                  Yes. You{"'"}ll get suggestions to strengthen your LinkedIn presence, including headline and About section tips.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section id="cta" className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border p-8 md:p-12 bg-background bg-gradient-to-r from-primary to-secondary">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 opacity-20 blur-3xl" />
            <div className="relative text-center flex justify-center flex-col items-center gap-3">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 bg-clip-text text-transparent">
                  Ready to build a career that travels?
                </span>
              </h3>
              <p className="mt-3 text-gray-100 max-w-prose">
                Join thousands of ambitious professionals leveling up with Kazikit.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg" asChild>
                  <Link href="/signup">Create free account</Link>
                </Button>
                <Button variant="outline" className="border-emerald-500/40 hover:border-emerald-500/70" asChild>
                  <Link href="/roast-my-cv">Try Roast My CV</Link>
                </Button>
              </div>
              <p className="mt-3 text-xs text-gray-200">
                No credit card required. Cancel anytime. Be among the first to shape the future of work in Africa.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
    <main className="relative overflow-x-hidden">
      {/* subtle base gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_80%_0%,rgba(2,132,199,.10),transparent)] dark:bg-[radial-gradient(1000px_600px_at_80%_0%,rgba(2,132,199,.15),transparent)]" />
      </div>

      <Hero />
      <AboutSection />
      <ToolsSection />
      <HowItWorks />
      <WhyChooseSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
    </main>
    <Footer />
    </div>
  )
}
