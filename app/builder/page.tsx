"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, Sparkles, Eye } from "lucide-react"
import RedesignedResumeForm from "@/components/redesigned-resume-form"
import type { ResumeData } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import ResumePreview from "@/components/ResumePreview"

const initialResumeData: ResumeData = {
  selectedTemplate: "milan",
  personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      photo: "",
      gender: "",
      socialMedia: {},
  },
  summary: "",
  experience: [
    {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      current: false,
    },
  ],
  education: [],
  skills: [],
  skillLevels: {},
  certifications: [],
  referees: [],
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [activeTab, setActiveTab] = useState("form")

  const handleResumeUpdate = (data: ResumeData) => {
    setResumeData(data)
  }

  const handleDownload = () => {
    console.log("Download resume:", resumeData)
    alert("Download functionality would be implemented here!")
  }

  return (
    <div className="min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation - Fixed Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Resume Builder
                  </h1>
                  <p className="text-sm text-gray-600">Create professional resumes with AI assistance</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <FileText className="w-4 h-4" />
                    Build Resume
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                {activeTab === "preview" && (
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="form" className="mt-0">
          <RedesignedResumeForm onUpdate={handleResumeUpdate} initialData={resumeData} />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
            <div className="container mx-auto px-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Preview</h2>
                <p className="text-gray-600 text-lg">Review your resume before downloading</p>
              </div>
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
