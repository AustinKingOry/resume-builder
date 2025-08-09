"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ChefHat, Clock, ArrowLeft, Mail, Sparkles } from "lucide-react"

export default function CookingPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  function onNotify(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" })
      return
    }
    toast({ title: "You’re on the list!", description: "We’ll email you when this feature goes live." })
    setEmail("")
  }

  return (
    <main className="relative overflow-x-hidden">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -top-20 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <section className="relative pt-24 pb-10 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-3 border-emerald-600/40 text-emerald-700 dark:text-emerald-400">
                Coming soon
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                We{"'"}re cooking something special
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-prose">
                This part of Kazikit is simmering in our kitchen. We{"'"}re perfecting the recipe—rooted in African
                excellence, powered by AI—so you can build a career that travels.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg"
                >
                  <Link href="#notify">Notify me</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Explore live features</Link>
                </Button>
              </div>

              <ul className="mt-6 grid gap-2 text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-emerald-600" /> Crafted with care for African professionals
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-600" /> Launching soon—join the early access list
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Polished, practical, and globally aligned
                </li>
              </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden ring-1 ring-border/60 min-h-[320px] md:min-h-[420px]">
              <Image
                src="/images/cooking.svg"
                alt="Illustration of ideas cooking: pot with African motifs in emerald and blue"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/0 to-transparent" />
            </div>
          </div>

          <div id="notify" className="mt-10">
            <Card className="relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl bg-gradient-to-br from-emerald-600/30 to-sky-600/30" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Get notified</CardTitle>
                <CardDescription>Be the first to know when this feature goes live.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={onNotify} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      aria-label="Email address"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white"
                  >
                    Notify me
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
