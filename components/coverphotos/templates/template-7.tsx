"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template7({ userData, palette }: TemplateProps) {
  // const [primary, secondary, accent, background, text] = palette.colors
  const [primary, secondary] = palette.colors

  return (
    <div
      className="w-full h-[396px] relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      }}
    >
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      {/* Content container */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-16 flex items-center">
          {/* Profile picture */}
          <div className="mr-12">
            <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Text content */}
          <div>
            {userData.name && (
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white mb-3">
                {userData.name}
              </div>
            )}

            <h1 className="text-5xl font-bold text-white mb-4">
              {userData.headline || "Building Technology to Bridge Gaps"}
            </h1>

            <p className="text-xl text-white/80 mb-6">
              {userData.subheadline || "Innovating at the intersection of education and technology"}
            </p>

            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
              {userData.company || "Founder & CTO | Campoprime Labs"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

