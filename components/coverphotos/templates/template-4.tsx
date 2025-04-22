"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template4({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {/* Wave pattern */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1584 200" preserveAspectRatio="none">
        <path d="M0,100 C600,200 1000,0 1584,100 L1584,200 L0,200 Z" fill={primary} opacity="0.8" />
        <path d="M0,120 C500,220 1100,20 1584,120 L1584,200 L0,200 Z" fill={secondary} opacity="0.6" />
      </svg>

      {/* Circles background */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? primary : secondary,
              width: Math.random() * 100 + 50 + "px",
              height: Math.random() * 100 + 50 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0.05,
            }}
          />
        ))}
      </div>

      {/* Profile picture area */}
      <div className="absolute left-[150px] top-[50%] transform -translate-y-1/2">
        <div
          className="w-[160px] h-[160px] rounded-full overflow-hidden"
          style={{
            boxShadow: `0 0 0 6px ${primary}40`,
            background: userData.profileImage ? "none" : `linear-gradient(45deg, ${primary}20, ${secondary}20)`,
          }}
        >
          {userData.profileImage ? (
            <img
              src={userData.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  fill={text}
                  opacity="0.7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="absolute left-[350px] top-[50%] transform -translate-y-1/2 max-w-[800px]">
        <div className="flex items-center mb-4">
          <div className="h-1 w-12 mr-4" style={{ backgroundColor: accent }}></div>
          <div
            className="text-sm uppercase tracking-wider"
            style={{ color: accent, fontFamily: "'Inter', sans-serif" }}
          >
            {userData.name ? userData.name : "Professional Profile"}
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4" style={{ color: text, fontFamily: "'Inter', sans-serif" }}>
          {userData.headline || "Building Technology to Bridge Gaps"}
        </h1>

        <p className="text-xl mb-6" style={{ color: `${text}CC`, fontFamily: "'Inter', sans-serif" }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </p>

        <div
          className="inline-block px-4 py-2 rounded-md"
          style={{
            backgroundColor: `${primary}20`,
            color: text,
            borderLeft: `4px solid ${primary}`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {userData.company || "Founder & CTO | Campoprime Labs"}
        </div>
      </div>
    </div>
  )
}

