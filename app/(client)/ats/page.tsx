"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, FileText, Zap, Upload, Loader2, Download, ArrowRight } from "lucide-react"

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
  recommendations: {
    improvements: Array<{ category: string; title: string; description: string; priority: string; action: string }>
    atsWarnings: Array<{ warning: string; severity: string; suggestion: string }>
    bestPractices: Array<{ practice: string; benefit: string; implementation: string }>
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScoreBadge = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-orange-50 text-orange-700 border-orange-200"
  }

  return (
    <div className={`flex items-center justify-center rounded-lg border-2 p-4 ${getColor(score)}`}>
      <div className="text-center">
        <div className="text-3xl font-bold">{score}%</div>
        <div className="text-xs font-medium">Match Score</div>
      </div>
    </div>
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

export default function ATSAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [step, setStep] = useState<"upload" | "results">("upload")

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or DOCX file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      setResumeFile(file)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze resume")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setStep("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
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

  // Upload Step
  if (step === "upload") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
              ATS Analyzer
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Get AI-powered insights on how your resume matches the job description
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Resume Upload Card */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>PDF or DOCX (max 5MB)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                    <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PDF or DOCX file</p>
                  </label>
                </div>

                {resumeFile && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-medium text-emerald-900">{resumeFile.name}</p>
                      <p className="text-sm text-emerald-700">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description Card */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Paste Job Description
                </CardTitle>
                <CardDescription>The full job posting or description</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here. Include responsibilities, required skills, qualifications, and nice-to-have requirements..."
                  className="h-64 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-2 text-xs text-slate-500">More details = more accurate analysis</p>
              </CardContent>
            </Card>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mt-8 border-red-200 bg-red-50">
              <CardContent className="flex gap-3 pt-6">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips for Better Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>✓ Use the full job description for most accurate matching</p>
              <p>✓ Include both required and nice-to-have qualifications</p>
              <p>✓ Make sure your resume clearly lists all relevant skills and experience</p>
              <p>✓ Use keywords directly from the job posting when possible</p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={!resumeFile || !jobDescription.trim() || loading}
              size="lg"
              className="gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Results Step
  if (!analysis) return null

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
            <Button onClick={() => setStep("upload")} variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Overall Score", score: analysis.overallScore, icon: "📊" },
            { title: "Keywords", score: analysis.keywordStrength, icon: "🔑" },
            { title: "Skills Match", score: analysis.skillsMatch, icon: "💼" },
            { title: "ATS Ready", score: analysis.atsReady, icon: "✅" },
          ].map((item) => (
            <Card key={item.title} className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <p className="text-sm font-medium text-slate-600">{item.title}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{item.score}%</span>
                  <div className="mb-1 flex-1">
                    <Progress value={item.score} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
