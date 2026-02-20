import MyBarChart from "@/components/MyBarChart"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase/client"


export default function perBarangay(){
    const fetchBarangayData = async (selectedBarangay) => {
    const { data, error } = await supabase
        .from("responses")
        .select(`
        q_id,
        choice,
        respondents!inner ( barangay )
        `)
        .eq("respondents.barangay", selectedBarangay)

    if (error) {
        console.error(error)
        return
    }

    console.log(data)
    }
    return(
        <main>
            <h1 className="font-black text-3xl py-5 px-2">PER BARANGAY RESPONSES</h1>
            <Separator/>
            <br />

            <div className="flex flex-row">
                <p>QUESTIONS Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <Separator/>
            <MyBarChart/>
        </main>
    )
}