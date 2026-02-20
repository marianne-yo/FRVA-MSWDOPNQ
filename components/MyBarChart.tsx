"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "./ui/chart"
import { Monitor } from "lucide-react"

const chartConfig = {
    desktop:{
        label: "Desktop",
        icon: Monitor,
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export default function MyBarChart(){
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
        { month: "July", desktop: 200, mobile: 120 },
    ]
    return(
        <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
            <BarChart accessibilityLayer data={chartData}
            layout="horizontal"
            margin={{
              right: 16,
            }}
            >
                <CartesianGrid vertical={false}/>
                <XAxis 
                    dataKey={"month"}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0,3)}
                />
                
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>

            </BarChart>
        </ChartContainer>
    )
}