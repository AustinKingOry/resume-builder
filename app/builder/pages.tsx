"use client"

import React, { useEffect, useRef, useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import type { ResumeData, ResumeDataDb, ResumeTemplate } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from "next/head";
import TemplateSelector from "@/components/TemplateSelector";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { ResumeDB } from "@/utils/supabaseClient";
import { debounce } from "lodash";

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

export default function BuilderPage() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
    const [resumeId, setResumeId] = useState<string | null>(null);
    const [lastSyncedData, setLastSyncedData] = useState<ResumeData | null>(null);
    const {user} = useAuth();
    
    useEffect(() => {
        // Load data from local storage when the component mounts
        const savedData = localStorage.getItem("resumeData")
        if (savedData) {
        setResumeData(JSON.parse(savedData))
        }
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

    const handleAIFineTune = async () => {
        // This is where we'd implement the AI fine-tuning logic
        console.log("AI fine-tuning initiated")
        // For demonstration, let's update the summary and add a skill
        const updatedData = {
            ...resumeData,
            summary: resumeData.summary + " [AI enhanced: This professional is highly skilled and motivated.]",
            skills: [...resumeData.skills, "AI-enhanced skill"],
            referees: [
            ...resumeData.referees,
            {
                name: "AI Generated Referee",
                position: "AI Manager",
                company: "Tech Innovations Inc.",
                email: "ai.referee@example.com",
                phone: "+1 (555) 123-4567",
            },
            ],
        }
        setResumeData(updatedData);
        // Save AI-enhanced data to local storage
        localStorage.setItem("resumeData", JSON.stringify(updatedData))
    }

    const handleReset = () => {
        setResumeData(initialResumeData)
        // Clear data from local storage
        localStorage.removeItem("resumeData")
    }

    return (
        <>
        <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Metadata */}
        <title>Resume Builder</title>
        <meta name="description" content="Effortlessly create professional resumes with Resume Builder. A great learning opportunity for all." />

        {/* Open Graph */}
        <meta property="og:title" content="Resume Builder" />
        <meta property="og:description" content="Effortlessly create professional resumes with Resume Builder. A great learning opportunity for all." />
        <meta property="og:image" content="/logo.webp" />
        <meta property="og:url" content="https://kazikit.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resume Builder" />
        <meta name="twitter:description" content="Effortlessly create professional resumes with Resume Builder. A great learning opportunity for all." />
        <meta name="twitter:image" content="/logo.webp" />
        </Head>
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="w-screen mx-auto px-4">
                <div className="relative w-full">
                    <div className="p-2 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Resume Builder</h1>
                        <div className="flex flex-row gap-2">
                            <Button onClick={handleReset} variant="outline" className="float-end bg-white dark:bg-secondary/90 hover:bg-gray-100">
                                Reset Resume
                            </Button>
                            <Button onClick={handleAIFineTune} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                            <Wand2 className="mr-2 h-5 w-5" />
                            Fine-tune with AI
                            </Button>
                        </div>
                    </div>
                    <div className="py-1.5">
                        {isDesktop ?
                        <ResizablePanelGroup direction="horizontal" className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]">
                            <ResizablePanel defaultSize={40}>
                                <div className="h-full w-full">
                                    <div className="w-full flex items-center justify-between px-2">
                                        <h2 className="px-6 py-2 text-lg font-bold">Edit Resume</h2>
                                        <TemplateSelector selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
                                    </div>
                                    <div className="h-full w-full px-2 py-3">
                                        <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={60} className="sticky top-4 hh-[calc(100vh-12rem)]">
                                <div className="h-full bg-gray-100 dark:bg-muted/20">
                                    <div className="w-full flex items-center justify-between px-6">
                                        <h2 className="py-2 text-lg font-bold">Preview</h2>
                                        <Badge variant="outline">{resumeData.selectedTemplate}</Badge>
                                    </div>
                                    <ScrollArea className="w-full h-full max-h-[90vh]">
                                        <div className="w-full px-6 py-3">
                                            <ResumePreview data={resumeData} changeTemplate={handleTemplateSelect} />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                        :(
                        <ScrollArea className="h-full w-full pr-2">
                            <MobileView handleUpdate={handleUpdate} resumeData={resumeData} handleTemplateSelect={handleTemplateSelect} />
                        </ScrollArea>)}
                    </div>
                </div>
            </main>
        </div>
        </>
    )
}

type ResumeFormProps = {
    handleUpdate: (data: ResumeData) => void
    resumeData: ResumeData
    handleTemplateSelect: (template: ResumeTemplate) => void
  }
const MobileView = ({ handleUpdate, resumeData, handleTemplateSelect }: ResumeFormProps) => {
    return (
        <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="form" className="text-lg">
            Edit Resume
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-lg">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form">
            <div className="w-full flex items-center justify-between px-2">
                <h2 className="px-6 py-2 text-lg font-bold">Edit Resume</h2>
                <TemplateSelector selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
            </div>
            <div className="h-full w-full px-6 py-3">
                <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
            </div>
        </TabsContent>
        <TabsContent value="preview">
            <div className="w-full flex items-center justify-between px-6">
                <h2 className="py-2 text-lg font-bold">Preview</h2>
                <TemplateSelector selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
            </div>
            <div className="h-full w-full px-6 py-3 bg-gray-100 dark:bg-muted/20">
                <ResumePreview data={resumeData} changeTemplate={handleTemplateSelect} />
            </div>
        </TabsContent>
      </Tabs>
    )
}
