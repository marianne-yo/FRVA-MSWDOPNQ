"use client"
import { Separator } from "@/components/ui/separator"

import { supabase } from '@/lib/supabase/client'

import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"

export default function Summary(){
    const [totalRespondents, setTotalRespondents] = useState(0)
    const [fourPsPercentage, setFourPsPercentage] = useState("0.00")
    const [highRiskHouseholds, sethighRiskHouseholds] = useState<number>();

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
        }
        fetchStats()
    },[])
    
    const completionRate = totalRespondents > 0
    ? ((totalRespondents / 30000)*100).toFixed(2)
    : "0.00";


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
        <main className="flex flex-col lg:px-30 sm:p-0 md:px-8">
            <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
            <Separator/>
            <div className="flex flex-wrap justify-center gap-3 px-1 py-5 bg-amber-300">
                
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
                <Card className="lg:w-full sm:w-full md:w-full px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">PLACEHOLDER</CardTitle>
                        
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                </Card>

                {/* Category Risk Distribution */}
                <Card className="lg:w-[80%] sm:w-full md:w-full px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">PLACEHOLDER</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                </Card>

                {/* Top 5 Specific Risk Indicators */}
                {/* Category Risk Distribution */}
                <Card className="lg:w-[80%] sm:w-full md:w-full px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">PLACEHOLDER</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                </Card>

                {/* Recent Activity - table */}
            </div>
        </main>
    )
}