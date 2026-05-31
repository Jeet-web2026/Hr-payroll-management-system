import apiService from "@/comon/api/apiService";
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
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
        createdAt?: Date;
        lastLogin?: Date;
        phone?: number;
        profilePicture?: string;
        status?: string;
    };


    const { userId } = useParams();
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const userData = async () => {
            try {
                setLoading(true);
                const data = await apiService.get(`user/${userId}`, {});
                setData(data.data.data);
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
                <div className="p-5 flex flex-col lg:flex-row gap-6">
                    <Skeleton className="h-162 w-1/4 rounded-md" />
                    <Skeleton className="h-162 w-3/4 rounded-md" />
                </div>
            )}
            {!loading && (
                <DashboardLayout sideHeader="View User">
                    <div className="p-5">
                        <Card>
                            <CardContent>
                                {data && (
                                <>
                                    <img src={data.profilePicture} alt={data.firstName} className="h-30 w-30 rounded" />
                                </>
                            )}
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            )}
        </>
    )
}
