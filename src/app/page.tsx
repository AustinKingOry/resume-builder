"use client"

import { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import type { ResumeData } from "./types";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from "next/head";

export default function Home() {
    const [resumeData, setResumeData] = useState<ResumeData>({
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
        experience: [],
        education: [],
        skills: [],
        skillLevels: {},
        certifications: [],
        referees: [],
    })

  const handleUpdate = (data: ResumeData) => {
    setResumeData(data)
  }

  const handleAIFineTune = async () => {
    // This is where you'd implement the AI fine-tuning logic
    console.log("AI fine-tuning initiated")
    // For demonstration, let's update the summary and add a skill
    setResumeData((prev) => ({
        ...prev,
        summary: prev.summary + " [AI enhanced: This professional is highly skilled and motivated.]",
        skills: [...prev.skills, "AI-enhanced skill"],
        referees: [
          ...prev.referees,
          {
            name: "AI Generated Referee",
            position: "AI Manager",
            company: "Tech Innovations Inc.",
            email: "ai.referee@example.com",
            phone: "+1 (555) 123-4567",
          },
        ],
    }))
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
                            <h2 className="px-6 py-2 text-lg font-bold">Preview</h2>
                            <div className="h-full w-full px-6 py-3">
                                <ResumePreview data={resumeData} />
                            </div>
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>            
            <div className="w-full h-[4%]">            
                <Button onClick={handleAIFineTune} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Fine-tune with AI
                </Button>
            </div>
        </div>
    </main>
    </>
  )
}

