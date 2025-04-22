import type {  ColorPaletteCP, UserDataCP } from "@/lib/types"

interface TemplateProps {
  userData: UserDataCP
  palette: ColorPaletteCP
}


const Template1 = ({ userData, palette }: TemplateProps) => {
    const [primary, secondary, accent, background, text] = palette.colors
  return (
    <div className="w-full h-full relative overflow-hidden"
    style={{
      background: `linear-gradient(to right, ${background}, ${background})`,
    }}>
        {/* Animated particle background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: text,
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0.2,
              animation: `pulse ${Math.random() * 4 + 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle */}
        <div
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: `linear-gradient(to bottom right, ${primary}20, ${secondary}20)`,
          }}
        ></div>

        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1584 396">
          <line x1="0" y1="396" x2="500" y2="0" stroke={primary} strokeWidth="2" style={{ opacity: 0.2 }} />
          <line x1="200" y1="396" x2="700" y2="0" stroke={primary} strokeWidth="2" style={{ opacity: 0.1 }} />
          <line x1="400" y1="396" x2="900" y2="0" stroke={primary} strokeWidth="2" style={{ opacity: 0.05 }} />
        </svg>

        {/* Hexagon pattern */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[300px] opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 600 300">
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon points="25,0 50,14.4 50,37.7 25,51.1 0,37.7 0,14.4" fill="none" stroke={text} strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
      </div>

      {/* Profile picture space */}
      <div className="absolute left-[120px] top-[50%] transform -translate-y-1/2">
        <div
          className="w-[168px] h-[168px] rounded-full relative overflow-hidden"
          style={{ borderColor: `${text}30`, borderWidth: "4px" }}
        >
          {userData.profileImage ? (
            <img
              src={userData.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom right, ${primary}10, ${secondary}10)` }}
              ></div>

              {/* Tech-themed placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Circuit board pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
                    <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 10 10 L 0 10" fill="none" stroke={text} strokeWidth="1" />
                      <path d="M 30 0 L 30 30 L 0 30" fill="none" stroke={text} strokeWidth="1" />
                      <circle cx="10" cy="10" r="2" fill={text} />
                      <circle cx="30" cy="30" r="2" fill={text} />
                      <circle cx="20" cy="20" r="4" fill={primary} style={{ opacity: 0.5 }} />
                    </pattern>
                    <circle cx="100" cy="100" r="100" fill="url(#circuit)" />
                  </svg>

                  {/* User silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="opacity-70">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                        fill={text}
                      />
                    </svg>
                  </div>

                  {/* Animated pulse ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-[120px] h-[120px] rounded-full animate-ping opacity-30"
                      style={{ borderColor: primary, borderWidth: "1px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 w-[168px] h-[168px] rounded-full blur-xl"
          style={{ backgroundColor: `${primary}20` }}
        ></div>
      </div>

      {/* Main content area */}
      <div className="absolute left-[340px] top-0 right-[60px] bottom-0 flex flex-col justify-center">
        {/* Decorative element */}
        <div
          className="w-20 h-1 mb-6"
          style={{ background: `linear-gradient(to right, ${primary}, ${secondary})` }}
        ></div>

        {userData.name && (
          <h2 className="text-2xl font-medium mb-2" style={{ color: text }}>
            {userData.name}
          </h2>
        )}

        {/* Main headline with gradient text */}
        <h1 className="text-4xl font-bold leading-tight">
          <div
            style={{
              color: primary,
              backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            {userData.headline || "Building Technology to Bridge Gaps & Create Opportunities"}
          </div>
        </h1>

        {/* Subheadline with custom styling */}
        <h2 className="text-xl mt-3 font-light" style={{ color: `${text}CC` }}>
          {userData.subheadline || "Innovating at the intersection of education and technology"}
        </h2>

        {/* Footer text with custom badge */}
        <div className="flex items-center mt-6">
          <div
            className="px-3 py-1 rounded-full backdrop-blur-sm text-sm"
            style={{ backgroundColor: `${text}10`, color: text }}
          >
            {userData.company || "Founder & CTO | Campoprime Labs"}
          </div>
          <div className="w-2 h-2 rounded-full ml-3 animate-pulse" style={{ backgroundColor: accent }}></div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(1.5); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default Template1