"use client"

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

import data from "../../lib/data.json" //mock data

import { Card, CardDescription, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"

export default function Summary(){

const router = useRouter();
useEffect(()=>{
    console.log("hllo btch")

  const checkUser = async()=>{
    const {data} = await supabase.auth.getUser()
console.log(data)
    if(!data.user){
        console.log("hllo btch")
      router.push("/")
    }

  }
checkUser();
},[])


    const [responses, setResponses] = useState<Response[]>([]);

    return(
        <main className="flex flex-col lg:px-20 sm:p-0 md:px-8">
            <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
            <Separator/>
            <div className="flex flex-wrap justify-around gap-5 px-1 py-5">

                <Card className="lg:w-[20%] sm:w-[30%] md:w-[30%] px-1 bg-slate-50">
                    <CardHeader>
                        <CardDescription>Total Responses</CardDescription>
                        <CardTitle className="lg:text-4xl font-bold sm:text-3xl md:text-4xl">
                            
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

                {/* <div className="flex flex-col gap-2 ">
                    <div className="flex flex-row gap-2 w-full">
                       
                    </div>
                    
                    
                    <div className="bg-slate-200 p-3 rounded-md w-full flex justify-center flex-col">
                        <h2 className="font-bold">Charts</h2>
                        <div className="bg-slate-100 p-2 flex justify-center rounded-1xl">
                            
                        </div>
                    </div>
                </div> */}
            </div>
        </main>
    )
}