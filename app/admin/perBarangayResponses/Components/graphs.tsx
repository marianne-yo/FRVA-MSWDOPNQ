"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, Cell, LabelList } from "recharts"

const CHOICE_LABELS: Record<string, string> = {
  WITHIN_THE_YEAR: "Within The Year",
  TWO_FIVE_YEARS_AGO: "2 to 5 Years",
  NONE: "None",
}

const COLORS = ["#134E8E", "#FFD400", "#C00707"]

const chartConfig = {
  count: {
    label: "Responses",
    color: "#134E8E",
  },
} satisfies ChartConfig

type Props = {
  choiceCounts: Record<string, number>
  choiceOrder: string[]
}

export function GraphResponse({ choiceCounts, choiceOrder }: Props) {
  const total = choiceOrder.reduce((sum, choice) => sum + (choiceCounts[choice] ?? 0), 0)

  const chartData = choiceOrder.map((choice) => {
    const count = choiceCounts[choice] ?? 0
    return {
      choice: CHOICE_LABELS[choice] ?? choice,
      count,
      percentage: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0%",
    }
  })

  return (
    <ChartContainer config={chartConfig} className="w-[80%] m-auto h-[200px] min-h-[100px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="choice"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
        />
        
        <ChartTooltip content={<ChartTooltipContent />} />
                  <LabelList
            dataKey="percentage"
            position="top"
            className="fill-foreground"
            fontSize={12}
          /> 
        <Bar dataKey="count" radius={4}>

          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
          
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default GraphResponse