import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import Application from "@/Layouts/Application"
import { useEffect, useState } from "react"


type TableData = {
    lux: number,
    temperature: number,
    dust: number,
    crisp: number,
    date: string
}
const History = () => {
    const [data, setData] = useState<TableData[]>([
        {
            lux: 200,
            date: new Date().toDateString(),
            temperature: 30,
            dust: 180,
            crisp: 70
        }
    ])
    const [page, setPage] = useState<number>(1)
    useEffect(() => { }, [page])

    return <Application title="History">
        <div className="p-5 w-full">
            <Table className="text-white">
                <TableHeader className="text-white">
                    <TableRow>
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
                        return <TableRow key={i}>
                            <TableCell>{i++}</TableCell>
                            <TableCell>{d.lux}</TableCell>
                            <TableCell>{d.temperature}</TableCell>
                            <TableCell>{d.dust}</TableCell>
                            <TableCell>{d.crisp}</TableCell>
                            <TableCell>{d.date}</TableCell>

                        </TableRow>
                    })}
                </TableBody>
            </Table></div>
    </Application>
}



export default History