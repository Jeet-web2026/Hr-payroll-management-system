import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { DashboardLayout } from "@/comon/dashboardLayout"
import { useEffect, useState } from "react"
import apiService from "@/comon/api/apiService"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BadgeAlert, BadgeCheckIcon, Edit, ScanEye, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

export const Dashboard = () => {
    type User = {
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: string;
        id?: string;
        loginStatus?: string;
        designation?: string;
        experience?: number;
        isEmailVerified?: boolean;
    };

    const [userData, setUserData] = useState<User | null>(null);
    const [allUsersData, setAllUsersData] = useState<User[]>([]);
    const [allUsersmetaData, setAllUsersmetaData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const res = await apiService.get("/user/me");
            setUserData(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch user data", { position: "top-right", richColors: true });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchallUser = async () => {
        try {
            setIsLoading(true);
            const res = await apiService.get("/user/all?page=1&limit=10");
            setAllUsersData(res.data.data);
            setAllUsersmetaData(res.data.meta);
        } catch (error) {
            toast.error("Failed to fetch user data", { position: "top-right", richColors: true });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchallUser();
    }, []);
    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        {isLoading &&
                            <>
                                <div className="p-5 flex flex-col gap-6">
                                    <Skeleton className="h-90 w-full rounded-md" />
                                    <Skeleton className="h-80 w-full rounded-md" />
                                </div>
                            </>
                        }

                        {!isLoading && (
                            <>
                                <div className="px-4 lg:px-6">
                                    <ChartAreaInteractive />
                                </div>
                                {userData?.role?.toLowerCase() === "hr" && <>
                                    <div className="px-5">
                                        <Card className="px-5 overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border text-base">
                                                        <TableHead className="border-r"></TableHead>
                                                        <TableHead className="border-r">Name</TableHead>
                                                        <TableHead className="border-r">Email</TableHead>
                                                        <TableHead className="border-r">Role</TableHead>
                                                        <TableHead className="border-r">Designation</TableHead>
                                                        <TableHead className="border-r">Experience</TableHead>
                                                        <TableHead className="text-center">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {allUsersData?.length > 0 ? (
                                                        allUsersData.map((user, index) => (
                                                            <TableRow key={index} className="border">
                                                                <TableCell className="border text-center">
                                                                    {user.loginStatus === 'online' ? <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span> : <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500"></span>}
                                                                </TableCell>
                                                                <TableCell className="border">{user.firstName} {user.lastName}</TableCell>
                                                                <TableCell className="border flex flex-row gap-1.5 items-center">
                                                                    {user.isEmailVerified ? <BadgeCheckIcon size={15} className="text-blue-400" /> : <BadgeAlert className="text-red-400" size={15} />}
                                                                    {user.email}
                                                                </TableCell>
                                                                <TableCell className="border capitalize">{user.role}</TableCell>
                                                                <TableCell className="border">{user.designation ? user.designation : "Not assigned"}</TableCell>
                                                                <TableCell className="border">{user.experience !== undefined ? user.experience : "Not specified"}</TableCell>
                                                                <TableCell className="border flex items-center justify-center gap-2">
                                                                    <Link to={`/user/edit/${user.id}`} className="cursor-pointer rounded border p-2 border-blue-700 bg-blue-950">
                                                                        <Edit size={16} />
                                                                    </Link>
                                                                    <Link to={`/user/view/${user.id}`} className="cursor-pointer rounded border p-2 border-green-700 bg-green-950">
                                                                        <ScanEye size={16} />
                                                                    </Link>
                                                                    <Link to={`/user/delete/${user.id}`} className="cursor-pointer rounded border p-2 border-red-700 bg-red-950">
                                                                        <Trash2Icon size={16} />
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow className="border">
                                                            <TableCell colSpan={6} className="text-center">
                                                                No data found!
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                            <div className="flex flex-row justify-between items-center">
                                                {allUsersmetaData && <span className="text-sm text-muted-foreground">
                                                    Showing {allUsersData?.length} of {allUsersmetaData?.total} entries
                                                </span>}
                                            </div>
                                        </Card>
                                    </div>
                                </>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
