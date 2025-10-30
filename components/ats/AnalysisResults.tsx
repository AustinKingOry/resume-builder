/* eslint-disable @typescript-eslint/no-explicit-any */
import { ATSAnalysisResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Download, ArrowRight, Target, Key, Award, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const ImportanceIcon = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      "must-have": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "nice-to-have": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      low: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    }
  
    return <Badge className={`${colors[level] || colors.low}`}>{level}</Badge>
}

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
    const getColor = (score: number) => {
        if (score >= 80) return "from-emerald-500 to-emerald-600 dark:to-emerald-400"
        if (score >= 60) return "from-yellow-500 to-yellow-600 dark:to-yellow-400"
        return "from-orange-500 to-orange-600 dark:to-orange-400"
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

export default function AnalysisResults({ analysis, isNew = true }: { analysis: ATSAnalysisResult, isNew: boolean }) {

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
            <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                {isNew ? 
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analysis Results</h1>
                    <p className="text-slate-600 dark:text-slate-400">Detailed ATS compatibility and job matching report</p>
                </div> :
                analysis.summary &&
                <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{analysis.summary?.candidateName}</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    {analysis.summary?.jobTitle || ""} • {new Date(analysis.summary?.testDate || 0).toLocaleDateString()}
                </p>
                </div>}
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
            <Card className="border-2 border-slate-200 shadow-lg dark:border-slate-800">
                <Tabs defaultValue="keywords" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-900">
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
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Keyword Analysis</h3>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:text-slate-300 dark:bg-emerald-900">{analysis.keywords.matchPercentage}% Match</Badge>
                    </div>
                    <Progress value={analysis.keywords.matchPercentage} className="mb-4 h-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.keywords.analysis}</p>
                    </div>
    
                    <div className="grid gap-6 lg:grid-cols-2">
                    {/* Matched Keywords */}
                    <div>
                        <h4 className="mb-3 font-semibold text-emerald-700">Matched Keywords</h4>
                        <div className="space-y-2">
                        {analysis.keywords.matchedKeywords.map((kw, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">{kw.keyword}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 dark:text-slate-400">×{kw.frequency}</span>
                                <ImportanceIcon level={kw.importance} />
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
    
                    {/* Missing Keywords */}
                    <div>
                        <h4 className="mb-3 font-semibold text-orange-700 dark:text-orange-300">Missing Keywords</h4>
                        <div className="space-y-2">
                        {analysis.keywords.missingKeywords.map((kw, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-600" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">{kw.keyword}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{kw.reason}</p>
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
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Skills Analysis</h3>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{analysis.skills.matchPercentage}% Match</Badge>
                    </div>
                    <Progress value={analysis.skills.matchPercentage} className="mb-4 h-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.skills.analysis}</p>
                    </div>
    
                    <div className="grid gap-6 lg:grid-cols-2">
                    {/* Matched Skills */}
                    <div>
                        <h4 className="mb-3 font-semibold text-emerald-700 dark:text-emerald-300">Your Skills</h4>
                        <div className="space-y-2">
                        {analysis.skills.matchedSkills.map((skill, idx) => (
                            <div key={idx} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950">
                            <div className="flex items-start justify-between">
                                <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{skill.skill}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{skill.category}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                <Badge className="w-fit bg-emerald-600 text-white text-xs dark:bg-emerald-400 dark:text-black">{skill.proficiency}</Badge>
                                <ImportanceIcon level={skill.importance} />
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
    
                    {/* Missing Skills */}
                    <div>
                        <h4 className="mb-3 font-semibold text-orange-700 dark:text-orange-300">Skills Gap</h4>
                        <div className="space-y-2">
                        {analysis.skills.missingSkills.map((skill, idx) => (
                            <div key={idx} className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
                            <div className="flex items-start justify-between">
                                <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{skill.skill}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{skill.category}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                <Badge className="w-fit bg-orange-600 text-white text-xs dark:bg-orange-400 dark:text-black">{skill.priority}</Badge>
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
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">ATS Compatibility</h3>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{analysis.atsCompatibility.atsScore}% Ready</Badge>
                    </div>
                    <Progress value={analysis.atsCompatibility.atsScore} className="mb-4 h-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.atsCompatibility.analysis}</p>
                    </div>
    
                    <div className="grid gap-6 lg:grid-cols-3">
                    {/* Formatting */}
                    <Card className="border-slate-200 dark:border-slate-800">
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
                            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">Issues:</p>
                            <ul className="mt-1 space-y-1">
                                {analysis.atsCompatibility.formatting.issues.map((issue, idx) => (
                                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                                    • {issue}
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}
                        </CardContent>
                    </Card>
    
                    {/* Structure */}
                    <Card className="border-slate-200 dark:border-slate-800">
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
                            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">Missing:</p>
                            <ul className="mt-1 space-y-1">
                                {analysis.atsCompatibility.structure.missingSections.map((section, idx) => (
                                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                                    • {section}
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}
                        </CardContent>
                    </Card>
    
                    {/* Readability */}
                    <Card className="border-slate-200 dark:border-slate-800">
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
                            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">Issues:</p>
                            <ul className="mt-1 space-y-1">
                                {analysis.atsCompatibility.readability.issues.map((issue, idx) => (
                                <li key={idx} className="text-xs text-slate-600 dark:text-slate-400">
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
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Improvements</h3>
                    <div className="space-y-3">
                        {analysis.recommendations.improvements.map((imp, idx) => (
                        <Card key={idx} className="border-slate-200 dark:border-slate-800">
                            <CardContent className="pt-6">
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{imp.title}</h4>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{imp.description}</p>
                                </div>
                                <ImportanceIcon level={imp.priority} />
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Action:</p>
                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">{imp.action}</p>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    </div>
    
                    {/* ATS Warnings */}
                    {analysis.recommendations.atsWarnings.length > 0 && (
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-red-700 dark:text-red-300">⚠️ ATS Warnings</h3>
                        <div className="space-y-3">
                        {analysis.recommendations.atsWarnings.map((warning, idx) => (
                            <Card key={idx} className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                            <CardContent className="pt-6">
                                <div className="mb-2 flex items-start gap-3">
                                <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                                <div className="flex-1">
                                    <p className="font-semibold text-red-900 dark:text-red-100">{warning.warning}</p>
                                    <p className="mt-1 text-sm text-red-800 dark:text-red-200">{warning.suggestion}</p>
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
                        <Card key={idx} className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">{practice.practice}</h4>
                                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">{practice.benefit}</p>
                                <div className="mt-2 rounded bg-white p-2 text-sm text-slate-700 dark:bg-black dark:text-slate-300">
                                <p className="font-medium text-slate-900 dark:text-slate-100">How to implement:</p>
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