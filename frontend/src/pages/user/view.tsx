import apiService from "@/comon/api/apiService";
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { toast } from "sonner";

export const Userview = () => {
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


    const { userId } = useParams();
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const userData = async () => {
            try {
                setLoading(true);
                const data = await apiService.get(`user/${userId}`, {});
                setData(data.data);
                console.log(data);
            } catch (error) {
                toast.error("Failed to fetch user data", { position: "top-right", richColors: true });
            } finally {
                setLoading(false);
            }
        }

        userData();
    }, []);
    return (
        <>
            {loading && (
                <div className="p-5 flex flex-row gap-6">
                    <Skeleton className="h-162 w-1/4 rounded-md" />
                    <Skeleton className="h-162 w-3/4 rounded-md" />
                </div>
            )}
            {!loading && (
                <DashboardLayout sideHeader="View User">
                    <div className="p-5">
                        <Card>
                            {data && (
                                <>
                                
                                </>
                            )}
                        </Card>
                    </div>
                </DashboardLayout>
            )}
        </>
    )
}
