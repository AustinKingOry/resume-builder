import { BarChart3, Calendar, Download, FileText, Flame, HelpCircle, Home, Inbox, Search, Settings, UserIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Profile } from "@/lib/types"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

interface AppSidebarProps {
  profile: Profile | null
}

export function AppSidebar({ profile }: AppSidebarProps) {
    const navigation = [
      { name: "Home", icon: FileText, href: "/dashboard", current: false },
      { name: "CV Builder", icon: FileText, href: "/builder", current: false },
      { name: "CV Roaster", icon: Flame, href: "/roast-my-cv", current: true },
      { name: "Analytics", icon: BarChart3, href: "/analytics", current: false },
      { name: "Templates", icon: Download, href: "/templates", current: false },
    ]
  return (
    <Sidebar className="bg-white dark:!bg-black dark:border-gray-800">
        {/* Subtle African pattern overlay */}
        <div className="absolute top-0 right-0 w-full h-32 opacity-5 bg-gradient-to-br from-emerald-600 to-blue-600 overflow-hidden dark:from-emerald-400 dark:to-blue-400">
            <div
            className="absolute inset-0"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
            />
        </div>
        <SidebarHeader>
            <div className="p-2.5 border-b border-gray-200 relative z-10 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <span className="text-white font-bold text-sm relative z-10">K</span>
                <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
                />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">Kazikit</span>
            </Link>
        </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="pt-4 border-t border-gray-200 relative z-10 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center dark:from-emerald-900 dark:to-blue-900">
            <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {/* {!collapsed && ( */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">{profile?.full_name || "User"}</p>
              <p className="text-xs text-emerald-600 truncate dark:text-emerald-400">Hustler Plan 💪</p>
            </div>
          {/* )} */}
        </div>

        <div className="space-y-1">
          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-950"
          >
            <Settings className="w-4 h-4" />
            {/* {!collapsed && <span>Settings</span>} */}
            <span>Settings</span>
          </a>
          <a
            href="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-950"
          >
            <HelpCircle className="w-4 h-4" />
            {/* {!collapsed && <span>Help</span>} */}
            <span>Help</span>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
