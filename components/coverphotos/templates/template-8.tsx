"use client"
import type { UserDataCP, ColorPaletteCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}

export default function Template8({ userData, palette }: TemplateProps) {
  const [primary, secondary, accent, background, text] = palette.colors

  return (
    <div
      className="w-full h-[396px] relative overflow-hidden"
      style={{
        background: background,
      }}
    >
      {/* Geometric background */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 1584 396">
          <polygon points="0,0 1584,0 1584,396 0,396" fill={background} />
          <polygon points="0,0 1584,0 1200,396 0,396" fill={primary} opacity="0.1" />
          <polygon points="0,0 800,0 400,396 0,396" fill={secondary} opacity="0.1" />
          <polygon points="1584,0 1584,396 1000,396" fill={accent} opacity="0.1" />
        </svg>
      </div>

      {/* Profile picture area */}
      <div className="absolute left-[150px] top-[50%] transform -translate-y-1/2">
        <div
          className="w-[150px] h-[150px] rounded-md overflow-hidden"
          style={{
            transform: "rotate(45deg)",
            background: userData.profileImage ? "none" : `linear-gradient(135deg, ${primary}40, ${secondary}40)`,
            border: `3px solid ${text}20`,
          }}
        >
          {userData.profileImage ? (
            <div className="w-[212px] h-[212px]" style={{ transform: "rotate(-45deg) translate(-31px, -31px)" }}>
              <img
                src={userData.profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-[212px] h-[212px] flex items-center justify-center"
              style={{ transform: "rotate(-45deg) translate(-31px, -31px)" }}
            >
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
        <div
          className="h-10 w-10 mb-6"
          style={{
            backgroundColor: primary,
            transform: "rotate(45deg)",
          }}
        ></div>

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

        <div
          className="inline-block px-4 py-2"
          style={{
            backgroundColor: `${primary}20`,
            color: text,
            clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
          }}
        >
          <div className="px-2">{userData.company || "Founder & CTO | Campoprime Labs"}</div>
        </div>
      </div>
    </div>
  )
}

