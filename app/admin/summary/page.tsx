
import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

import data from "../../lib/data.json" //mock data

export default function Summary(){
    return(
        <main className="flex flex-col">
            <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
            <Separator/>
            <div className="flex flex-wrap justify-center gap-2 px-3 py-5">

                <div className="flex flex-col gap-2 ">
                    <div className="flex flex-row gap-2 w-full">
                        {/* total responses card */}
                        <div className="bg-slate-200 p-3 rounded-md flex justify-center flex-col">
                            <h2 className="text-[1rem] lg:text-[1.5rem] font-medium">Total responses</h2>
                            <div className="bg-slate-100 p-2 flex justify-center rounded-1xl">
                                <p className="font-medium text-1xl lg:text-2xl">{data.length}</p>
                            </div>
                        </div>

                        {/* second card holder */}
                        <div className="bg-slate-200 p-3 rounded-md flex justify-center flex-col">
                            <h2 className="text-[1rem] lg:text-[1.5rem] font-medium">PLACEHOLDER</h2>
                            <div className="bg-slate-100 p-2 flex justify-center rounded-1xl">
                                <p className="font-medium text-1xl lg:text-2xl">40%</p>
                            </div>
                        </div>

                        {/* thrid card holder */}
                        <div className="bg-slate-200 p-3 rounded-md flex justify-center flex-col">
                            <h2 className="text-[1rem] lg:text-[1.5rem] font-medium">PLACEHOLDER</h2>
                            <div className="bg-slate-100 p-2 flex justify-center rounded-1xl">
                                <p className="font-medium text-1xl lg:text-2xl">123</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* charts card */}
                    <div className="bg-slate-200 p-3 rounded-md w-full flex justify-center flex-col">
                        <h2 className="font-bold">Charts</h2>
                        <div className="bg-slate-100 p-2 flex justify-center rounded-1xl">
                            
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}