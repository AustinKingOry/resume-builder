"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Wrench,
  Mail,
  Activity,
  Server,
  Database,
  Zap,
  FileText,
  ImageIcon,
  PenLine,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layout/navbar"

// Types for status data
type StatusLevel = "operational" | "degraded" | "down" | "maintenance"
type FeatureStatus = "live" | "beta" | "coming-soon" | "maintenance"

interface SystemComponent {
  id: string
  name: string
  status: StatusLevel
  description?: string
  icon: any
}

interface Feature {
  id: string
  name: string
  status: FeatureStatus
  description: string
  icon: any
  lastUpdated?: string
}

interface Incident {
  id: string
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  severity: "minor" | "major" | "critical"
  startTime: string
  endTime?: string
  description: string
  updates: {
    time: string
    message: string
    status: string
  }[]
}

// Mock data - in production, this would come from your monitoring service
const systemComponents: SystemComponent[] = [
  { id: "api", name: "API Services", status: "operational", icon: Server },
  { id: "database", name: "Database", status: "operational", icon: Database },
  { id: "ai-services", name: "AI Processing", status: "operational", icon: Zap },
  { id: "file-storage", name: "File Storage", status: "operational", icon: Database },
]

const features: Feature[] = [
  {
    id: "resume-builder",
    name: "AI Resume Builder",
    status: "beta",
    description: "Create professional resumes with AI assistance",
    icon: FileText,
    lastUpdated: "2025-07-12",
  },
  {
    id: "cover-photo",
    name: "Cover Photo Generator",
    status: "beta",
    description: "Generate professional headshots",
    icon: ImageIcon,
    lastUpdated: "2025-04-22",
  },
  {
    id: "cover-letters",
    name: "Cover Letters",
    status: "coming-soon",
    description: "AI-powered cover letter generation",
    icon: PenLine,
  },
  {
    id: "roast-cv",
    name: "Roast My CV",
    status: "live",
    description: "Get honest feedback on your CV",
    icon: Flame,
    lastUpdated: "2025-08-15T23:50:00Z",
  },
  {
    id: "skills-tracker",
    name: "Skills Tracker",
    status: "coming-soon",
    description: "Track and validate your professional skills",
    icon: CheckCircle2,
  },
]

const recentIncidents: Incident[] = [
  {
    id: "inc-002",
    title: "Intermittent CV Upload Issues",
    status: "resolved",
    severity: "major",
    startTime: "2025-08-13T10:20:00Z",
    endTime: "2025-08-15T23:50:00Z",
    description: "Some users experienced issues uploading CV files",
    updates: [
      {
        time: "2025-08-13T10:20:00Z",
        message: "We're investigating reports of CV upload failures.",
        status: "investigating",
      },
      {
        time: "2025-08-13T13:20:00Z",
        message: "Issue identified with AI analysis timeout. Implementing fix.",
        status: "identified",
      },
      {
        time: "2025-08-15T23:50:00Z",
        message: "Fix deployed and verified. Upload functionality restored.",
        status: "resolved",
      },
    ],
  },
]

function getStatusColor(status: StatusLevel | FeatureStatus) {
  switch (status) {
    case "operational":
    case "live":
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800"
    case "beta":
      return "text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800"
    case "degraded":
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
    case "down":
      return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
    case "maintenance":
      return "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800"
    case "coming-soon":
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
  }
}

