"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"

type TabsLineProps = {
  children: React.ReactNode
}

export function TabsLine({ children }: TabsLineProps) {
  return (
    <Tabs defaultValue="FamilyInformation" className="w-full">

      <TabsList variant="line">
        <TabsTrigger 
        className="cursor-pointer"
        value="FamilyInformation">
          Family Information
        </TabsTrigger>

        <TabsTrigger
        className="cursor-pointer py-5"
        value="Part1">
          Part 1. <br /> Individual Life Cycle Risks
        </TabsTrigger>

        <TabsTrigger
        className="cursor-pointer py-5"
        value="Part2">
          Part 2. <br /> Economic Risks
        </TabsTrigger>

        <TabsTrigger 
        className="cursor-pointer py-5"
        value="Part3">
          Part 3. <br /> Environment and Disaster Risks
        </TabsTrigger>

        <TabsTrigger 
        className="cursor-pointer py-5"
        value="Part4">
          Part 4. <br /> Social and Governance Risks
        </TabsTrigger>
      </TabsList>

      {children}

    </Tabs>
  )
}