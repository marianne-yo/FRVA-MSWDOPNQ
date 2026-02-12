export default function Summary(){
    return(
        <div>
            <main>
                <h1 className="font-black text-3xl py-5 px-2">SUMMARY</h1>
                <div className="flex flex-wrap align-middle gap-3 p-5">

                    {/* total responses card */}
                    <div className="bg-slate-300 p-3 rounded-md w-[48%] flex justify-center flex-col">
                        <h2 className="text-[1rem] lg:text-[2rem] font-medium">TOTAL RESPONSES</h2>
                        <div className="bg-slate-200 p-2 flex justify-center rounded-1xl">
                            <p className="font-medium text-1xl lg:text-2xl">12,200</p>
                        </div>
                    </div>

                    {/* second card holder */}
                    <div className="bg-slate-300 p-3 rounded-md w-[48%] flex justify-center flex-col">
                        <h2 className="text-[1rem] lg:text-[2rem] font-medium">PLACEHOLDER</h2>
                        <div className="bg-slate-200 p-2 flex justify-center rounded-1xl">
                            <p className="font-medium text-1xl lg:text-2xl">12,200</p>
                        </div>
                    </div>

                    

                    {/* charts card */}
                    <div className="bg-slate-300 p-3 rounded-md w-full">
                        <h2 className="font-bold">Charts</h2>
                        
                    </div>
                </div>
            </main>
        </div>
    )
}