import type { UserData, Template, ColorPalette, Platform } from "./types"

export const defaultUserData: UserData = {
  headline: "Crafting Solutions, One Line of Code at a Time", 
  subheadline: "Passionate about building scalable and efficient digital experiences", 
  company: "Software Engineer | Tech Innovators Inc.", 
  profileImage: "", // Placeholder before user uploads an image
  name: "Alex Johnson", 
}

export const templates: Template[] = [
  {
    id: "template-1",
    name: "Modern Tech",
    previewBg: "#0f172a",
  },
  {
    id: "template-2",
    name: "Split",
    previewBg: "#1e293b",
  },
  {
    id: "template-3",
    name: "Diagonal",
    previewBg: "#334155",
  },
  {
    id: "template-4",
    name: "Wave",
    previewBg: "#f8fafc",
  },
  {
    id: "template-5",
    name: "Circle",
    previewBg: "#f1f5f9",
  },
  {
    id: "template-6",
    name: "Minimal",
    previewBg: "#ffffff",
  },
  {
    id: "template-7",
    name: "Gradient",
    previewBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    id: "template-8",
    name: "Geometric",
    previewBg: "#0f172a",
  },
  {
    id: "template-9",
    name: "Dots",
    previewBg: "#1e293b",
  },
  {
    id: "template-10",
    name: "Stripes",
    previewBg: "#f8fafc",
  },
]

export const colorPalettes: ColorPalette[] = [
  {
    id: "blue-emerald",
    name: "Blue & Emerald",
    colors: ["#3b82f6", "#10b981", "#06b6d4", "#0f172a", "#ffffff"],
  },
  {
    id: "purple-pink",
    name: "Purple & Pink",
    colors: ["#8b5cf6", "#ec4899", "#d946ef", "#1e1b4b", "#ffffff"],
  },
  {
    id: "orange-red",
    name: "Orange & Red",
    colors: ["#f97316", "#ef4444", "#f59e0b", "#0c0a09", "#ffffff"],
  },
  {
    id: "green-teal",
    name: "Green & Teal",
    colors: ["#22c55e", "#14b8a6", "#84cc16", "#f0fdf4", "#0f172a"],
  },
  {
    id: "gray-blue",
    name: "Gray & Blue",
    colors: ["#64748b", "#3b82f6", "#94a3b8", "#f8fafc", "#0f172a"],
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#030712", "#ffffff"],
  },
  {
    id: "light-mode",
    name: "Light Mode",
    colors: ["#3b82f6", "#10b981", "#f97316", "#ffffff", "#0f172a"],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#94a3b8", "#64748b", "#475569", "#f8fafc", "#0f172a"],
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: ["#06b6d4", "#8b5cf6", "#f97316", "#0f172a", "#ffffff"],
  },
]

export const platforms: Platform[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    width: 1584,
    height: 396,
    description: "Professional networking platform",
  },
  {
    id: "facebook",
    name: "Facebook",
    width: 820,
    height: 312,
    description: "Social media platform",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    width: 1500,
    height: 500,
    description: "Microblogging platform",
  },
  {
    id: "youtube",
    name: "YouTube",
    width: 2560,
    height: 1440,
    description: "Video sharing platform",
  },
  {
    id: "twitch",
    name: "Twitch",
    width: 1200,
    height: 480,
    description: "Live streaming platform",
  },
  {
    id: "github",
    name: "GitHub",
    width: 1280,
    height: 640,
    description: "Code hosting platform",
  },
]

