"use client"
import { Separator } from "@/components/ui/separator"

import { supabase } from '@/lib/supabase/client'

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"
import {BarChart, CartesianGrid, YAxis, XAxis, Bar } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { LabelList } from "recharts"

type CategoryResponse = {
  choice: string
  questions: {
    category: string
  } | null
}

type TopRiskResponse = {
  q_id: string
  questions: {
    question_text: string
  } | { question_text: string }[] | null
}

export default function Summary(){
    
    const [totalRespondents, setTotalRespondents] = useState(0)
    const [fourPsPercentage, setFourPsPercentage] = useState("0.00")
    const [highRiskHouseholds, sethighRiskHouseholds] = useState<number>();
    const [recencyData, setRecencyData] = useState<
    { type: string; total: number }[]
    >([])

    const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
    >([])

    const [topFiveRisks, setTopFiveRisks] = useState<
    { text: string; count: number }[]
    >([])

    useEffect(()=>{
        const fetchStats = async () => {
            const { count: respondentCount } = await supabase
                .from("respondents")
                .select("*", { count: "exact", head: true })

            const { count: fourPsCount } = await supabase
                .from("respondents")
                .select("*", { count: "exact", head: true })
                .eq("is_4ps_beneficiary", true);

            const { data: highRiskData } = await supabase
                .from("responses")
                .select("respondent_id")
                .eq("choice", "WITHIN_THE_YEAR");

            setTotalRespondents(respondentCount || 0)

            const percentage =
                respondentCount && respondentCount > 0
                    ? ((fourPsCount! / respondentCount) * 100).toFixed(2)
                    : "0.00";

            setFourPsPercentage(percentage);

            const highRiskHouseholds = new Set(
                highRiskData?.map((r) => r.respondent_id)
                ).size;
            sethighRiskHouseholds(highRiskHouseholds)

            const { data: recencyCounts } = await supabase
            .from("responses")
            .select("choice")

                const recencyMap = {
                    WITHIN_THE_YEAR: 0,
                    TWO_FIVE_YEARS_AGO: 0,
                    NONE: 0,
                }

                recencyCounts?.forEach((r) => {
                    if (recencyMap[r.choice as keyof typeof recencyMap] !== undefined) {
                        recencyMap[r.choice as keyof typeof recencyMap]++
                    }
                })

                setRecencyData([
                    { type: "Within the Year", total: recencyMap.WITHIN_THE_YEAR },
                    { type: "2-5 Years Ago", total: recencyMap.TWO_FIVE_YEARS_AGO },
                    { type: "None", total: recencyMap.NONE },
                ])
            
            const { data: categoryCounts } = await supabase
            .from("responses")
            .select(`
                choice,
                questions (
                    category
                )
            `)
            .eq("choice", "WITHIN_THE_YEAR")
            .returns<CategoryResponse[]>()

            const categoryMap = {
                Individual: 0,
                Economic: 0,
                EnvironmentDisaster: 0,
                SocGov: 0,
            }

            categoryCounts?.forEach((r: CategoryResponse) => {
                const category = r.questions?.category

                if (
                    category &&
                    categoryMap[category as keyof typeof categoryMap] !== undefined
                ) {
                    categoryMap[category as keyof typeof categoryMap]++
                }
            })

            setCategoryData([
                { name: "Individual", value: categoryMap.Individual },
                { name: "Economic", value: categoryMap.Economic },
                { name: "EnvironmentDisaster", value: categoryMap.EnvironmentDisaster },
                { name: "SocGov", value: categoryMap.SocGov },
            ])
            
            const { data: topRisks } = await supabase
            .from("responses")
            .select(`
                q_id,
                questions!responses_q_id_fkey (
                    question_text
                )
            `)
            .eq("choice", "WITHIN_THE_YEAR")
            .returns<TopRiskResponse[]>()
            console.log("RAW topRisks:", JSON.stringify(topRisks, null, 2))

            const riskMap: Record<string, { text: string; count: number }> = {}

            topRisks?.forEach((r) => {
                const id = r.q_id
                const questionsData = r.questions
                const text = Array.isArray(questionsData)
                    ? questionsData[0]?.question_text
                    : questionsData?.question_text

                if (!text) return

                if (!riskMap[id]) {
                    riskMap[id] = { text, count: 0 }
                }
                riskMap[id].count++
            })

            const sortedTop5 = Object.values(riskMap)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            console.log("TOP RISKS RAW:", topRisks)
            console.log("TOP RISKS SORTED:", sortedTop5)

            setTopFiveRisks(sortedTop5)

        }
        fetchStats()
    },[])
    
    const completionRate = totalRespondents > 0
    ? ((totalRespondents / 30000)*100).toFixed(2)
    : "0.00";

    const recencyConfig = {
    total: {
        label: "Total Cases",
        color: "var(--chart-3)",
    },
    } satisfies ChartConfig;

    const categoryConfig = {
    value: {
        label: "Recent Cases",
        color: "var(--chart-4)",
    },
    } satisfies ChartConfig;

const [loading, setLoading] = useState(true);

useEffect(()=>{
    const checkUser = async()=>{
    const {data} = await supabase.auth.getUser()
console.log(data)
    if(!data.user){
        console.log(data)
    }else{
        setLoading(false)
    }
  }
checkUser();
},[])
  if (loading) {
    return(
        <div className="inset-0 z-50 fixed bg-gray-800 flex items-center justify-center">
                 <Spinner className="size-10 text-white" />
        </div>
    )
  }

    return(
        <main className="flex flex-col lg:px-20 sm:p-0 md:px-5">
            <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
            <Separator/>
            <div className="flex flex-wrap justify-center gap-3 px-1 py-5">
                
                {/* TOTAL HH SURVEYED */}
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Household Surveyed</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">
                            {totalRespondents}
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                </Card>

                {/* Completion Rate (vs 30,000 target) */}
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Completion Rate</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">{completionRate}%</CardTitle>
                        
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">The completion percentage of the survey based on the estimated target of responses ≈30,000</p>
                    </CardContent>

                </Card>
                
                {/* High-Risk Households */}
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>High Risk Households</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">{highRiskHouseholds}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Households with Recent Vulnerabilities</p>
                    </CardContent>
                </Card>

                {/* 4Ps Beneficiaries % */}
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>4Ps Beneficiaries</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">{fourPsPercentage}%</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Percentage of surveyed households that are 4Ps beneficiaries</p>
                    </CardContent>
                </Card>

                {/* Risk Recency Overview */}
                <Card className="lg:w-full bg-slate-50">
                    <CardHeader>
                        <CardTitle>Municipality Risk Recency Distribution</CardTitle>
                        <CardDescription>
                        All recorded vulnerabilities across surveyed households
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ChartContainer config={recencyConfig}>
                            <BarChart
                                accessibilityLayer
                                data={recencyData}
                                margin={{ top: 20 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="type"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                dataKey="total"
                                fill="var(--color-total)"
                                radius={8}
                                >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                                </Bar>
                            </BarChart>
                            </ChartContainer>
                    </CardContent>
                    </Card>

                {/* Category Risk Distribution */}
                <Card className="lg:w-full bg-slate-50">
                    <CardHeader>
                        <CardTitle>Category Risk Distribution</CardTitle>
                        <CardDescription>
                        Number of households that reported a vulnerability within the year, grouped by risk category
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ChartContainer config={categoryConfig}>
                            <BarChart
                                layout="vertical"
                                accessibilityLayer
                                data={categoryData}
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                dataKey="value"
                                fill="var(--color-value)"
                                radius={8}
                                >
                                <LabelList
                                    position="right"
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                                </Bar>
                            </BarChart>
                            </ChartContainer>
                    </CardContent>
                    </Card>

                {/* Top 5 Most Reported Recent Vulnerabilities */}
                <Card className="lg:w-full bg-slate-50">
                <CardHeader>
                    <CardTitle>Top 5 Most Reported Recent Vulnerabilities</CardTitle>
                    <CardDescription>
                    Based on reports within the year
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {topFiveRisks.map((risk, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                        <span className="text-sm font-medium">
                        {index + 1}. {risk.text}
                        </span>
                        <span className="text-sm font-bold">
                        {risk.count}
                        </span>
                    </div>
                    ))}
                </CardContent>
                </Card>

            </div>
        </main>
    )
}