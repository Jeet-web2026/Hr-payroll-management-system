import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/comon/dashboardLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiService from "@/comon/api/apiService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserDatatype } from "@/comon/types/user/userDatatype";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/userData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditUser() {
    const param = useParams();
    const userId = param.userId;
    const { data: currentUser } = useCurrentUser();

    const [userData, setUserData] = useState<UserDatatype | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await apiService.get(`/user/${userId}`);
            setUserData(response.data?.data);
        } catch (error) {
            toast.error("Failed to fetch user data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const activateAccount = async (userId: any) => {
        setLoading(true);
        try {
            const response = await apiService.patch(`/user/update/${userId}`, {
                "status": "active"
            });
            setUserData(response.data?.data);
            fetchUserData();
            toast.success("User updated successfully!");
        } catch (error) {
            toast.error("Failed to update user data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const generateUsername = (
        firstName?: string,
        lastName?: string,
        dob?: string | Date
    ) => {
        const first = (firstName ?? '').trim().slice(0, 2).toLowerCase();
        const last = (lastName ?? '').trim().slice(0, 2).toLowerCase();
        const year = dob ? new Date(dob).getFullYear() : '';
        return `${first}${last}${year}`;
    };

    return (
        <DashboardLayout sideHeader={`Edit ${currentUser.role === 'admin' ? "Company" : "Candidate"}`}>
            <div className="min-h-screen bg-muted/30 p-6">
                {!loading && userData ? (
                    <>
                        <div className="grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-3">
                                <Card className="h-full">
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center">
                                            <Avatar className="h-28 w-28">
                                                <AvatarImage src={userData.profilePicture} />
                                                <AvatarFallback className="uppercase"> {userData.firstName?.[0] ?? userData.firstName?.[0]}{userData.lastName?.[0] ?? userData.lastName?.[0]} </AvatarFallback>
                                            </Avatar>

                                            <h2 className="mt-4 text-xl font-semibold">
                                                {userData.firstName} {userData.lastName}
                                            </h2>

                                            {userData.role !== 'company' && <>
                                                <p className="text-sm text-muted-foreground">
                                                    {userData.designation}
                                                </p>
                                            </>}

                                            <Badge className="mt-3 capitalize">
                                                {userData.status}
                                            </Badge>
                                        </div>

                                        <Separator className="my-5" />

                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    {userData.role === 'company' ? "UAN Number" : "Employee ID"}
                                                </p>
                                                <p className="font-medium">
                                                    {userData.role === 'company' ? userData.details?.companyUanNumber : userData.employment?.employeeId}
                                                </p>
                                            </div>
                                            {userData.role !== 'company' && <>
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Department
                                                    </p>
                                                    <p className="font-medium">
                                                        Engineering
                                                    </p>
                                                </div>
                                            </>}

                                            <div>
                                                <p className="text-muted-foreground">
                                                    {userData.role === 'company' ? "Established" : "Joining"} Date
                                                </p>
                                                <p className="font-medium">
                                                    {userData.details?.dob ? new Date(userData.details?.dob).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }) : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="my-5" />

                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Reset Password
                                            </Button>
                                            {userData.status === 'suspended' ? (
                                                <>
                                                    <Button onClick={() => activateAccount(userData.id)} className="w-full">
                                                        Activate Account
                                                    </Button>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-9">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>
                                            Update Details
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <Tabs defaultValue="personal">
                                            <TabsList className={`grid w-full ${userData.role !== 'company' ? 'grid-cols-3' : 'grid-cols-2'
                                                }`} style={{ height: "45px" }}>
                                                <TabsTrigger value="personal">
                                                    Personal
                                                </TabsTrigger>
                                                {userData.role !== 'company' && <>
                                                    <TabsTrigger value="employment">
                                                        Employment
                                                    </TabsTrigger>
                                                </>}

                                                <TabsTrigger value="account">
                                                    Account
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="personal" className="mt-3">
                                                <div className="grid gap-4 md:grid-cols-2 mt-6">

                                                    <div>
                                                        <Label className="mb-3">First Name</Label>
                                                        <Input className="h-9.5" value={userData.firstName} />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Last Name</Label>
                                                        <Input className="h-9.5" value={userData.lastName} />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Email</Label>
                                                        <Input className="h-9.5" value={userData.email} disabled />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Phone</Label>
                                                        <Input className="h-9.5" value={userData.phone} disabled />
                                                    </div>

                                                    {userData.role !== 'company' && <>
                                                        <div>
                                                            <Label className="mb-3">Date of Birth</Label>
                                                            <Input type="date" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Gender</Label>
                                                            <Input className="h-9.5" />
                                                        </div>
                                                    </>}

                                                    <div className="md:col-span-2">
                                                        <Label className="mb-3">Address</Label>
                                                        <Textarea>
                                                            {userData.details?.address}
                                                        </Textarea>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            {userData.role !== 'company' && <>
                                                <TabsContent value="employment">
                                                    <div className="grid gap-4 md:grid-cols-2 mt-6">

                                                        <div>
                                                            <Label className="mb-3">Designation</Label>
                                                            <Input className="h-9.5" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Department</Label>
                                                            <Input className="h-9.5" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Joining Date</Label>
                                                            <Input type="date" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Manager</Label>
                                                            <Input className="h-9.5" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Salary</Label>
                                                            <Input className="h-9.5" />
                                                        </div>

                                                        <div>
                                                            <Label className="mb-3">Employment Type</Label>
                                                            <Input className="h-9.5" />
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </>}

                                            <TabsContent value="account">
                                                <div className="grid gap-4 md:grid-cols-2 mt-6">

                                                    <div>
                                                        <Label className="mb-3">Username</Label>
                                                        <Input
                                                            className="h-9.5 uppercase"
                                                            value={generateUsername(userData.firstName, userData.lastName, userData.details?.dob)}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Role</Label>
                                                        {currentUser.role === 'admin' ? (
                                                            <Select
                                                                value={userData.role}
                                                                onValueChange={(value) =>
                                                                    setUserData((prev) => ({ ...prev, role: value }))
                                                                }
                                                            >
                                                                <SelectTrigger className="h-9.5 w-full capitalize">
                                                                    <SelectValue placeholder="Select role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="admin">Admin</SelectItem>
                                                                    <SelectItem value="company">Company</SelectItem>
                                                                    <SelectItem value="user">User</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                className="h-9.5 capitalize"
                                                                value={userData.role}
                                                                readOnly
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Status</Label>
                                                        {currentUser.role === 'admin' ? (
                                                            <Select
                                                                value={userData.status}
                                                                onValueChange={(value) =>
                                                                    setUserData((prev) => ({ ...prev, status: value }))
                                                                }
                                                            >
                                                                <SelectTrigger className="h-9.5 w-full capitalize">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="active">Active</SelectItem>
                                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                                    <SelectItem value="suspended">Suspended</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                className="h-9.5 capitalize"
                                                                value={userData.status}
                                                                readOnly
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Last Login</Label>
                                                        <Input
                                                            readOnly
                                                            value={
                                                                userData.lastLogin
                                                                    ? new Date(userData.lastLogin).toLocaleDateString('en-CA')
                                                                    : ''
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <div className="flex lg:flex-row flex-col justify-end items-center gap-3 mt-5 mb-2.5">
                                                <Button variant="outline" className="p-4">
                                                    Cancel
                                                </Button>
                                                <Button className="p-4">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col md:flex-row gap-5">
                        <Card className="p-0 w-1/3">
                            <Skeleton className="min-h-[550px]" />
                        </Card>
                        <Card className="p-0 w-2/3">
                            <Skeleton className="min-h-[550px]" />
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
