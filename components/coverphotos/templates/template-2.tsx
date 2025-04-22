"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template2({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-5">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" stroke={text} strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Left side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[300px]" style={{ background: primary }}>
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: "white",
                width: Math.random() * 10 + 5 + "px",
                height: Math.random() * 10 + 5 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Profile picture placeholder */}
      <div className="absolute left-[150px] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[120px] h-[120px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/30 overflow-hidden">
          {userData.profileImage ? (
            <img
              src={userData.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="white"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="absolute left-[350px] top-0 right-[50px] bottom-0 flex flex-col justify-center">
        <div className="h-1 w-24 mb-6" style={{ backgroundColor: accent }}></div>

        {userData.name && (
          <h2 className="text-2xl font-medium mb-2" style={{ color: text }}>
            {userData.name}
          </h2>
        )}

        <h1 className="text-5xl font-bold mb-4" style={{ color: text }}>
          {userData.headline || "Building Technology to Bridge Gaps"}
        </h1>

        <p className="text-xl mb-6" style={{ color: `${text}CC` }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </p>

        <div className="inline-block px-4 py-2 rounded-full" style={{ backgroundColor: secondary, color: background }}>
          {userData.company || "Founder & CTO | Campoprime Labs"}
        </div>
      </div>
    </div>
  )
}

