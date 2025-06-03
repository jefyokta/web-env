import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import Application from "@/Layouts/Application"
import { useEffect, useState } from "react"


type TableData = {
    lux: number
    date: string
    temperature: number
    dust: number
    crisp: number
    created_at: string
}

type PaginatedResponse = {
    data: TableData[]
    page: number
    per_page: number
    total: number
    total_pages: number
}
const History = () => {
    const [data, setData] = useState<TableData[]>([
    ])
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1)
    useEffect(() => {
        fetch(`/api/history/${page}`)
            .then((res) => res.json())
            .then((res: PaginatedResponse) => {
                setData(res.data)
                setTotalPages(res.total_pages)
            })
    }, [page])

    return <Application title="History">
        <div className="p-5 w-full">
            <Table className="text-white table-fixed">
                <TableHeader className="text-white w-full">
                    <TableRow className="w-full">
                        <TableHead className="text-white">No</TableHead>
                        <TableHead className="text-white">Lux</TableHead>
                        <TableHead className="text-white">Temperature</TableHead>
                        <TableHead className="text-white">Dust</TableHead>
                        <TableHead className="text-white">Crisp</TableHead>
                        <TableHead className="text-white">Date</TableHead>




                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.map((d, i) => {
                        i++
                        return <TableRow className="border-0" key={i}>
                            <TableCell>{((20 * (page - 1))) + i }</TableCell>
                            <TableCell>{d.lux}</TableCell>
                            <TableCell>{d.temperature}</TableCell>
                            <TableCell>{d.dust}</TableCell>
                            <TableCell>{d.crisp}</TableCell>
                            <TableCell>{new Date(d.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-center space-x-5 text-zinc-200  items-center mt-4">
                <button
                    className="px-4 py-2 bg-zinc-800  cursor-pointer rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className="px-4 py-2 bg-zinc-800  cursor-pointer rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

        </div>
    </Application>
}



export default History