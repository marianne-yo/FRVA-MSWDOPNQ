"use client"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/lib/supabase/client'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { BarChart, CartesianGrid, YAxis, XAxis, Bar } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Download } from "lucide-react"
import { exportSummaryToExcel } from "../../lib/exportSummaryToExcel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LabelList } from "recharts"

export default function Summary() {

  const [totalRespondents, setTotalRespondents] = useState(0)
  const [fourPsPercentage, setFourPsPercentage] = useState("0.00")
  const [highRiskHouseholds, setHighRiskHouseholds] = useState<number>()
  const [recencyData, setRecencyData] = useState<{ type: string; total: number }[]>([])
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([])
  const [topFiveRisks, setTopFiveRisks] = useState<{ text: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // All calls run in parallel — each returns a tiny summary, not raw rows
      const [
        { count: respondentCount },
        { count: fourPsCount },
        { data: highRiskCount, error: e1 },
        { data: recencyCounts, error: e2 },
        { data: categoryCounts, error: e3 },
        { data: topRisks, error: e4 },
      ] = await Promise.all([
        supabase.from("respondents").select("*", { count: "exact", head: true }),
        supabase.from("respondents").select("*", { count: "exact", head: true }).eq("is_4ps_beneficiary", true),
        supabase.rpc("get_high_risk_household_count"),
        supabase.rpc("get_recency_counts"),
        supabase.rpc("get_category_risk_counts"),
        supabase.rpc("get_top_five_risks"),
      ])

      console.log("respondentCount:", respondentCount)
      console.log("highRiskCount:", highRiskCount, "| error:", e1)
      console.log("recencyCounts:", recencyCounts, "| error:", e2)
      console.log("categoryCounts:", categoryCounts, "| error:", e3)
      console.log("topRisks:", topRisks, "| error:", e4)

      // Total respondents
      setTotalRespondents(respondentCount || 0)

      // 4Ps percentage
      const percentage =
        respondentCount && respondentCount > 0
          ? ((fourPsCount! / respondentCount) * 100).toFixed(2)
          : "0.00"
      setFourPsPercentage(percentage)

      // High risk households
      setHighRiskHouseholds((highRiskCount as number) ?? 0)

      // Recency distribution
      const recencyMap: Record<string, number> = {
        WITHIN_THE_YEAR: 0,
        TWO_FIVE_YEARS_AGO: 0,
        NONE: 0,
      }
      recencyCounts?.forEach((r: { choice: string; total: number }) => {
        if (recencyMap[r.choice] !== undefined) {
          recencyMap[r.choice] = Number(r.total)
        }
      })
      setRecencyData([
        { type: "Within the Year", total: recencyMap.WITHIN_THE_YEAR },
        { type: "2-5 Years Ago", total: recencyMap.TWO_FIVE_YEARS_AGO },
        { type: "None", total: recencyMap.NONE },
      ])

      // Category distribution
      const categoryMap: Record<string, number> = {
        Individual: 0,
        Economic: 0,
        EnvironmentDisaster: 0,
        SocGov: 0,
      }
      categoryCounts?.forEach((r: { category: string; total: number }) => {
        if (categoryMap[r.category] !== undefined) {
          categoryMap[r.category] = Number(r.total)
        }
      })
      setCategoryData([
        { name: "Individual", value: categoryMap.Individual },
        { name: "Economic", value: categoryMap.Economic },
        { name: "EnvironmentDisaster", value: categoryMap.EnvironmentDisaster },
        { name: "SocGov", value: categoryMap.SocGov },
      ])

      // Top 5 risks
      setTopFiveRisks(
        (topRisks ?? []).map((r: { q_id: number; question_text: string; total: number }) => ({
          text: r.question_text,
          count: Number(r.total),
        }))
      )
    }

    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return
      await fetchStats()
      setLoading(false)
    }
    checkUser()
  }, [])

  const completionRate = totalRespondents > 0
    ? ((totalRespondents / 30000) * 100).toFixed(2)
    : "0.00"

  const recencyConfig = {
    total: { label: "Total Cases", color: "var(--chart-3)" },
  } satisfies ChartConfig

  const categoryConfig = {
    value: { label: "Recent Cases", color: "var(--chart-4)" },
  } satisfies ChartConfig

  if (loading) {
    return (
      <main className="flex flex-col p-5 lg:px-10 sm:p-0 md:px-5">
        <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="col-span-1 sm:col-span-2 lg:col-span-4 w-full">
              <CardHeader>
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col p-5 lg:px-10 sm:p-0 md:px-5">
      <div className="flex items-center justify-between py-5 px-2">
        <h1 className="font-black text-3xl">SUMMARY</h1>
        <button
          onClick={() =>
            exportSummaryToExcel({
              totalRespondents,
              completionRate,
              highRiskHouseholds,
              fourPsPercentage,
              recencyData,
              categoryData,
              topFiveRisks,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium cursor-pointer"
        >
          <Download size={16} />
          Export Summary
        </button>
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-3 py-5">

        {/* TOTAL HH SURVEYED */}
        <Card className="bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardDescription>Total Household Surveyed</CardDescription>
            <CardTitle className="text-[2rem] lg:text-5xl font-bold sm:text-3xl md:text-4xl">
              {totalRespondents}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-[2rem] lg:text-4xl font-bold sm:text-3xl md:text-4xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light text-gray-500">The completion percentage of the survey based on the estimated target of responses ≈30,000</p>
          </CardContent>
        </Card>

        {/* High-Risk Households */}
        <Card className="bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardDescription>High Risk Households</CardDescription>
            <CardTitle className="text-[2rem] lg:text-4xl font-bold sm:text-3xl md:text-4xl">{highRiskHouseholds}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light text-gray-500">Households with Recent Vulnerabilities</p>
          </CardContent>
        </Card>

        {/* 4Ps Beneficiaries */}
        <Card className="bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardDescription>4Ps Beneficiaries</CardDescription>
            <CardTitle className="text-[2rem] lg:text-4xl font-bold sm:text-3xl md:text-4xl">{fourPsPercentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light text-gray-500">Percentage of surveyed households that are 4Ps beneficiaries</p>
          </CardContent>
        </Card>

        {/* Risk Recency Overview */}
        <Card className="col-span-1 sm:col-span-2 lg:col-span-4 bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Municipality Risk Recency Distribution</CardTitle>
            <CardDescription>All recorded vulnerabilities across surveyed households</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={recencyConfig}>
              <BarChart accessibilityLayer data={recencyData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={8}>
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Risk Distribution */}
        <Card className="col-span-1 sm:col-span-2 lg:col-span-4 bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Category Risk Distribution</CardTitle>
            <CardDescription>Number of households that reported a vulnerability within the year, grouped by risk category</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ChartContainer config={categoryConfig} className="min-w-[500px]">
              <BarChart layout="vertical" accessibilityLayer data={categoryData} margin={{ top: 10, right: 20, left: 15, bottom: 10 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={160} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={8}>
                  <LabelList position="right" className="fill-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 5 Most Reported Recent Vulnerabilities */}
        <Card className="col-span-1 sm:col-span-2 lg:col-span-4 bg-linear-to-b from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Top 5 Most Reported Recent Vulnerabilities</CardTitle>
            <CardDescription>Based on reports within the year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topFiveRisks.map((risk, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">{index + 1}. {risk.text}</span>
                <span className="text-sm font-bold">{risk.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
