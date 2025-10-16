"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  Wand2,
  Copy,
  RotateCcw,
  Building2,
  Briefcase,
  FileText,
  MessageSquare,
  Bold,
  Italic,
  List,
  AlignLeft,
  ChevronDown,
  Loader2,
  Check,
  PenLine,
  Zap,
  Target,
  User,
} from "lucide-react"

const toneOptions = [
  { value: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { value: "confident", label: "Confident", description: "Assertive and self-assured" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
]

const aiSuggestions = [
  { id: "1", text: "Emphasize your experience with cross-functional teams", action: "highlight-experience" },
  { id: "2", text: "Add specific metrics from your previous role", action: "add-metrics" },
  { id: "3", text: "Tailor the opening to the company's mission", action: "customize-opening" },
]

function DashboardHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center text-white font-bold">
            K
          </div>
          <span className="text-lg font-semibold">Kazikit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard/resumes" className="text-sm text-muted-foreground hover:text-foreground">
            My Resumes
          </Link>
          <Link href="/dashboard/cover-letters" className="text-sm font-medium">
            Cover Letters
          </Link>
          <Link href="/dashboard/profile" className="text-sm text-muted-foreground hover:text-foreground">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/status">Status</Link>
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

function EditorToolbar() {
  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Italic className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <List className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <span className="text-sm">Normal</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Heading 1</DropdownMenuItem>
          <DropdownMenuItem>Heading 2</DropdownMenuItem>
          <DropdownMenuItem>Normal</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function AIAssistantPanel() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTone, setSelectedTone] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")
  const { toast } = useToast()

  function handleQuickAction(action: string, label: string) {
    setIsProcessing(true)
    toast({
      title: "AI is working...",
      description: `${label} your cover letter`,
    })
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Done!",
        description: "Your cover letter has been updated",
      })
    }, 2000)
  }

  function handleCustomPrompt() {
    if (!customPrompt.trim()) return
    setIsProcessing(true)
    toast({
      title: "AI is working...",
      description: "Processing your request",
    })
    setTimeout(() => {
      setIsProcessing(false)
      setCustomPrompt("")
      toast({
        title: "Updated!",
        description: "Changes applied to your cover letter",
      })
    }, 2000)
  }

  function handleApplySuggestion(suggestion: (typeof aiSuggestions)[0]) {
    toast({
      title: "Suggestion applied",
      description: suggestion.text,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Refine and improve your letter</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Tone Selection */}
        <div>
          <Label className="text-xs font-medium mb-2 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Writing Tone
          </Label>
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <Label className="text-xs font-medium mb-2 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Quick Actions
          </Label>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("expand", "Expanding")}
              disabled={isProcessing}
            >
              <PenLine className="h-3.5 w-3.5 mr-2" />
              Expand content
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("shorten", "Shortening")}
              disabled={isProcessing}
            >
              <Target className="h-3.5 w-3.5 mr-2" />
              Make more concise
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("improve", "Improving")}
              disabled={isProcessing}
            >
              <Wand2 className="h-3.5 w-3.5 mr-2" />
              Improve clarity
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("personalize", "Personalizing")}
              disabled={isProcessing}
            >
              <User className="h-3.5 w-3.5 mr-2" />
              Add personal details
            </Button>
          </div>
        </div>

        <Separator />

        {/* AI Suggestions */}
        <div>
          <Label className="text-xs font-medium mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Smart Suggestions
          </Label>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-2.5 rounded-lg border bg-card text-xs hover:border-emerald-500/50 cursor-pointer transition-colors"
                onClick={() => handleApplySuggestion(suggestion)}
              >
                <div className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{suggestion.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom Prompt */}
        <div>
          <Label className="text-xs font-medium mb-2">Ask AI to...</Label>
          <div className="space-y-2">
            <Textarea
              placeholder="e.g., 'Add more emphasis on my leadership experience' or 'Make the closing paragraph stronger'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
              disabled={isProcessing}
            />
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white"
              onClick={handleCustomPrompt}
              disabled={isProcessing || !customPrompt.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  Apply Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditCoverLetterPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [letterTitle, setLetterTitle] = useState("Marketing Lead at Andela")
  const [company, setCompany] = useState("Andela")
  const [position, setPosition] = useState("Digital Marketing Lead")
  const [jobDescription, setJobDescription] = useState(
    "We're seeking a Digital Marketing Lead to drive our marketing strategy across African markets. You'll lead campaigns, manage budgets, and build our brand presence...",
  )
  const [coverLetterText, setCoverLetterText] = useState(
    "Dear Recruitment Team,\n\nWith over five years of experience in digital marketing across African markets, I am excited to apply for the Digital Marketing Lead position at Andela. Your mission to connect African talent with global opportunities resonates deeply with me, and I believe my background in growth marketing and community building makes me an ideal fit.\n\nIn my current role at [Company], I've successfully:\n• Increased user acquisition by 150% through targeted campaigns\n• Built and managed a monthly marketing budget of $50,000\n• Led a team of 5 marketing specialists across 3 countries\n• Grew social media following from 10K to 100K in 18 months\n\nWhat draws me to Andela is your focus on creating economic opportunities across Africa. I've built my career on similar principles, developing marketing strategies that not only drive business growth but also empower local communities.\n\nI would love the opportunity to bring my expertise in digital marketing and passion for African tech to your team.\n\nThank you for your consideration.\n\nWarm regards,\n[Your Name]",
  )

  function handleSave() {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Saved!",
        description: "Your changes have been saved",
      })
    }, 1000)
  }

  function handleDownload() {
    toast({
      title: "Downloading...",
      description: "Preparing your cover letter PDF",
    })
  }

  return (
    <>
      <DashboardHeader />

      <main className="relative overflow-x-hidden min-h-screen">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-6">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/cover-letters">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <Input
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                />
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {company}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {position}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Left Column - Editor */}
            <div className="space-y-4">
              {/* Job Details */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Job Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Andela"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="position" className="text-xs">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g., Marketing Lead"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="job-description" className="text-xs">
                      Job Description
                    </Label>
                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter Editor */}
              <Card className="flex-1">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-muted-foreground" />
                      Your Cover Letter
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <EditorToolbar />
                <CardContent className="pt-0">
                  <Textarea
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    className="min-h-[500px] font-serif leading-relaxed border-none shadow-none focus-visible:ring-0 resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - AI Assistant */}
            <div className="lg:sticky lg:top-6 h-fit">
              <Card className="h-[calc(100vh-8rem)] border-emerald-600/20">
                <AIAssistantPanel />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
