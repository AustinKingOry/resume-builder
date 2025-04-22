"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template9({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-[396px] relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {/* Dots pattern */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent,
              width: "4px",
              height: "4px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Left side accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[400px]"
        style={{
          background: `linear-gradient(to right, ${primary}CC, ${primary}00)`,
        }}
      ></div>

      {/* Profile picture area */}
      <div className="absolute left-[200px] top-[50%] transform -translate-y-1/2">
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${secondary}, ${accent})`,
              opacity: 0.6,
              filter: "blur(20px)",
            }}
          ></div>
          <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white/30">
            {userData.profileImage ? (
              <img
                src={userData.profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    fill="white"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="absolute left-[400px] top-[50%] transform -translate-y-1/2 max-w-[700px]">
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

        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: accent }}></div>
          <div style={{ color: text }}>{userData.company || "Founder & CTO | Campoprime Labs"}</div>
        </div>
      </div>
    </div>
  )
}

