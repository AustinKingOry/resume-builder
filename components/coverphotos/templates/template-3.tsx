"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template3({ userData, palette }: TemplateProps) {
  // const [primary, secondary, accent, background, text] = palette.colors
  const [primary, secondary, accent, background] = palette.colors

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${background} 0%, ${primary}20 100%)`,
      }}
    >
      {/* Geometric shapes */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 1584 396" className="opacity-10">
          <circle cx="1400" cy="100" r="300" fill={primary} />
          <circle cx="100" cy="300" r="200" fill={secondary} />
          <circle cx="800" cy="400" r="150" fill={accent} />
        </svg>
      </div>

      {/* Diagonal divider */}
      <div
        className="absolute top-0 bottom-0 left-0 right-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 65% 100%, 0% 100%)",
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          opacity: 0.9,
        }}
      ></div>

      {/* Profile picture area */}
      <div className="absolute left-[200px] top-[50%] transform -translate-y-1/2">
        <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
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
      <div className="absolute right-[80px] top-[50%] transform -translate-y-1/2 max-w-[700px] text-right">
        {userData.name && (
          <h2 className="text-2xl font-medium mb-2" style={{ color: "white" }}>
            {userData.name}
          </h2>
        )}

        <h1 className="text-5xl font-bold mb-4" style={{ color: "white" }}>
          {userData.headline || "Building Technology to Bridge Gaps"}
        </h1>

        <p className="text-xl mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </p>

        <div className="inline-block px-4 py-2 rounded-full" style={{ backgroundColor: accent, color: "white" }}>
          {userData.company || "Founder & CTO | Campoprime Labs"}
        </div>
      </div>
    </div>
  )
}

