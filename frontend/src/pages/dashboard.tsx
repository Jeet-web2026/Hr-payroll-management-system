import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { DashboardLayout } from "@/comon/dashboardLayout"
import { useEffect, useState } from "react"
import apiService from "@/comon/api/apiService"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export const Dashboard = () => {
    type User = {
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: string;
    };

    const [userData, setUserData] = useState<User | null>(null);
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

    useEffect(() => {
        fetchUser();
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
                                            <Table className="">
                                                <TableHeader className="border rounded-lg">
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Designation</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableHeader>
                                                <TableBody></TableBody>
                                            </Table>
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
