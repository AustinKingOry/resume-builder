"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template5({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(to right, ${background}, ${background})`,
      }}
    >
      {/* Vertical bars */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="h-full flex-1"
            style={{
              backgroundColor: i % 2 === 0 ? primary : secondary,
              opacity: 0.03 + i * 0.005,
            }}
          />
        ))}
      </div>

      {/* Accent circle */}
      <div
        className="absolute -right-[150px] top-[50%] transform -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          opacity: 0.8,
        }}
      ></div>

      {/* Profile picture area */}
      <div className="absolute right-[120px] top-[50%] transform -translate-y-1/2">
        <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
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

      {/* Content area */}
      <div className="absolute left-[100px] top-[50%] transform -translate-y-1/2 max-w-[700px]">
        <div
          className="inline-block px-3 py-1 rounded-full text-sm mb-4"
          style={{ backgroundColor: accent, color: "white" }}
        >
          {userData.name ? userData.name : userData.company || "Founder & CTO | Campoprime Labs"}
        </div>

        <h1 className="text-5xl font-bold mb-4" style={{ color: text }}>
          {userData.headline || "Building Technology to Bridge Gaps"}
        </h1>

        <p className="text-xl" style={{ color: `${text}CC` }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </p>
      </div>
    </div>
  )
}

