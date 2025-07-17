"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template10({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-[396px] min-h-full relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {/* Striped background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full"
            style={{
              width: "40px",
              left: `${i * 80}px`,
              backgroundColor: i % 2 === 0 ? primary : secondary,
              opacity: 0.05,
              transform: "skewX(-20deg)",
            }}
          />
        ))}
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[60px]"
        style={{
          background: `linear-gradient(to right, ${primary}, ${secondary})`,
        }}
      ></div>

      {/* Profile picture area */}
      <div className="absolute right-[150px] top-[50%] transform -translate-y-1/2">
        <div
          className="w-[150px] h-[150px] rounded-full overflow-hidden border-8"
          style={{ borderColor: `${primary}30` }}
        >
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
                  fill={text}
                  opacity="0.7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="absolute left-[100px] top-[50%] transform -translate-y-1/2 max-w-[700px]">
        <div className="inline-block px-3 py-1 rounded-sm mb-4" style={{ backgroundColor: accent, color: "white" }}>
          {userData.name ? userData.name.toUpperCase() : "PROFESSIONAL PROFILE"}
        </div>

        <h1 className="text-5xl font-bold mb-4" style={{ color: text }}>
          {userData.headline || "Building Technology to Bridge Gaps"}
        </h1>

        <p className="text-xl mb-6" style={{ color: `${text}CC` }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </p>

        <div style={{ color: primary, fontWeight: "bold" }}>
          {userData.company || "Founder & CTO | Campoprime Labs"}
        </div>
      </div>
    </div>
  )
}

