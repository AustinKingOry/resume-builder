/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import Link from "next/link"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  X,
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Award,
  Briefcase,
  ArrowLeft,
  Download,
  Share2,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisResult {
  overallScore: number
  keywordMatches: {
    matched: string[]
    missing: string[]
    strength: number
  }
  skillsAnalysis: {
    matched: { skill: string; importance: "high" | "medium" | "low" }[]
    missing: { skill: string; importance: "high" | "medium" | "low" }[]
    score: number
  }
  atsCompatibility: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  sectionAnalysis: {
    section: string
    strength: number
    feedback: string
  }[]
  recommendations: string[]
}

interface AnalysisResult2 {
    overallScore: number
    keywordStrength: number
    skillsMatch: number
    atsReady: number
    keywords: {
      matchedKeywords: Array<{ keyword: string; frequency: number; importance: string }>
      missingKeywords: Array<{ keyword: string; importance: string; reason: string }>
      matchPercentage: number
      analysis: string
    }
    skills: {
      matchedSkills: Array<{ skill: string; category: string; proficiency: string; importance: string }>
      missingSkills: Array<{ skill: string; category: string; priority: string; importance: string }>
      matchPercentage: number
      skillGaps: string[]
      analysis: string
    }
    atsCompatibility: {
      atsScore: number
      formatting: { score: number; issues: string[]; suggestions: string[] }
      structure: { score: number; sections: string[]; missingSections: string[] }
      readability: { score: number; issues: string[] }
      analysis: string
    }
    recommendations: {
      improvements: Array<{ category: string; title: string; description: string; priority: string; action: string }>
      atsWarnings: Array<{ warning: string; severity: string; suggestion: string }>
      bestPractices: Array<{ practice: string; benefit: string; implementation: string }>
    }
  }

const mockAnalysis: AnalysisResult = {
  overallScore: 78,
  keywordMatches: {
    matched: ["React", "Node.js", "AWS", "Docker", "Agile", "REST API", "PostgreSQL", "Git", "CI/CD", "Microservices"],
    missing: ["Kubernetes", "GraphQL", "Machine Learning", "Data Pipeline", "Real-time Systems", "Load Balancing"],
    strength: 85,
  },
  skillsAnalysis: {
    matched: [
      { skill: "Full-Stack Development", importance: "high" },
      { skill: "Cloud Infrastructure", importance: "high" },
      { skill: "Team Leadership", importance: "medium" },
      { skill: "System Design", importance: "high" },
      { skill: "Containerization", importance: "medium" },
      { skill: "Database Management", importance: "medium" },
    ],
    missing: [
      { skill: "Advanced DevOps", importance: "high" },
      { skill: "ML/AI Integration", importance: "low" },
      { skill: "Kubernetes Orchestration", importance: "high" },
    ],
    score: 76,
  },
  atsCompatibility: {
    score: 82,
    issues: ["Missing some technical keywords", "Could expand on specific technologies"],
    suggestions: [
      "Add specific project metrics and quantifiable results",
      "Include more industry-standard terminology",
      "Enhance technical skills section with relevant tools",
    ],
  },
  sectionAnalysis: [
    {
      section: "Header & Contact",
      strength: 95,
      feedback: "Professional and complete",
    },
    {
      section: "Summary",
      strength: 72,
      feedback: "Good but could emphasize key technologies more",
    },
    {
      section: "Experience",
      strength: 81,
      feedback: "Well-detailed with good achievement metrics",
    },
    {
      section: "Skills",
      strength: 68,
      feedback: "Missing some relevant technical stack items",
    },
    {
      section: "Education",
      strength: 88,
      feedback: "Clear and relevant certifications included",
    },
  ],
  recommendations: [
    "Add Kubernetes and container orchestration experience if applicable",
    "Highlight any experience with real-time systems or event-driven architecture",
    "Include specific metrics for system performance improvements",
    "Add any GraphQL experience if you have it - it's mentioned in the job description",
    "Expand on your AWS experience with specific services used (Lambda, RDS, etc.)",
  ],
}

