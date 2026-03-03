'use client'

import { Separator } from "@/components/ui/separator"
import { InputInline } from "./Components/SearchBar"
import TableNames from "./Components/TableNames"
import { useState } from "react"

export default function Settings(){

    const [search, setSearch] = useState("");
    console.log(search)

    return(
    <main className="px-10">
        <h1 className="font-black text-3xl py-5 px-2">Individual Response</h1>
        <Separator/>
        <div className="mt-5">
            <InputInline value={search} onChange={setSearch}/>
            <TableNames search={search}/>

        </div>
    </main>
        

    )
}