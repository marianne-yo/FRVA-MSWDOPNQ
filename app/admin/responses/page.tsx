export default function Response(){
    return(
        <div>
            <main>
                <h1 className="font-black text-3xl py-5 px-2">RESPONSES</h1>
                <div className="p-3 w-full flex flex-col justify-start">
                    <form action="get">
                        <label htmlFor="search" className="font-medium text-1xl lg:text-2xl">Search</label> <br />
                        <input type="search" name="" id="" className="bg-slate-100 border-gray-500 border w-[80%] p-3 mb-1 rounded-xl"/>
                        <input type="submit" value="SEARCH"/>
                    </form>
                    <table className="bg-blue-300 p-1">
                        <tr>
                            <td>Name</td>
                            <td>4Ps Member</td>
                        </tr>
                    </table>
                </div>
            </main>
        </div>
    )
}