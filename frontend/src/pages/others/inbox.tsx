import { DashboardLayout } from "@/comon/dashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"

export const Inbox = () => {
    return (
        <DashboardLayout sideHeader="Inbox Management">
            <div className="p-5">
                <Card className="p-5">
                    <Table>
                        <TableHeader>
                            <TableRow className="border text-base">
                                <TableHead className="border-r">Name</TableHead>
                                <TableHead className="border-r">Date</TableHead>
                                <TableHead className="border-r">Description</TableHead>
                                <TableHead className="border-r text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="border w-1/4">
                                    Jit nath
                                </TableCell>
                                <TableCell className="border w-1/4">
                                    24-05-2026
                                </TableCell>
                                <TableCell className="border w-3/4">
                                    I want to leave
                                </TableCell>
                                <TableCell className="border gap-3 flex flex-row">
                                    <Button variant="secondary" className="border p-2 border-green-700 bg-green-950 rounded cursor-pointer">
                                        <Check />
                                    </Button>
                                    <Button variant="secondary" className="border p-2 border-red-700 bg-red-950 rounded cursor-pointer">
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </DashboardLayout>
    )
}
