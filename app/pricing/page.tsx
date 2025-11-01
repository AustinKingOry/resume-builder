"use client"

import { useState } from "react"
import { X, ChevronDown, CheckCircle2, Crown, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for exploring career tools",
      price: billingCycle === "monthly" ? 0 : 0,
      period: billingCycle === "monthly" ? "month" : "year",
      savings: billingCycle === "yearly" ? "1 month free" : null,
      highlighted: false,
      color: "sky",
      icon: Sparkles,
      features: [
        { name: "CV/Resume Analysis (Roast My CV)", included: true },
        { name: "Job Description Matching", included: true },
        { name: "Cover Letter Generation (5/month)", included: true },
        { name: "Skills Tracker", included: true },
        { name: "Resume Storage (3 versions)", included: true },
        { name: "Basic AI Insights", included: true },
        { name: "Community Forum Access", included: true },
        { name: "5 CV roasts per month", included: true },
        { name: "Standard AI processing", included: true },
        { name: "Core feedback summary", included: true },
        { name: "Priority Support", included: false },
        { name: "Advanced Analytics", included: false },
        { name: "Unlimited Cover Letters", included: false },
        { name: "Resume Optimization Suite", included: false },
      ],
      cta: "Get Started",
    },
    {
      name: "Hustler",
      description: "For active job seekers",
      price: billingCycle === "monthly" ? 100 : 1000,
      period: billingCycle === "monthly" ? "month" : "year",
      savings: billingCycle === "yearly" ? "1 month free" : null,
      highlighted: true,
      color: "emerald",
      icon: Zap,
      features: [
        { name: "CV/Resume Analysis (Roast My CV)", included: true },
        { name: "Job Description Matching", included: true },
        { name: "Cover Letter Generation (Unlimited)", included: true },
        { name: "Skills Tracker", included: true },
        { name: "Resume Storage (10 versions)", included: true },
        { name: "Advanced AI Insights", included: true },
        { name: "Community Forum Access", included: true },
        { name: "Priority Support", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Resume Optimization Suite", included: true },
        { name: "50 CV roasts per day", included: true },
        { name: "Priority AI processing", included: true },
        { name: "Advanced Kenya job market insights", included: true },
        { name: "Export to PDF & Word", included: true },
        { name: "Email support", included: true },
        { name: "LinkedIn optimization tips", included: true },
        { name: "Interview Prep Tools", included: false },
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      description: "For career professionals",
      price: billingCycle === "monthly" ? 300 : 3000,
      period: billingCycle === "monthly" ? "month" : "year",
      savings: billingCycle === "yearly" ? "1 month free" : null,
      highlighted: false,
      color: "purple",
      icon: Crown,
      features: [
        { name: "CV/Resume Analysis (Roast My CV)", included: true },
        { name: "Job Description Matching", included: true },
        { name: "Cover Letter Generation (Unlimited)", included: true },
        { name: "Skills Tracker", included: true },
        { name: "Resume Storage (Unlimited versions)", included: true },
        { name: "Advanced AI Insights", included: true },
        { name: "Community Forum Access", included: true },
        { name: "Priority Support", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Resume Optimization Suite", included: true },
        { name: "Interview Prep Tools", included: true },
        { name: "200 CV roasts per day", included: true },
        { name: "Instant AI processing", included: true },
        { name: "Industry-specific feedback", included: true },
        { name: "Custom CV templates", included: true },
        { name: "Priority support", included: true },
        { name: "Salary negotiation guidance", included: true },
        { name: "Career coaching insights", included: true },
      ],
      cta: "Start Free Trial",
    },
  ]

  const faqs = [
    {
      question: "What does the pricing include?",
      answer:
        'Our pricing covers full access to the Kazikit platform, including CV analysis, cover letter generation, skills tracking, job matching, and AI-powered career insights. The "Roast My CV" feature is just one component of our comprehensive platform.',
    },
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle, and we'll prorate any differences.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Professional and Premium tiers include a 14-day free trial with full access to all features. No credit card required to start.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Absolutely. You can cancel anytime from your account settings. Your access continues until the end of your billing period.",
    },
    {
      question: "Do you offer discounts for teams or organizations?",
      answer: "Yes! We offer custom pricing for teams of 10 or more. Contact our sales team for details.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlock your full career potential with Kazikit. Choose the plan that fits your journey.
          </p>
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-4 mb-4">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium text-center">
                ⚠️ Kazikit is currently in beta. Pricing does not apply during this phase and will only be applicable after
                the beta period concludes.
              </p>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground dark:hover:text-gray-600"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground dark:hover:text-gray-600"
                }`}
              >
                Yearly
                <span className="ml-2 inline-block px-2 py-1 text-xs bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.highlighted
                  ? "md:scale-105 md:shadow-2xl border-2 border-teal-500/50 bg-gradient-to-br from-card to-card/80"
                  : "border border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="pt-8">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg grid place-items-center text-white shadow",
                      plan.color === "emerald" && "bg-gradient-to-br from-emerald-600 to-emerald-700",
                      plan.color === "purple" && "bg-gradient-to-br from-purple-600 to-purple-700",
                      plan.color === "sky" && "bg-gradient-to-br from-sky-600 to-sky-700"
                    )}
                  >
                    <plan.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price === 0 ? "FREE" : `KSH ${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
                {plan.savings && (
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mt-2">{plan.savings}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                      : plan.color === "emerald" &&
                          "bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg",
                        plan.color === "purple" &&
                          "bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg",
                        plan.color === "sky" && "bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-lg"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex gap-3 items-start">
                      {feature.included ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-foreground" : "text-muted-foreground line-through"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Overview */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{`What's Included in Every Plan`}</h2>
          <p className="text-lg text-muted-foreground">Beyond Roast My CV, Kazikit is your complete career companion</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Resume Builder",
              description: "Craft world-class resumes with impact-driven bullet points, optimized for ATS and global markets.",
              icon: "🤖",
            },
            {
              title: "CV/Resume Analysis",
              description: "Get detailed feedback on your resume with actionable insights to improve your ATS score.",
              icon: "📄",
            },
            {
              title: "Cover Letter Generator",
              description: "Create personalized, compelling cover letters tailored to each job application.",
              icon: "✍️",
            },
            {
              title: "ATS Analyzer",
              description: "Scan and score your resume against job descriptions to reveal keyword gaps and boost ATS compatibility.",
              icon: "🎯",
            },
            {
              title: "Skills Tracker",
              description: "Monitor your skill development and track proficiency improvements over time.",
              icon: "📈",
            },
            {
              title: "Resume Storage",
              description: "Maintain multiple resume versions optimized for different industries.",
              icon: "💾",
            },
          ].map((feature, index) => (
            <Card key={index} className="border border-border bg-card/50 hover:bg-card transition-colors">
              <CardHeader>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our plans and features.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left font-semibold flex items-center justify-between hover:bg-slate-800 transition-colors"
              >
                <span className="text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-6 py-4 border-t border-border bg-slate-900">
                  <p className="text-muted-foreground dark:text-gray-300 ">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center border-t border-border">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Career?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of professionals using Kazikit to land their dream jobs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
          >
            Start Your Free Trial
          </Button>
          <Button size="lg" variant="outline">
            Schedule a Demo
          </Button>
        </div>
      </section>
    </main>
    <Footer />
    </div>
  )
}
