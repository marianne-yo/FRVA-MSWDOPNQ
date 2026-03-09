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
      
      {/* Desktop Tabs - Horizontal Layout */}
      <TabsList variant="line" className="hidden md:flex w-full mt-5 mb-5">
        <TabsTrigger 
          className="cursor-pointer px-4 sm:px-6 py-3 text-sm sm:text-base"
          value="FamilyInformation">
          Family <span className="hidden sm:inline">Information</span>
        </TabsTrigger>

        <TabsTrigger
          className="cursor-pointer px-4 sm:px-6 py-3  text-sm sm:text-base"
          value="Part1">
          <span className="hidden lg:inline">Part 1.</span> Life Cycle <span className="hidden sm:inline">Risks</span>
        </TabsTrigger>

        <TabsTrigger
          className="cursor-pointer px-4 sm:px-6 py-3 text-sm sm:text-base"
          value="Part2">
          <span className="hidden lg:inline">Part 2.</span> Economic <span className="hidden sm:inline">Risks</span>
        </TabsTrigger>

        <TabsTrigger 
          className="cursor-pointer px-4 sm:px-6 py-3 text-sm sm:text-base"
          value="Part3">
          <span className="hidden lg:inline">Part 3.</span> Environment <span className="hidden sm:inline">Risks</span>
        </TabsTrigger>

        <TabsTrigger 
          className="cursor-pointer px-4 sm:px-6 py-3  text-sm sm:text-base"
          value="Part4">
          <span className="hidden lg:inline">Part 4.</span> Governance <span className="hidden sm:inline">Risks</span>
        </TabsTrigger>
      </TabsList>

      {/* Mobile Tabs - Vertical Dropdown Style */}
      <div className="md:hidden mb-4">
        <div className="space-y-2">
          <TabsList variant="line" className="flex flex-col w-full bg-gray-50 rounded-lg p-1 h-auto mt-10 mb-10">
            <TabsTrigger 
              className="cursor-pointer w-full text-left px-4 py-3 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-yellow-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              value="FamilyInformation">
              Family Information
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer w-full text-left px-4 py-3 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-yellow-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              value="Part1">
              Part 1: Life Cycle Risks
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer w-full text-left px-4 py-3 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-yellow-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              value="Part2">
              Part 2: Economic Risks
            </TabsTrigger>

            <TabsTrigger 
              className="cursor-pointer w-full text-left px-4 py-3 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-yellow-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              value="Part3">
              Part 3: Environment Risks
            </TabsTrigger>

            <TabsTrigger 
              className="cursor-pointer w-full text-left px-4 py-3 rounded data-[state=active]:bg-blue-600 data-[state=active]:text-yellow-600 hover:bg-gray-100 transition-colors text-sm font-medium"
              value="Part4">
              Part 4: Governance Risks
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Content Areas */}
      <div className="w-full">
        {children}
      </div>

    </Tabs>
  )
}
