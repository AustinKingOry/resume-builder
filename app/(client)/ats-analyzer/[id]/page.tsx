/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, ArrowLeft, Download, Share2, ArrowRight, Target, Key, Award, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ATSAnalysisResult } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { AtsDB } from "@/utils/supabaseClient"


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

function AnalysisResults({ analysis }: { analysis: ATSAnalysisResult }) {

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

                
              {/* <Card>
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
              </Card> */}
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

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-2 border-slate-200">
            <CardContent className="pt-6">
              <Skeleton className="mb-3 h-6 w-12" />
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-slate-200">
        <Skeleton className="h-12 w-full rounded-t-lg" />
        <CardContent className="space-y-4 pt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
)

export default function ATSDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
    const {user, isLoading: userLoading} = useAuth();

  const testId = params.id as string

  useEffect(() => {
    if (userLoading) return; // Wait until auth state resolves
    if (!user?.id) return; // If no user, do not load resumes

    let isCancelled = false;
    
    const fetchAnalysis = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await AtsDB.fetchTestAnalyis(testId);
        if (!data) {
          setError("Test analysis not found")
          return
        }
        if (!isCancelled) setAnalysis(data);
      } catch (error) {
        console.error("Failed to load tests:", error);
        setError(error instanceof Error ? error.message : "Failed to load analysis")
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchAnalysis()

    return () => {
      isCancelled = true;
    };
  }, [testId, user?.id, userLoading])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-7xl">
          <Button onClick={() => router.back()} variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex gap-3 pt-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-red-700">{error || "Analysis not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Button onClick={() => router.back()} variant="outline" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">{analysis.summary?.candidateName}</h1>
            <p className="mt-2 text-lg text-slate-600">
              {analysis.summary?.jobTitle || ""} • {new Date(analysis.summary?.testDate || 0).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <AnalysisResults analysis={analysis} />
      </div>
    </div>
  )
}