function getStatusIcon(status: StatusLevel | FeatureStatus) {
  switch (status) {
    case "operational":
    case "live":
      return <CheckCircle2 className="h-4 w-4" />
    case "beta":
      return <Activity className="h-4 w-4" />
    case "degraded":
      return <AlertTriangle className="h-4 w-4" />
    case "down":
      return <XCircle className="h-4 w-4" />
    case "maintenance":
      return <Wrench className="h-4 w-4" />
    case "coming-soon":
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusText(status: StatusLevel | FeatureStatus) {
  switch (status) {
    case "operational":
      return "Operational"
    case "live":
      return "Live"
    case "beta":
      return "Beta"
    case "degraded":
      return "Degraded"
    case "down":
      return "Down"
    case "maintenance":
      return "Maintenance"
    case "coming-soon":
      return "Coming Soon"
    default:
      return "Unknown"
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "minor":
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
    case "major":
      return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
    case "critical":
      return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

function OverallStatus() {
  const hasIssues = systemComponents.some((c) => c.status !== "operational")
  const overallStatus = hasIssues ? "degraded" : "operational"

  return (
    <Card className="border-2">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2">
          {overallStatus === "operational" ? (
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">
          {overallStatus === "operational" ? "All Systems Operational" : "Some Systems Experiencing Issues"}
        </CardTitle>
        <CardDescription>
          {overallStatus === "operational"
            ? "All Kazikit services are running smoothly"
            : "We're working to resolve any issues as quickly as possible"}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Components
        </CardTitle>
        <CardDescription>Current status of our core infrastructure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {systemComponents.map((component) => (
          <div key={component.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <component.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{component.name}</div>
                {component.description && <div className="text-sm text-muted-foreground">{component.description}</div>}
              </div>
            </div>
            <Badge variant="outline" className={cn("gap-1", getStatusColor(component.status))}>
              {getStatusIcon(component.status)}
              {getStatusText(component.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FeatureStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Feature Status
        </CardTitle>
        <CardDescription>Availability of Kazikit features and tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <feature.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{feature.name}</div>
                <div className="text-sm text-muted-foreground">{feature.description}</div>
                {feature.lastUpdated && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {formatDate(feature.lastUpdated)}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className={cn("gap-1", getStatusColor(feature.status))}>
              {getStatusIcon(feature.status)}
              {getStatusText(feature.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function IncidentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents & Maintenance</CardTitle>
        <CardDescription>Past 30 days of system events and scheduled maintenance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentIncidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-emerald-600" />
            <p>No incidents in the past 30 days</p>
          </div>
        ) : (
          recentIncidents.map((incident) => (
            <div key={incident.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium">{incident.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{formatDate(incident.startTime)}</span>
                    {incident.endTime && (
                      <>
                        <span>→</span>
                        <span>{formatDate(incident.endTime)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(incident.status as any)}>
                    {incident.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {incident.updates.map((update, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="text-muted-foreground whitespace-nowrap">{formatDate(update.time)}</div>
                    <div className="flex-1">{update.message}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function StatusUpdates() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function onSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" })
      return
    }

    setIsLoading(true)
    fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "status-updates" }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong")
        }
        toast({ title: "Subscribed!", description: "You'll receive status updates via email." })
        setEmail("")
      })
      .catch((err) => {
        toast({
          title: "Could not subscribe",
          description: err?.message || "Please try again shortly.",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Status Updates
        </CardTitle>
        <CardDescription>Get notified about incidents and maintenance windows</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3">
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
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white disabled:opacity-60"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function StatusPage() {
    return (
        <>
            <Navbar />
            <main className="relative overflow-x-hidden min-h-screen">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -top-20 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                <div className="mb-4">
                    <Button variant="ghost" asChild className="gap-2">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center text-white font-bold">
                    K
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Kazikit Status</h1>
                </div>
                <p className="text-muted-foreground">Real-time status and incident history for all Kazikit services</p>
                </div>

                {/* Overall Status */}
                <div className="mb-8">
                <OverallStatus />
                </div>

                {/* Status Sections */}
                <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-8">
                    <SystemStatus />
                    <StatusUpdates />
                </div>
                <div className="space-y-8">
                    <FeatureStatus />
                    <IncidentHistory />
                </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>
                    For support inquiries, contact us at{" "}
                    <a href="mailto:support@kazikit.com" className="text-emerald-600 hover:underline">
                    support@kazikit.com
                    </a>
                </p>
                <p className="mt-2">
                    Follow us on{" "}
                    <a href="#" className="text-emerald-600 hover:underline">
                    Twitter
                    </a>{" "}
                    for real-time updates
                </p>
                </div>
            </div>
            </main>
        </>
    )
}
