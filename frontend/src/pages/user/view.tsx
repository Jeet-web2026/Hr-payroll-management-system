import apiService from "@/comon/api/apiService";
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, FileExclamationPointIcon } from "lucide-react";
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
                    <Skeleton className="h-162 lg:w-1/4 w-full rounded-md" />
                    <Skeleton className="h-162 lg:w-3/4 w-full rounded-md" />
                </div>
            )}
            {!loading && (
                <DashboardLayout sideHeader="View User">
                    <div className="p-5">
                        <Card className="w-full max-w-full mx-auto shadow-lg border-0 rounded-2xl overflow-hidden pt-0">
                            <CardContent className="p-0">
                                {data && (
                                    <>
                                        <div className="bg-gradient-to-r from-blue-950 to-indigo-700 h-32"></div>
                                        <div className="px-6 pb-6">
                                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 -mt-16">
                                                <img
                                                    src={data.profilePicture}
                                                    alt={data.firstName}
                                                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                                />
                                                <div className="flex-1 text-center lg:text-left">
                                                    <h2 className="text-2xl font-bold">
                                                        {data.firstName} {data.lastName}
                                                    </h2>

                                                    <p className="text-gray-500 mt-1">
                                                        {data.designation}
                                                    </p>

                                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                                                            {data.role}
                                                        </span>

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm capitalize flex flex-row items-center gap-1  ${data.status === "active"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {data.status
                                                                ? <CheckIcon className="w-5 h-5 bg-green-800 rounded-full p-1 text-white" />
                                                                : <FileExclamationPointIcon className="w-5 h-5 bg-yellow-800 rounded-full p-1 text-white" />}
                                                            {data.status}
                                                        </span>

                                                        <span
                                                            className={`px-2 py-1 rounded-full text-sm flex flex-row items-center gap-1 ${data.isEmailVerified
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                             {data.isEmailVerified
                                                                ? <CheckIcon className="w-5 h-5 bg-green-800 rounded-full p-1 text-white" />
                                                                : <FileExclamationPointIcon className="w-5 h-5 bg-yellow-800 rounded-full p-1 text-white" />}
                                                            {data.isEmailVerified
                                                                ? "Verified"
                                                                : "Not Verified"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                                <div className="p-4 bg-zinc-800 rounded-xl">
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{data.email}</p>
                                                </div>

                                                <div className="p-4 bg-zinc-800 rounded-xl">
                                                    <p className="text-sm text-gray-500">Contact no.</p>
                                                    <p className="font-medium">
                                                        {data.experience}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
