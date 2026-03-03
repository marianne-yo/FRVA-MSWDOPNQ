"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar"
import Image from "next/image"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  PersonStanding,
  LogOut
} from "lucide-react"

const links = [
  { name: "Summary", href: "/admin/summary", icon: LayoutDashboard },
  { name: "Responses", href: "/admin/responses", icon: FileText },
  { name: "Per Barangay Responses", href: "/admin/perBarangayResponses", icon: BarChart3 },
  { name: "Individual Responses", href: "/admin/individualResponses", icon: PersonStanding },
];

export function AppSidebar() {

  const pathname = usePathname();

  const route = useRouter();

  async function handleLogOut(){

const {error}= await supabase.auth.signOut()

if(error){
  alert("Error")
}else{
route.push("/");
}

  }

  return (
  <Sidebar className="flex flex-col h-screen p-2">
    
    <SidebarHeader className="text-lg font-semibold">
      <Image 
        className="dark:invert"
        src="/mswdo_cropped.png"
        alt="mswdo logo"
        width={800}
        height={100}
        priority
      />
    </SidebarHeader>

    <SidebarContent className="flex-1">
      <SidebarMenu>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                size={"lg"}
                asChild
                className={
                  isActive
                    ? "border-l-3 border-blue-500 bg-blue-100 font-semibold py-8"
                    : "hover:bg-gray-100"
                }
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-black text-[0.9rem] font-medium"
                >
                  <Icon
                    size={24}
                    className={isActive ? "text-black" : "text-gray-500"}
                  />
                  {link.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter className="mt-auto">
      <SidebarMenuButton
        className="hover:bg-red-500 hover:text-white text-black bg-red-200 p-5 text-[1rem] font-bold w-full"
        onClick={handleLogOut}
      >
        <LogOut/>
        Logout
      </SidebarMenuButton>
    </SidebarFooter>

  </Sidebar>
)
}

