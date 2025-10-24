"use client"

import type React from "react"

import { useState } from "react"
import { Plus, TrendingUp, Award, Sparkles, BarChart3, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillCard } from "@/components/skills/skill-card"
import { AIInsights } from "@/components/skills/ai-insights"
import { GrowthTimeline } from "@/components/skills/growth-timeline"
import { SkillComparison } from "@/components/skills/skill-comparison"
import { AddSkillDialog } from "@/components/skills/add-skill-dialog"

interface Skill {
    id: string
    name: string
    category: "technical" | "soft" | "language" | "tool" | "other"
    proficiency: number
    endorsements: number
    lastUpdated: string
    improvement: number
    linkedProjects: number
    milestone?: string
}

interface StatCard {
    label: string
    value: string | number
    change?: string
    icon: React.ReactNode
}

const MOCK_SKILLS: Skill[] = [
    {
        id: "1",
        name: "React",
        category: "technical",
        proficiency: 92,
        endorsements: 24,
        lastUpdated: "2025-01-15",
        improvement: 12,
        linkedProjects: 5,
        milestone: "Expert",
    },
    {
        id: "2",
        name: "TypeScript",
        category: "technical",
        proficiency: 88,
        endorsements: 18,
        lastUpdated: "2025-01-10",
        improvement: 8,
        linkedProjects: 4,
    },
    {
        id: "3",
        name: "Project Management",
        category: "soft",
        proficiency: 85,
        endorsements: 12,
        lastUpdated: "2025-01-12",
        improvement: 5,
        linkedProjects: 3,
        milestone: "Advanced",
    },
    {
        id: "4",
        name: "Communication",
        category: "soft",
        proficiency: 90,
        endorsements: 28,
        lastUpdated: "2025-01-14",
        improvement: 10,
        linkedProjects: 6,
    },
    {
        id: "5",
        name: "Spanish",
        category: "language",
        proficiency: 72,
        endorsements: 8,
        lastUpdated: "2025-01-08",
        improvement: 3,
        linkedProjects: 1,
    },
    {
        id: "6",
        name: "Figma",
        category: "tool",
        proficiency: 78,
        endorsements: 6,
        lastUpdated: "2025-01-11",
        improvement: 7,
        linkedProjects: 2,
    },
]

const STATS: StatCard[] = [
    {
        label: "Total Skills",
        value: 24,
        change: "+3 this month",
        icon: <Award className="w-5 h-5" />,
    },
    {
        label: "Average Proficiency",
        value: "84%",
        change: "+5% improvement",
        icon: <TrendingUp className="w-5 h-5" />,
    },
    {
        label: "Total Endorsements",
        value: 156,
        change: "+12 this week",
        icon: <Sparkles className="w-5 h-5" />,
    },
    {
        label: "Expert Skills",
        value: 7,
        change: "+1 since last month",
        icon: <BarChart3 className="w-5 h-5" />,
    },
]

const CATEGORIES = [
    { id: "all", label: "All Skills" },
    { id: "technical", label: "Technical" },
    { id: "soft", label: "Soft Skills" },
    { id: "language", label: "Languages" },
    { id: "tool", label: "Tools" },
]

export default function SkillsTrackerPage() {
    const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)

    const filteredSkills = skills.filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddSkill = (newSkill: any) => {
        const skill: Skill = {
        id: Date.now().toString(),
        ...newSkill,
        endorsements: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
        improvement: 0,
        linkedProjects: 0,
        }
        setSkills([...skills, skill])
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Skills Tracker
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Monitor, improve, and showcase your professional growth
                </p>
                </div>
                <Button
                onClick={() => setIsAddSkillOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
                </Button>
            </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                        {stat.change && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">{stat.change}</p>
                        )}
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        {stat.icon}
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
                {/* Search and Filter */}
                <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-slate-200 dark:border-slate-800"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {CATEGORIES.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={selectedCategory === cat.id ? "bg-gradient-to-r from-emerald-600 to-blue-600" : ""}
                        >
                            {cat.label}
                        </Button>
                        ))}
                    </div>
                    </div>
                </CardContent>
                </Card>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
                </div>

                {filteredSkills.length === 0 && (
                <Card className="border-0 shadow-md">
                    <CardContent className="p-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">No skills found</p>
                    </CardContent>
                </Card>
                )}
            </TabsContent>

            {/* Growth Tab */}
            <TabsContent value="growth">
                <GrowthTimeline skills={skills} />
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights">
                <AIInsights skills={skills} />
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison">
                <SkillComparison skills={skills} />
            </TabsContent>
            </Tabs>
        </div>

        {/* Add Skill Dialog */}
        <AddSkillDialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen} onAddSkill={handleAddSkill} />
        </div>
    )
}
