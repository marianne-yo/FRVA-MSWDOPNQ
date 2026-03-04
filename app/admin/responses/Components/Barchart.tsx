  "use client"
  import { TrendingUp } from "lucide-react"
  import { Bar, BarChart, CartesianGrid, XAxis, Cell, LabelList } from "recharts"
  import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
  } from "@/components/ui/card"
  import {
    ChartContainer, ChartTooltip, ChartTooltipContent,
    type ChartConfig,
  } from "@/components/ui/chart"

  const COLORS = ["#134E8E", "#FFD400", "#C00707"]

  type BarChartData = {
    label: string
    value: number
  }

  type BarChartComponentProps = {
    title?: string
    description?: string
    data?: BarChartData[]
    dataLabel?: string
    footerText?: string
    trendText?: string
    tickFormatter?: (value: string) => string
  }

  export function BarChartComponent({
    title = "Bar Chart",
    description = "",
    data = [],
    dataLabel = "Value",
    footerText = "",
    trendText = "",
    tickFormatter = (value) => value,
  }: BarChartComponentProps) {

    const total = data.reduce((sum, item) => sum + item.value, 0)

    const chartData = data.map((item) => ({
      label: item.label,
      value: item.value,
      percentage: total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%",
    }))

    const chartConfig = {
      value: {
        label: dataLabel,
        color: "#134E8E",
      },
    } satisfies ChartConfig

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-[80%] m-auto h-[200px] min-h-[100px] p-1">
            <BarChart accessibilityLayer data={chartData} className="">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <>
                        <span className="font-medium">{value} responses</span>
                        <span className="ml-1 text-muted-foreground">({item.payload.percentage})</span>
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="value" radius={4}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="middle"
                  className="fill-foreground font-bold text-white"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        {(trendText || footerText) && (
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {trendText && (
              <div className="flex gap-2 leading-none font-medium">
                {trendText} <TrendingUp className="h-4 w-4" />
              </div>
            )}
            {footerText && (
              <div className="text-muted-foreground leading-none">{footerText}</div>
            )}
          </CardFooter>
        )}
      </Card>
    )
  }