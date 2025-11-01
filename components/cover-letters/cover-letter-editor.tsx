"use client"

import { useState } from "react"
import Link from "next/link"
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
import type { CoverLetterEditorProps, CoverLetterStatus } from "@/lib/types/cover-letter"
import { CoverLettersDB } from "@/utils/supabaseClient"

const toneOptions = [
  { value: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { value: "confident", label: "Confident", description: "Assertive and self-assured" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and passionate" },
]

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

function AIAssistantPanel({
  coverLetterText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContentUpdate,
  selectedTone,
  onToneChange,
  isProcessing,
}: {
  coverLetterText: string
  onContentUpdate: (content: string) => void
  selectedTone: string
  onToneChange: (tone: string) => void
  isProcessing: boolean
}) {
  const [customPrompt, setCustomPrompt] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const { toast } = useToast()

  async function handleAnalyze() {
    if (!coverLetterText.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please write some content first",
        variant: "destructive",
      })
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch("/api/cover-letters/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: coverLetterText,
          customPrompt,
        }),
      })

      if (!response.ok) throw new Error("Failed to analyze")

      const data = await response.json()
      setSuggestions(data.suggestions || [])
      toast({
        title: "Analysis complete",
        description: "Check the suggestions below",
      })
    } catch (error) {
      console.error("[v0] Analyze error:", error)
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  async function handleQuickAction(action: string, label: string) {
    try {
      const response = await fetch("/api/cover-letters/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: coverLetterText,
          customPrompt: `Please ${action} my cover letter`,
        }),
      })

      if (!response.ok) throw new Error("Failed to process")

      toast({
        title: "Done!",
        description: `${label} your cover letter`,
      })
    } catch (error) {
      console.error("[v0] Quick action error:", error)
      toast({
        title: "Action failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
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
        <div>
          <Label className="text-xs font-medium mb-2 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Writing Tone
          </Label>
          <Select value={selectedTone} onValueChange={onToneChange}>
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
              disabled={isProcessing || isLoadingSuggestions}
            >
              <PenLine className="h-3.5 w-3.5 mr-2" />
              Expand content
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("shorten", "Shortening")}
              disabled={isProcessing || isLoadingSuggestions}
            >
              <Target className="h-3.5 w-3.5 mr-2" />
              Make more concise
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("improve", "Improving")}
              disabled={isProcessing || isLoadingSuggestions}
            >
              <Wand2 className="h-3.5 w-3.5 mr-2" />
              Improve clarity
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => handleQuickAction("personalize", "Personalizing")}
              disabled={isProcessing || isLoadingSuggestions}
            >
              <User className="h-3.5 w-3.5 mr-2" />
              Add personal details
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-xs font-medium mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Smart Suggestions
          </Label>
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border bg-card text-xs hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{`Click "Analyze" to get suggestions`}</p>
          )}
        </div>

        <Separator />

        <div>
          <Label className="text-xs font-medium mb-2">Ask AI to...</Label>
          <div className="space-y-2">
            <Textarea
              placeholder="e.g., 'Add more emphasis on my leadership experience' or 'Make the closing paragraph stronger'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
              disabled={isProcessing || isLoadingSuggestions}
            />
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white"
              onClick={handleAnalyze}
              disabled={isProcessing || isLoadingSuggestions || !coverLetterText.trim()}
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoverLetterEditor({ mode, initialData, onSave, isLoading, user }: CoverLetterEditorProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [letterTitle, setLetterTitle] = useState(initialData?.title || "New Cover Letter")
  const [company, setCompany] = useState(initialData?.company || "")
  const [position, setPosition] = useState(initialData?.position || "")
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || "")
  const [coverLetterText, setCoverLetterText] = useState(initialData?.content || "")
  const [selectedTone, setSelectedTone] = useState("professional")

  async function handleSave() {
    try {
      if (!coverLetterText.trim()) {
        toast({
          title: "No content to save",
          description: "Please write some content first",
          variant: "destructive",
        })
        return
      }
  
      setIsSaving(true)
  
      if(mode=="create"){
        const data = {
          title: letterTitle,
          company,
          position,
          jobDescription,
          content: coverLetterText,
          status: "complete" as CoverLetterStatus,
          wordCount: coverLetterText.split(/\s+/).length,
          downloads: initialData?.downloads || 0,
        }
        if(user){
          await CoverLettersDB.createCoverLetter(user.id, data);
        }
      } else {
        const data = {
          title: letterTitle,
          company,
          position,
          jobDescription,
          content: coverLetterText,
          status: "complete" as CoverLetterStatus,
          wordCount: coverLetterText.split(/\s+/).length,
          downloads: initialData?.downloads || 0,
        }
        if(initialData){
          await CoverLettersDB.updateCoverLetter(initialData?.id, data)
        }
      }
      toast({
        title: "Saved!",
        description: "Your cover letter has been saved successfully",
      })
      
      // if (onSave) {
      //   onSave({
      //     id: initialData?.id || Date.now().toString(),
      //     title: letterTitle,
      //     company,
      //     position,
      //     jobDescription,
      //     content: coverLetterText,
      //     status: "complete",
      //     createdAt: initialData?.createdAt || new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //     wordCount: coverLetterText.split(/\s+/).length,
      //     downloads: initialData?.downloads || 0,
      //   })
      // }
      
    } catch (error) {
      console.warn("Save error:", error)
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleGenerateWithAI() {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please add a job description to generate your cover letter",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    toast({
      title: "AI is generating...",
      description: "Creating a tailored cover letter based on the job description",
    })

    try {
      const response = await fetch("/api/cover-letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          company,
          position,
          tone: selectedTone,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setCoverLetterText(data.content)
      toast({
        title: "Cover letter generated!",
        description: "Review and edit the AI-generated content below",
      })
    } catch (error) {
      console.error("[v0] Generate error:", error)
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleDownload() {
    toast({
      title: "Downloading...",
      description: "Preparing your cover letter PDF",
    })
  }

  function handleCopy() {
    navigator.clipboard.writeText(coverLetterText)
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard",
    })
  }

  function handleReset() {
    setCoverLetterText(initialData?.content || "")
    toast({
      title: "Reset",
      description: "Cover letter reset to original content",
    })
  }

  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cover-letters">
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
                {company && (
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {company}
                  </Badge>
                )}
                {position && (
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {position}
                  </Badge>
                )}
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

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Job Details</CardTitle>
                  </div>
                  {mode === "create" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateWithAI}
                      disabled={isGenerating || company == "" || position == ""}
                      className="bg-transparent"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3.5 w-3.5 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  )}
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
                      placeholder="e.g., Safaricom PLC"
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
                      placeholder="e.g., Software Engineer"
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

            <Card className="flex-1">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-muted-foreground" />
                    Your Cover Letter
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8" onClick={handleCopy}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8" onClick={handleReset}>
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

          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="h-[calc(100vh-8rem)] border-emerald-600/20">
              <AIAssistantPanel
                coverLetterText={coverLetterText}
                onContentUpdate={setCoverLetterText}
                selectedTone={selectedTone}
                onToneChange={setSelectedTone}
                isProcessing={isGenerating}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
