import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/userData"

const NotificationManagement = () => {
    const { data: currentUser } = useCurrentUser();
    const Notifications = [
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
        {
            content: "INV001",
            status: "Paid",
            receivedAt: "03:55 Pm, 02-08-2026"
        },
    ]
    return (
        <DashboardLayout sideHeader="Notification Management">
            <Card className="border-none shadow-none rounded-t-none min-h-screen bg-background">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary">
                                <TableHead className="w-2/4 border text-base font-medium">Notification Subject</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Received at</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Status</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Notifications.map((Notification, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium border">{Notification.content}</TableCell>
                                    <TableCell className="border">{Notification.receivedAt}</TableCell>
                                    <TableCell className="border">{Notification.status}</TableCell>
                                    <TableCell className="border">
                                        <ButtonGroup>
                                            <Button variant={"outline"} className="cursor-pointer">
                                                <i className="ri-eye-line"></i>
                                                Read
                                            </Button>
                                            {currentUser ? currentUser.role === 'admin' &&
                                                <>
                                                    <Button variant={"destructive"} className="cursor-pointer">
                                                        <i className="ri-delete-bin-5-line"></i>
                                                        Delete
                                                    </Button>
                                                </> : null
                                            }
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}

export default NotificationManagement
