"use client"

import { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import type { ResumeData } from "./types";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      photo: "",
      socialMedia: {},
    },
    summary: "",
    experience: [],
    education: [],
    skills: [] as string[],
  })

  const handleUpdate = (data: ResumeData) => {
    setResumeData(data)
  }

  const handleAIFineTune = async () => {
    // This is where you'd implement the AI fine-tuning logic
    console.log("AI fine-tuning initiated")
    // For demonstration, let's just update the summary
    setResumeData((prev) => ({
      ...prev,
      summary: prev.summary + " [AI enhanced: This professional is highly skilled and motivated.]",
    }))
  }

  return (
    <main className="fixed h-screen w-screen mx-auto px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative h-full w-full">
            <div className="h-[5%]">
                <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Resume Builder</h1>
            </div>
            <div className="h-[90%] py-1.5">
                <ResizablePanelGroup direction="horizontal" className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]">
                    <ResizablePanel defaultSize={30}>
                        <ScrollArea className="h-full w-full">
                            <h2 className="px-6 py-2 text-lg font-bold">Edit Resume</h2>
                            <div className="h-full w-full px-6 py-3">
                                <ResumeForm onUpdate={handleUpdate} initialData={resumeData} />
                            </div>
                        </ScrollArea>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={70}>
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
  )
}

