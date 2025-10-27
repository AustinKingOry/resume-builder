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
  ArrowRight,
  Loader2,
  Key,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ATSLoadingState } from "@/components/ats/loading-state"
import { useEdgeATSAnalysis } from "@/hooks/use-edge-ats"

interface AnalysisResult {
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
    sectionAnalysis: {
      section: string
      strength: number
      feedback: string
    }[]
    recommendations: {
      improvements: Array<{ category: string; title: string; description: string; priority: string; action: string }>
      atsWarnings: Array<{ warning: string; severity: string; suggestion: string }>
      bestPractices: Array<{ practice: string; benefit: string; implementation: string }>
    }
}

function UploadSection({
  onUpdate,
}: {
  onUpdate: (data: { resume: File | undefined; jobDescription: string | undefined }) => void
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
        onUpdate({ resume: file, jobDescription })
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

  function handleAnalyze() {
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
    onUpdate({ resume: resumeFile, jobDescription })
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
            onChange={(e) => {setJobDescription(e.target.value);
              onUpdate({ resume: resumeFile || undefined, jobDescription: e.target.value })
            }}
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
        <div className="mt-2 flex-1">
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}


const ImportanceIcon = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    "must-have": "bg-red-100 text-red-700",
    "nice-to-have": "bg-blue-100 text-blue-700",
    low: "bg-gray-100 text-gray-700",
  }

  return <Badge className={`${colors[level] || colors.low}`}>{level}</Badge>
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

  const handleExport = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analysis Results</h1>
            <p className="text-slate-600">Detailed ATS compatibility and job matching report</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Overall Score", score: analysis.overallScore, icon: Target },
            { title: "Keywords", score: analysis.keywordStrength, icon: Key },
            { title: "Skills Match", score: analysis.skillsMatch, icon: Award },
            { title: "ATS Ready", score: analysis.atsReady, icon: Zap },
          ].map((item) => (
            <ScoreCard key={item.title} label={item.title} score={item.score} icon={item.icon} />
          ))}
        </div>

        {/* Detailed Analysis Tabs */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-100">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="ats">ATS</TabsTrigger>
              <TabsTrigger value="recommendations">Tips</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            </TabsList>

            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-4 p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Keyword Analysis</h3>
                  <Badge className="bg-emerald-100 text-emerald-700">{analysis.keywords.matchPercentage}% Match</Badge>
                </div>
                <Progress value={analysis.keywords.matchPercentage} className="mb-4 h-3" />
                <p className="text-sm text-slate-600">{analysis.keywords.analysis}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Matched Keywords */}
                <div>
                  <h4 className="mb-3 font-semibold text-emerald-700">Matched Keywords</h4>
                  <div className="space-y-2">
                    {analysis.keywords.matchedKeywords.map((kw, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-slate-900">{kw.keyword}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">×{kw.frequency}</span>
                          <ImportanceIcon level={kw.importance} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h4 className="mb-3 font-semibold text-orange-700">Missing Keywords</h4>
                  <div className="space-y-2">
                    {analysis.keywords.missingKeywords.map((kw, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-slate-900">{kw.keyword}</span>
                          </div>
                          <p className="text-xs text-slate-600">{kw.reason}</p>
                        </div>
                        <ImportanceIcon level={kw.importance} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4 p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Skills Analysis</h3>
                  <Badge className="bg-blue-100 text-blue-700">{analysis.skills.matchPercentage}% Match</Badge>
                </div>
                <Progress value={analysis.skills.matchPercentage} className="mb-4 h-3" />
                <p className="text-sm text-slate-600">{analysis.skills.analysis}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Matched Skills */}
                <div>
                  <h4 className="mb-3 font-semibold text-emerald-700">Your Skills</h4>
                  <div className="space-y-2">
                    {analysis.skills.matchedSkills.map((skill, idx) => (
                      <div key={idx} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{skill.skill}</p>
                            <p className="text-xs text-slate-600">{skill.category}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className="w-fit bg-emerald-600 text-white text-xs">{skill.proficiency}</Badge>
                            <ImportanceIcon level={skill.importance} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h4 className="mb-3 font-semibold text-orange-700">Skills Gap</h4>
                  <div className="space-y-2">
                    {analysis.skills.missingSkills.map((skill, idx) => (
                      <div key={idx} className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{skill.skill}</p>
                            <p className="text-xs text-slate-600">{skill.category}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className="w-fit bg-orange-600 text-white text-xs">{skill.priority}</Badge>
                            <ImportanceIcon level={skill.importance} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ATS Tab */}
            <TabsContent value="ats" className="space-y-4 p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">ATS Compatibility</h3>
                  <Badge className="bg-blue-100 text-blue-700">{analysis.atsCompatibility.atsScore}% Ready</Badge>
                </div>
                <Progress value={analysis.atsCompatibility.atsScore} className="mb-4 h-3" />
                <p className="text-sm text-slate-600">{analysis.atsCompatibility.analysis}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Formatting */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Formatting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score</span>
                      <span className="text-lg font-bold">{analysis.atsCompatibility.formatting.score}%</span>
                    </div>
                    <Progress value={analysis.atsCompatibility.formatting.score} />
                    {analysis.atsCompatibility.formatting.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-orange-700">Issues:</p>
                        <ul className="mt-1 space-y-1">
                          {analysis.atsCompatibility.formatting.issues.map((issue, idx) => (
                            <li key={idx} className="text-xs text-slate-600">
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Structure */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score</span>
                      <span className="text-lg font-bold">{analysis.atsCompatibility.structure.score}%</span>
                    </div>
                    <Progress value={analysis.atsCompatibility.structure.score} />
                    {analysis.atsCompatibility.structure.missingSections.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-orange-700">Missing:</p>
                        <ul className="mt-1 space-y-1">
                          {analysis.atsCompatibility.structure.missingSections.map((section, idx) => (
                            <li key={idx} className="text-xs text-slate-600">
                              • {section}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Readability */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Readability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score</span>
                      <span className="text-lg font-bold">{analysis.atsCompatibility.readability.score}%</span>
                    </div>
                    <Progress value={analysis.atsCompatibility.readability.score} />
                    {analysis.atsCompatibility.readability.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-orange-700">Issues:</p>
                        <ul className="mt-1 space-y-1">
                          {analysis.atsCompatibility.readability.issues.map((issue, idx) => (
                            <li key={idx} className="text-xs text-slate-600">
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4 p-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Improvements</h3>
                <div className="space-y-3">
                  {analysis.recommendations.improvements.map((imp, idx) => (
                    <Card key={idx} className="border-slate-200">
                      <CardContent className="pt-6">
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">{imp.title}</h4>
                            <p className="mt-1 text-sm text-slate-600">{imp.description}</p>
                          </div>
                          <ImportanceIcon level={imp.priority} />
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3">
                          <p className="text-sm font-medium text-blue-900">Action:</p>
                          <p className="mt-1 text-sm text-blue-800">{imp.action}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* ATS Warnings */}
              {analysis.recommendations.atsWarnings.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-red-700">⚠️ ATS Warnings</h3>
                  <div className="space-y-3">
                    {analysis.recommendations.atsWarnings.map((warning, idx) => (
                      <Card key={idx} className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                          <div className="mb-2 flex items-start gap-3">
                            <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-red-900">{warning.warning}</p>
                              <p className="mt-1 text-sm text-red-800">{warning.suggestion}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Best Practices Tab */}
            <TabsContent value="best-practices" className="space-y-4 p-6">
              <div className="space-y-3">
                {analysis.recommendations.bestPractices.map((practice, idx) => (
                  <Card key={idx} className="border-emerald-200 bg-emerald-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-900">{practice.practice}</h4>
                          <p className="mt-1 text-sm text-emerald-800">{practice.benefit}</p>
                          <div className="mt-2 rounded bg-white p-2 text-sm text-slate-700">
                            <p className="font-medium text-slate-900">How to implement:</p>
                            <p className="mt-1">{practice.implementation}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default function ATSAnalyzerPage() {
  const { toast } = useToast()
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  // const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  const { analyzeCV, isAnalyzing: loading, result: analysis, error, reset } = useEdgeATSAnalysis();


  async function handleUpdate(data: { resume: File | undefined; jobDescription: string | undefined }) {    
    if(data.resume){
      setResumeFile(data.resume)
    }
    if(data.jobDescription){
      setJobDescription(data.jobDescription)
    }
  }

  const startAnalysis = async () => {
    // console.log(`Resume: ${resumeFile?.name}, Job Description: ${jobDescription}`)
    if (!resumeFile || !jobDescription) {
      toast({
        title: "Missing data",
        description: "Please upload a resume and paste the job description",
        variant: "destructive",
      })
      return
    }
    // setLoading(true)  
    try {
      await analyzeCV(resumeFile, { jobDescription: jobDescription.trim() });
      // const formData = new FormData()
      // formData.append("resume", resumeFile)
      // formData.append("jobDescription", jobDescription)

      // const response = await fetch("/api/ats", {
      //   method: "POST",
      //   body: formData,
      // })

      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.error || "Failed to analyze resume")
      // }

      // const res = await response.json()
      // setAnalysis(res.analysis)
      if(analysis !== null && !loading){
        setHasAnalyzed(true)
  
        toast({
          title: "Analysis complete!",
          description: "Your resume has been analyzed against the job description",
        })
      }
      
    } catch (err) {
      toast({
        title: "Analysis error!",
        description: err instanceof Error ? err.message : "An error occurred",
      })
    } 
    // finally {
    //   setLoading(false)
    // }
  }

  function handleReset() {
    setHasAnalyzed(false)
    // setAnalysis(null)
    setResumeFile(null)
    setJobDescription("")
    reset()
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
            <>
            <ATSLoadingState isOpen={loading} />
            <div className="space-y-6">
              {error && (
                <Card className="mt-8 border-red-200 bg-red-50">
                  <CardContent className="flex gap-3 pt-6">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-red-700">{error}</p>
                  </CardContent>
                </Card>
              )}
              <UploadSection onUpdate={handleUpdate} />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    startAnalysis()
                  }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                    Analyzing...
                  </>:
                  <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Resume
                  </>}
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
            </>
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