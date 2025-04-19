"use client"
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/ui/layout/navbar";
import { TemplatesList } from "../components/TemplateSelector";
import { ResumeData, ResumeTemplate } from "../../lib/types";

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

const Templates = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)

    useEffect(() => {
        // Load data from local storage when the component mounts
        const savedData = localStorage.getItem("resumeData")
        if (savedData) {
        setResumeData(JSON.parse(savedData))
        }
    }, []);

    const handleTemplateSelect = (template: ResumeTemplate) => {
        const updatedData = { ...resumeData, selectedTemplate: template.id }
        setResumeData(updatedData)
        // Save data to local storage when template is changed
        localStorage.setItem("resumeData", JSON.stringify(updatedData))
    }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Professional Resume Templates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed resume templates. 
            Each template is ATS-friendly and customizable to your needs.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <TemplatesList selectedTemplate={resumeData.selectedTemplate} onTemplateSelect={handleTemplateSelect} />
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Templates;
