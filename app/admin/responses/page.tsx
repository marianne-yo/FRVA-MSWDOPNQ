"use client"

import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import data from "../../lib/data.json"

import { useEffect, useState } from "react"

export default function Response(){
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(data);

    const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    }

    // if (term === "") {
    //     setResults(originalData)
    // } else {
    //     const filtered = originalData.filter((item) =>
    //     item.name.toLowerCase().includes(term.toLowerCase())
    //     )
    //     setResults(filtered)
    // }
    // }

    useEffect(() => {
    const fetchResponses = async () => {
        const { data, error } = await supabase
        .from("respondents")
        .select("*")
        .order("respondent_id", { ascending: false })

        if (!error) {
        setResults(data)
        } else {
        console.error(error)
        }
    }

    fetchResponses()
    }, [])

    return(
        <div>
            <main>
                <h1 className="font-black text-3xl py-5 px-2">RESPONSES</h1>
                <div className="p-3 w-full flex flex-col justify-start">
                    
                    <label htmlFor="search" className="font-medium text-1xl lg:text-2xl">Search</label>
                    <Input 
                        type="text" 
                        placeholder="Seach by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {/* <ul>
                        {results.map((item) => (
                            <li key={item.id}>
                                {item.name} ({item.age})
                            </li>
                        ))}
                    </ul> */}
                    {/* <form action="get" className="flex flex-row gap-1">
                        
                        <Button className="bg-slate-800 hover:bg-amber-600" type="submit">Search</Button>
                    </form> */}
                    <br />

                    <Table className="rounded-md border p-1">
                        <TableHeader className="border bg-slate-200">
                            <TableRow className="border">
                                <TableCell>Respondent ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Age</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="border-b-red-500">
                            {results.map((item) => (
                                <TableRow key={item.id} className="rounded-md border-b-red-200 ">
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.age}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> 
                </div>
            </main>
        </div>
    )
}