"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Sparkles, Eye, Loader2 } from "lucide-react"
import RedesignedResumeForm from "@/components/redesigned-resume-form"
import type { ResumeData, ResumeDataDb, ResumeTemplate } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import ResumePreview from "@/components/ResumePreview"
import Navbar from "@/components/layout/navbar"
import { useAuth } from "@/components/auth-provider"
import { ResumeDB } from "@/utils/supabaseClient"
import { debounce } from "lodash"

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
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [lastSyncedData, setLastSyncedData] = useState<ResumeData | null>(null);
  const {user} = useAuth();
      
      useEffect(() => {
        const loadData = async ()=>{
          setLoadingData(true);
          try {
            // Load data from local storage when the component mounts
            const savedData = localStorage.getItem("resumeData")
            if (savedData) {
            setResumeData(JSON.parse(savedData))
            }
            
          } catch (error) {
            console.error(`Failed to load local data: `, error)
          } finally {
            setLoadingData(false);
          }
        }

        loadData();
      }, [])
  
      useEffect(() => {
          const loadResume = async () => {
              if (!user?.id) return;
              const resumes = await ResumeDB.fetchResumesByUser(1, 0, user.id);
              if (resumes.length > 0) {
                  setResumeData(resumes[0].data);
                  setResumeId(resumes[0].id);
                  setLastSyncedData(resumes[0].data);
              }
          };
          loadResume();
      }, [user]);
      
  
      const syncResumeToDB = async (data: ResumeData) => {
          if (!user?.id) return;
      
          const isChanged = JSON.stringify(data) !== JSON.stringify(lastSyncedData);
          if (!isChanged) return;
      
          try {
              if (!resumeId) {
                  const created = await ResumeDB.createResume(user.id, data);
                  if (created && created[0]?.id) {
                      setResumeId(created[0].id);
                      setLastSyncedData(data);
                  }
              } else {
                  const updates: ResumeDataDb = {
                      data: data,
                      id: resumeId,
                      user_id: user.id,
                      template_id: data.selectedTemplate
                  }
                  const updated = await ResumeDB.updateResume(resumeId, updates);
                  if (updated) {
                      setLastSyncedData(data);
                  }
              }
          } catch (err) {
              console.error("Error syncing resume:", err);
          }
      };
      
      const debouncedSync = useRef(debounce(syncResumeToDB, 2000)).current;
  
      
      const handleUpdate = (data: ResumeData) => {
          setResumeData(data)
          // Save data to local storage whenever it's updated
          localStorage.setItem("resumeData", JSON.stringify(data))
          debouncedSync(data);
      }
  
      const handleTemplateSelect = (template: ResumeTemplate) => {
          const updatedData = { ...resumeData, selectedTemplate: template.id }
          setResumeData(updatedData)
          // Save data to local storage when template is changed
          localStorage.setItem("resumeData", JSON.stringify(updatedData))
          debouncedSync(updatedData);
      }
  
      const handleReset = () => {
          setResumeData(initialResumeData)
          // Clear data from local storage
          localStorage.removeItem("resumeData")
      }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation - Fixed Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/80">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create professional resumes with AI assistance</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                    <FileText className="w-4 h-4" />
                    Build Resume
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                {/* {activeTab === "preview" && (
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="form" className="mt-0" forceMount hidden={activeTab !== 'form'}>
          {!loadingData ?
          <RedesignedResumeForm onUpdate={handleUpdate} initialData={resumeData} reset={handleReset} />:
          <>
          <div className="w-full min-h-96 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          </>
          }
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
            <div className="container mx-auto px-4">
              {/* <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Preview</h2>
                <p className="text-gray-600 text-lg">Review your resume before downloading</p>
              </div> */}
              <ResumePreview data={resumeData} changeTemplate={handleTemplateSelect} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
