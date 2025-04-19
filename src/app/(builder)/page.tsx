"use client"

import React, { useEffect, useState } from "react";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import type { ResumeData, ResumeTemplate } from "../types";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from "next/head";
import TemplateSelector from "../components/TemplateSelector";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function Home() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)

    useEffect(() => {
        // Load data from local storage when the component mounts
        const savedData = localStorage.getItem("resumeData")
        if (savedData) {
        setResumeData(JSON.parse(savedData))
        }
    }, [])
  const handleUpdate = (data: ResumeData) => {
    setResumeData(data)
    // Save data to local storage whenever it's updated
    localStorage.setItem("resumeData", JSON.stringify(data))
  }

    const handleTemplateSelect = (template: ResumeTemplate) => {
        const updatedData = { ...resumeData, selectedTemplate: template.id }
        setResumeData(updatedData)
        // Save data to local storage when template is changed
        localStorage.setItem("resumeData", JSON.stringify(updatedData))
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
        <meta property="og:url" content="https://open-resume-builder.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resume Builder" />
        <meta name="twitter:description" content="Effortlessly create professional resumes with Resume Builder. A great learning opportunity for all." />
        <meta name="twitter:image" content="/logo.webp" />
        </Head>
        <main className="fixed h-screen w-screen mx-auto px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="relative h-full w-full">
                <div className="h-[5%]">
                    <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Resume Builder</h1>
                </div>
                <div className="h-[90%] py-1.5">
                    {isDesktop ?
                    <ResizablePanelGroup direction="horizontal" className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]">
                        <ResizablePanel defaultSize={40}>
                            <ScrollArea className="h-full w-full">
                                <h2 className="px-6 py-2 text-lg font-bold">Edit Resume</h2>
                                <div className="h-full w-full px-6 py-3">
                                    <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
                                </div>
                            </ScrollArea>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={60}>
                            <ScrollArea className="h-full w-full">
                                <div className="w-full flex items-center justify-between px-6">
                                    <h2 className="px-6 py-2 text-lg font-bold">Preview</h2>
                                    <TemplateSelector selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
                                </div>
                                <div className="h-full w-full px-6 py-3">
                                    <ResumePreview data={resumeData} />
                                </div>
                            </ScrollArea>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                    :(
                    <ScrollArea className="h-full w-full pr-2">
                        <MobileView handleUpdate={handleUpdate} resumeData={resumeData} handleTemplateSelect={handleTemplateSelect} />
                    </ScrollArea>)}
                </div>            
                <div className="w-full h-[4%]">
                    <div className="flex justify-between">
                        <Button
                        onClick={handleAIFineTune}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                        >
                        <Wand2 className="mr-2 h-5 w-5" />
                        Fine-tune with AI
                        </Button>
                        <Button onClick={handleReset} variant="outline" className="bg-white hover:bg-gray-100">
                        Reset Resume
                        </Button>
                    </div>
                </div>
            </div>
        </main>
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
            <h2 className="px-6 py-2 text-lg font-bold">Edit Resume</h2>
            <div className="h-full w-full px-6 py-3">
                <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
            </div>
        </TabsContent>
        <TabsContent value="preview">
            <div className="w-full flex items-center justify-between px-6">
                <h2 className="px-6 py-2 text-lg font-bold">Preview</h2>
                <TemplateSelector selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
            </div>
            <div className="h-full w-full px-6 py-3">
                <ResumePreview data={resumeData} />
            </div>
        </TabsContent>
      </Tabs>
    )
}
