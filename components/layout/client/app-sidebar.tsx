"use client";

import {
  Home,
  FileText,
  Edit3,
  Flame,
  FileSignature,
  Cpu,
  BarChart3,
  LayoutTemplate,
  Settings,
  Activity,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, signOut } = useAuth();

  // --- Grouped Navigation ---
  const groups = [
    {
      label: "Career Tools",
      items: [
        { name: "My Resumes", icon: FileText, href: "/resumes" },
        { name: "Resume Builder", icon: Edit3, href: "/resumes/builder" },
        { name: "Cover Letters", icon: FileSignature, href: "/cover-letters" },
        { name: "ATS Analyzer", icon: Cpu, href: "/ats" },
      ],
    },
    {
      label: "Roast My CV",
      items: [
        { name: "Roast My CV", icon: Flame, href: "/roast-my-cv" },
        { name: "Dashboard", icon: Home, href: "/dashboard" },
        { name: "Analytics", icon: BarChart3, href: "/analytics" },
      ],
    },
    {
      label: "Resources & Templates",
      items: [{ name: "Templates", icon: LayoutTemplate, href: "/templates" }],
    },
  ];

  return (
    <Sidebar
      className="bg-white dark:!bg-black dark:border-gray-800"
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="px-0">
        <div className="p-2.5 border-b border-gray-200 relative z-10 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png?height=52&width=80"
              width={100}
              height={52}
              alt="KaziKit Logo"
              className="bg-white rounded-full"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden">
              Kazikit
            </span>
          </Link>
        </div>
      </SidebarHeader>

      {/* Main Sidebar Content */}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="dark:hover:text-gray-100 dark:hover:bg-gray-950">
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="pt-4 border-t border-gray-200 relative z-10 dark:border-gray-800">
        <div className="space-y-1">
          <Link
            href="/account"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-950"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <Link
            href="/status"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-950"
          >
            <Activity className="h-4 w-4" />
            Status
          </Link>
          {profile && <NavUser user={profile} onLogOut={signOut} />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
