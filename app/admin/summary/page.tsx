"use client"


import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

import { supabase } from '@/lib/supabase/client'

import { Card, CardDescription, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"

export default function Summary(){
    const [totalRespondents, setTotalRespondents] = useState(0)
    const [totalResponses, setTotalResponses] = useState(0)

    useEffect(()=>{
        const fetchStats = async () => {
        const { count: respondentCount } = await supabase
            .from("respondents")
            .select("*", { count: "exact", head: true })

        const { count: responsesCount } = await supabase
            .from("responses")
            .select("*", { count: "exact", head: true })

        setTotalRespondents(respondentCount || 0)
        setTotalResponses(responsesCount || 0)
        }

        fetchStats()
    },[])
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
        <main className="flex flex-col lg:px-20 sm:p-0 md:px-8">
            <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
            <Separator/>
            <div className="flex flex-wrap justify-around gap-5 px-1 py-5">
            <h1>HELLOW WORLD</h1>
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Respondents</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">
                            {totalRespondents}
                        </CardTitle>
                        {/* <CardAction>Card Action</CardAction> */}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>

                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">{totalResponses}</CardTitle>
                        
                        {/* <CardAction>Card Action</CardAction> */}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Responses, this counts individual questions, needs more filtering</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
                
                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">10,000</CardTitle>
                        
                        {/* <CardAction>Card Action</CardAction> */}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>

                <Card className="lg:w-[80%] sm:w-full md:w-full px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">PLACEHOLDER</CardTitle>
                        
                        {/* <CardAction>Card Action</CardAction> */}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-light text-gray-500">Total number of responses out of ≈30,000 households</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )

    const [responses, setResponses] = useState<Response[]>([]);


}