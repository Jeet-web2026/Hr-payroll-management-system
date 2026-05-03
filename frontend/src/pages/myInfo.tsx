import apiService from "@/comon/api/apiService"
import { ResponseHandler } from "@/comon/api/responseHandler"
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export const MyInfo = () => {
    const [isPending, setIsPending] = useState(false);
    const [User, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        status: "",
    });

    const fetchUserData = async () => {
        setIsPending(true)
        try {
            const res = await apiService.get('/user/me', {});
            ResponseHandler(res);
            setUser(res.data.data);
        } catch (error) {
            ResponseHandler(error);
        } finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <DashboardLayout>
            {isPending ? (
                <Skeleton className="w-full h-50 rounded-md m-2" />
            ) : (
                <Card className="m-3 p-3 pb-5">
                    <CardHeader>
                        <div className="flex flex-row justify-between items-center mb-4">
                            <CardTitle className="text-2xl">Account Details</CardTitle>
                            <p className={`border px-3 py-2 rounded-md ${User.status === 'active'
                                ? 'border-green-800 bg-green-950'
                                : User.status === 'inactive'
                                    ? 'border-red-600 bg-red-700'
                                    : 'border-yellow-600 bg-yellow-700'
                                } capitalize`}
                            >{User.role}</p>
                        </div>
                        <hr />
                    </CardHeader>
                    <CardContent className="mt-3">
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={User.firstName}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={User.lastName}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstName">Email</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={User.email}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastName">Phone</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={User.phone}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </DashboardLayout>
    )
}
