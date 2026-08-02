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
import { useEffect, useState } from "react"
import apiService from "@/comon/api/apiService"
import type { NotificationsDataType } from "@/comon/types/notification/notificationsDataType"
import { toast } from "sonner"
import type { NotificationStatusType } from "@/comon/types/notification/notificationType"
import { Badge } from "@/components/ui/badge"

const NotificationManagement = () => {
    const { data: currentUser } = useCurrentUser();
    const [isLoading, setIsLoading] = useState(false);
    const [Notifications, setNotificationsData] = useState<NotificationsDataType[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);

                const response = await apiService.get('/v2/notifications/all', {});

                const raw = response?.data?.data;

                const data: NotificationsDataType[] =
                    Array.isArray(raw) ? raw :
                        typeof raw === 'object' && raw !== null ? Object.values(raw) :
                            [];

                setNotificationsData(data);
            } catch (err) {
                toast.error('Something went wrong!');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    function setNotificationBadge(notificationStatus: NotificationStatusType) {
        switch (notificationStatus) {
            case 'new':
                return <Badge className="bg-green-700 text-white hover:bg-green-900 rounded">New</Badge>
            case 'read':
                return <Badge variant="secondary" className="rounded">Read</Badge>
            case 'deleted':
                return <Badge variant="destructive" className="rounded">Deleted</Badge>
            default:
                return <Badge variant="secondary" className="rounded">{notificationStatus}</Badge>
        }
    }
    return (
        <DashboardLayout sideHeader="Notification Management">
            <Card className="border-none shadow-none rounded-t-none min-h-screen bg-background">
                <CardContent>
                    <Table className="border">
                        <TableHeader>
                            <TableRow className="bg-secondary">
                                <TableHead className="w-2/4 border text-base font-medium">Notification Subject</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Received at</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Status</TableHead>
                                <TableHead className="w-1/4 border text-base font-medium">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ?
                                <>
                                    <TableRow>
                                        <TableCell className="text-center flex gap-2 text-base" colSpan={4}>
                                            <i className="ri-loader-4-line animate-spin"></i> Loading
                                        </TableCell>
                                    </TableRow>
                                </> :
                                <>
                                    {Notifications.map((Notification, index) => (
                                        <TableRow key={index} className={`${Notification.status === 'new' ? 'bg-zinc-900' : ''}`}>
                                            <TableCell className="font-medium border capitalize">{Notification.content}</TableCell>
                                            <TableCell className="border">{Notification.receivedAt}</TableCell>
                                            <TableCell className="border">{setNotificationBadge(Notification.status as NotificationStatusType)}</TableCell>
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
                                </>

                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}

export default NotificationManagement