function UploadSection({
  onAnalyze,
}: {
  onAnalyze: (data: { resume: File | null; jobDescription: string }) => void
}) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(file)
        toast({
          title: "Resume uploaded",
          description: `${file.name} ready for analysis`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        })
      }
    }
  }

  async function handleAnalyze() {
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume first",
        variant: "destructive",
      })
      return
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    await onAnalyze({ resume: resumeFile, jobDescription })
    setIsAnalyzing(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Resume Upload */}
      <Card className="border-emerald-600/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Your Resume
          </CardTitle>
          <CardDescription>Upload your resume for ATS analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              resumeFile
                ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-muted-foreground/25 hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10",
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {resumeFile ? (
              <div className="space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-medium text-sm">{resumeFile.name}</p>
                <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setResumeFile(null)
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Change file
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium text-sm">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF or Word document (max 5MB)</p>
                </div>
              </div>
            )}
          </div>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-sm">
              💡 Tip: Make sure your resume clearly lists all relevant skills and experience for the best analysis
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Job Description Input */}
      <Card className="border-sky-600/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-sky-600" />
            Job Description
          </CardTitle>
          <CardDescription>{"Paste the job description you're applying for"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the full job description here. Include all requirements, qualifications, and responsibilities..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[250px] font-sm"
          />

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              The more detailed the job description, the more accurate your ATS score will be
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
  const getColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-600"
    if (score >= 60) return "from-yellow-500 to-yellow-600"
    return "from-orange-500 to-orange-600"
  }

  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center mb-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className={cn("text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", getColor(score))}>
          {score}%
        </div>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

