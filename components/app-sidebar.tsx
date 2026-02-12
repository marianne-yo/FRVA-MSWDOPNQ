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

export function AppSidebar() {
  return (
    <Sidebar className="flex flex-col justify-between p-2">
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

      <SidebarContent className="p-1 h-full ">
        <SidebarMenu className="p-1 flex flex-col gap-3 w-full  h-full justify-start">
          <SidebarMenuItem className="h-12 w-full">
            <SidebarMenuButton asChild className=" p-5 h-full text-[1rem] font-bold">
              <Link href="/admin">Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="h-12 w-full">
            <SidebarMenuButton asChild className=" h-full p-5 text-[1rem] font-bold">
              <Link href="/admin/summary">Summary</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="h-12 w-full">
            <SidebarMenuButton asChild className=" h-full p-5 text-[1rem] font-bold">
              <Link href="/admin/responses">Responses</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="h-12 w-full">
            <SidebarMenuButton asChild className=" h-full p-5 text-[1rem] font-bold">
              <Link href="/admin/settings">Settings</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        
          <SidebarFooter className="flex flex-col align-bottom justify-self-end  p-1">
            <SidebarMenuItem className="">
              <SidebarMenuButton asChild className="hover:bg-red-500 hover:text-white text-black bg-red-200 p-5 text-[1rem] font-bold">
                <Link href="/">Logout</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarFooter>
        
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
