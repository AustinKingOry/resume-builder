"use client"
import {
  FileText,
  Flame,
  User,
  Settings,
  BarChart3,
  Download,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const navigation = [
    { name: "CV Builder", icon: FileText, href: "/dashboard", current: false },
    { name: "CV Roaster", icon: Flame, href: "/roast-my-cv", current: true },
    { name: "Analytics", icon: BarChart3, href: "/analytics", current: false },
    { name: "Templates", icon: Download, href: "/templates", current: false },
  ]

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Subtle African pattern overlay */}
      <div className="absolute top-0 right-0 w-full h-32 opacity-5 bg-gradient-to-br from-emerald-600 to-blue-600 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Logo */}
      <div className="p-4 border-b border-gray-200 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-bold text-sm relative z-10">K</span>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-900">Kazikit</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              item.current
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span>{item.name}</span>}
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Wanjiku M.</p>
              <p className="text-xs text-emerald-600 truncate">Hustler Plan 💪</p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span>Settings</span>}
          </a>
          <a
            href="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <HelpCircle className="w-4 h-4" />
            {!collapsed && <span>Help</span>}
          </a>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200 relative z-10">
        <Button variant="ghost" size="sm" onClick={onToggle} className="w-full justify-center">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}