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
  RefreshCw,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ATSLoadingState } from "@/components/ats/loading-state"
import { useEdgeATSAnalysis } from "@/hooks/use-edge-ats"
import { ATSAnalysisResult } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { ResumeDB } from "@/utils/supabaseClient"
import { useAuth } from "@/components/auth-provider"
import { User } from "@supabase/supabase-js"
import AnalysisResults from "@/components/ats/AnalysisResults"

interface StoredResume {
  id: string
  name: string
  fileName: string
  uploadedDate: string
  size: number
}

function UploadSection({
  onUpdate,
  user
}: {
  onUpdate: (data: { resume: File | undefined; jobDescription: string | undefined }) => void
  user?: User | null
}) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [storedResumes, setStoredResumes] = useState<StoredResume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [loadingResumes, setLoadingResumes] = useState(false)
  const [resumesLoaded, setResumesLoaded] = useState(false)
  const [showResumesDialog, setShowResumesDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
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

  const fetchStoredResumes = async (): Promise<StoredResume[] | null> => {
    try {
      if(user){
      const resumes = await ResumeDB.fetchResumesByUser(10, 0, user.id);
      console.log("fetched: ", resumes)
      const formatted = resumes.map((resume)=>{
        return {
          id: resume.id,
          name: resume.title,
          fileName: `${resume.title.split(" ").join("-")}.pdf`,
          uploadedDate: `${resume.updated_at}`,
          size: Number(resume.fileSize) || 0,
        }
      })
      return (formatted);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      return null;
    }
  };
  

  const handleOpenResumesDialog = async () => {
    setShowResumesDialog(true)
    if (!resumesLoaded) {
      setLoadingResumes(true)
      const resumes = await fetchStoredResumes()
      setStoredResumes(resumes || [])
      setResumesLoaded(true)
      setLoadingResumes(false)
    }
  }

  const handleRefreshResumes = async () => {
    setLoadingResumes(true)
    const resumes = await fetchStoredResumes()
    setStoredResumes(resumes || [])
    setLoadingResumes(false)
  }

  const removeSelectedResume = () => {
    setSelectedResumeId("")
  }

  const filteredResumes = storedResumes.filter(
    (resume) =>
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        <CardContent className="space-y-3">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              resumeFile
                ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-muted-foreground/25 hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10",
            )}
            onClick={() => {if(selectedResumeId == "") fileInputRef.current?.click()}}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              readOnly={selectedResumeId != ""}
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
                    console.log("Disabled: ", selectedResumeId == "")
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

          <div className="space-y-2 hidden">
            <p className="text-center text-muted-foreground text-xs">or</p>
            <Button
              onClick={handleOpenResumesDialog}
              variant="outline"
              className="w-full gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950"
            >
              <FileText className="h-4 w-4" />
              Browse My Resumes
            </Button>

            {selectedResumeId && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 relative dark:bg-blue-950">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {storedResumes.find((r) => r.id === selectedResumeId)?.name}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Selected from stored resumes</p>
                </div>
                <Button size="icon" variant={"secondary"} className="w-4 h-4" onClick={removeSelectedResume}>
                  <X className="!w-3 !h-3" />
                </Button>
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
      
      <Dialog open={showResumesDialog} onOpenChange={setShowResumesDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>My Stored Resumes</DialogTitle>
                  <DialogDescription>Select a resume to use for analysis</DialogDescription>
                </div>
                <Button
                  onClick={handleRefreshResumes}
                  variant="ghost"
                  size="sm"
                  disabled={loadingResumes}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingResumes ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </DialogHeader>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search resumes by name or filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingResumes ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse dark:bg-slate-800" />
                  ))}
                </div>
              ) : filteredResumes.length === 0 ? (
                <div className="text-center py-8">
                  {storedResumes.length === 0 ? (
                    <>
                      <p className="text-slate-600 dark:text-slate-400">No stored resumes found</p>
                      <p className="text-sm text-slate-500 mt-1">Upload a resume first to use this option</p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-600 dark:text-slate-400">No resumes match your search</p>
                      <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
                    </>
                  )}
                </div>
              ) : (
                filteredResumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => {
                      setSelectedResumeId(resume.id)
                      setResumeFile(null)
                      setShowResumesDialog(false)
                      setSearchQuery("")
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedResumeId === resume.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : "border-slate-200 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{resume.name}</p>
                        <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">{resume.fileName}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(resume.size / 1024).toFixed(2)} KB • Uploaded{" "}
                          {new Date(resume.uploadedDate).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedResumeId === resume.id && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
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

export default function ATSAnalyzerPage() {
  const { toast } = useToast()
  // const [hasAnalyzed, setHasAnalyzed] = useState(false)
  // const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  const { analyzeCV, isAnalyzing: loading, result: analysis, error, reset, hasAnalyzed } = useEdgeATSAnalysis();
  const {user, isLoading} = useAuth();


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
      if(hasAnalyzed){
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
    // setHasAnalyzed(false)
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
                <Link href="/ats">
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
              <UploadSection onUpdate={handleUpdate} user={user} />

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
              {analysis && <AnalysisResults analysis={analysis} isNew={true} />}
            </div>
          )}
        </div>
      </main>
    </>
  )
}