function AnalysisResults({ analysis }: { analysis: AnalysisResult }) {
  const { toast } = useToast()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <div className="space-y-6">
      {/* Overall Scores */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
          Analysis Results
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <ScoreCard label="Overall Match" score={analysis.overallScore} icon={Target} />
          <ScoreCard label="Keywords" score={analysis.keywordMatches.strength} icon={Sparkles} />
          <ScoreCard label="Skills" score={analysis.skillsAnalysis.score} icon={Award} />
          <ScoreCard label="ATS Ready" score={analysis.atsCompatibility.score} icon={Zap} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="recommendations">Tips</TabsTrigger>
        </TabsList>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keyword Analysis</CardTitle>
              <CardDescription>How well your resume matches job description keywords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Matched Keywords */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Matched Keywords ({analysis.keywordMatches.matched.length})
                  </Label>
                  <span className="text-xs text-emerald-600 font-medium">
                    {Math.round(
                      (analysis.keywordMatches.matched.length /
                        (analysis.keywordMatches.matched.length + analysis.keywordMatches.missing.length)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatches.matched.map((keyword) => (
                    <Badge
                      key={keyword}
                      className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    >
                      ✓ {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Missing Keywords ({analysis.keywordMatches.missing.length})
                  </Label>
                  <span className="text-xs text-orange-600 font-medium">
                    {Math.round(
                      (analysis.keywordMatches.missing.length /
                        (analysis.keywordMatches.matched.length + analysis.keywordMatches.missing.length)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatches.missing.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="border-orange-200 text-orange-700 dark:border-orange-900 dark:text-orange-300"
                    >
                      ✗ {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Keyword Match Strength</span>
                  <span className="text-sm font-semibold">{analysis.keywordMatches.strength}%</span>
                </div>
                <Progress value={analysis.keywordMatches.strength} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills Match</CardTitle>
              <CardDescription>Your skills vs. job requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Matched Skills */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Matched Skills ({analysis.skillsAnalysis.matched.length})
                </Label>
                <div className="space-y-2">
                  {analysis.skillsAnalysis.matched.map((skill) => (
                    <div
                      key={skill.skill}
                      className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20"
                    >
                      <span className="text-sm">{skill.skill}</span>
                      <Badge
                        className={cn(
                          "text-xs",
                          skill.importance === "high"
                            ? "bg-emerald-600"
                            : skill.importance === "medium"
                              ? "bg-emerald-500"
                              : "bg-emerald-400",
                        )}
                      >
                        {skill.importance} importance
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Missing Skills ({analysis.skillsAnalysis.missing.length})
                </Label>
                <div className="space-y-2">
                  {analysis.skillsAnalysis.missing.map((skill) => (
                    <div
                      key={skill.skill}
                      className="flex items-center justify-between p-2 rounded-lg bg-orange-50/50 dark:bg-orange-950/20"
                    >
                      <span className="text-sm">{skill.skill}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          skill.importance === "high"
                            ? "border-orange-600 text-orange-700 dark:border-orange-400 dark:text-orange-300"
                            : skill.importance === "medium"
                              ? "border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-300"
                              : "border-orange-400 text-orange-600 dark:border-orange-400 dark:text-orange-300",
                        )}
                      >
                        {skill.importance} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Skills Match Score</span>
                  <span className="text-sm font-semibold">{analysis.skillsAnalysis.score}%</span>
                </div>
                <Progress value={analysis.skillsAnalysis.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Strength</CardTitle>
              <CardDescription>How well each resume section aligns with the role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.sectionAnalysis.map((section) => (
                <div key={section.section} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{section.section}</Label>
                    <span className={cn("text-sm font-semibold", getScoreColor(section.strength))}>
                      {section.strength}%
                    </span>
                  </div>
                  <Progress value={section.strength} className="h-2" />
                  <p className="text-xs text-muted-foreground">{section.feedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Improvement Recommendations</CardTitle>
              <CardDescription>Actionable tips to increase your match score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900"
                  >
                    <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-200">{recommendation}</p>
                  </div>
                ))}
              </div>

              {/* ATS Issues */}
              <div className="mt-6 pt-6 border-t">
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ATS Compatibility Issues
                </Label>
                <div className="space-y-2">
                  {analysis.atsCompatibility.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <span className="text-yellow-600">•</span>
                      <span className="text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ATSAnalyzerPage() {
  const { toast } = useToast()
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  async function handleAnalyze(data: { resume: File | null; jobDescription: string }) {    
    if(!data.resume){
      toast({
        title: "Resume required",
        description: "Please upload your resume first",
        variant: "destructive",
      })
      return
    }
    
    setResumeFile(data.resume)
    setJobDescription(data.jobDescription)
    try {
        const formData = new FormData()
        formData.append("resume", data.resume)
        formData.append("jobDescription", jobDescription)
  
        const response = await fetch("/api/ats", {
          method: "POST",
          body: formData,
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to analyze resume")
        }
  
        const res = await response.json()
        setAnalysis(res.analysis)
        setHasAnalyzed(true)

        toast({
          title: "Analysis complete!",
          description: "Your resume has been analyzed against the job description",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    // setAnalysis(mockAnalysis)
    // setHasAnalyzed(true)
  }

  function handleReset() {
    setHasAnalyzed(false)
    setAnalysis(null)
    setResumeFile(null)
    setJobDescription("")
  }

  function handleExport() {
    toast({
      title: "Exporting...",
      description: "Your analysis report is being prepared",
    })
    if (!analysis) return
    const dataStr = JSON.stringify(analysis, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ats-analysis-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  return (
    <>

      <main className="relative overflow-x-hidden min-h-screen">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/resumes">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                  ATS Analyzer
                </h1>
                <p className="text-muted-foreground">
                  Analyze how well your resume matches job descriptions and get actionable insights
                </p>
              </div>
            </div>
          </div>

          {!hasAnalyzed ? (
            // Initial Upload State
            <div className="space-y-6">
              <UploadSection onAnalyze={handleAnalyze} />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    handleAnalyze({ resume: resumeFile, jobDescription })
                  }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Resume
                </Button>
              </div>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-12 pt-8 border-t">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/10 border-emerald-200 dark:border-emerald-900">
                  <CardContent className="pt-6">
                    <Target className="h-8 w-8 text-emerald-600 mb-2" />
                    <h3 className="font-semibold mb-1">Smart Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI engine matches your skills against job requirements with precision
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-sky-50 to-sky-50/50 dark:from-sky-950/20 dark:to-sky-950/10 border-sky-200 dark:border-sky-900">
                  <CardContent className="pt-6">
                    <TrendingUp className="h-8 w-8 text-sky-600 mb-2" />
                    <h3 className="font-semibold mb-1">Detailed Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a complete breakdown of strengths and areas for improvement
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10 border-purple-200 dark:border-purple-900">
                  <CardContent className="pt-6">
                    <Award className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold mb-1">Actionable Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive specific recommendations to increase your match score
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Results State
            <div className="space-y-6">
              {/* Top Bar with Actions */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-200/30">
                <div>
                  <h2 className="font-semibold">{resumeFile?.name}</h2>
                  <p className="text-sm text-muted-foreground">Analysis completed</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport} className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Share link copied",
                        description: "Analysis link copied to clipboard",
                      })
                    }
                    className="bg-transparent"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    New Analysis
                  </Button>
                </div>
              </div>

              {/* Analysis Results */}
              {analysis && <AnalysisResults analysis={analysis} />}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
