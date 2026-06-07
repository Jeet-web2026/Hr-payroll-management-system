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
import type { UserDatatype } from "@/comon/types/userDatatype";

export function EditUser() {
    const param = useParams();
    const userId = param.userId;

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

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <DashboardLayout sideHeader="Edit User">
            <div className="min-h-screen bg-muted/30 p-6">
                {!loading && userData ? (
                    <>
                        <div className="grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-3">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center">
                                            <Avatar className="h-28 w-28">
                                                <AvatarImage src={userData.profilePicture} />
                                                <AvatarFallback> {userData.firstName?.[0] ?? userData.firstName?.[0]}{userData.lastName?.[0] ?? userData.lastName?.[0]} </AvatarFallback>
                                            </Avatar>

                                            <h2 className="mt-4 text-xl font-semibold">
                                                {userData.firstName} {userData.lastName}
                                            </h2>

                                            <p className="text-sm text-muted-foreground">
                                                Full Stack Developer
                                            </p>

                                            <Badge className="mt-3 capitalize">
                                                {userData.status}
                                            </Badge>
                                        </div>

                                        <Separator className="my-5" />

                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Employee ID
                                                </p>
                                                <p className="font-medium">
                                                    EMP-1001
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Department
                                                </p>
                                                <p className="font-medium">
                                                    Engineering
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Joined Date
                                                </p>
                                                <p className="font-medium">
                                                    01 Jan 2025
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
                                                    <Button className="w-full">
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Update Details
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <Tabs defaultValue="personal">
                                            <TabsList className="grid w-full grid-cols-3" style={{ height: "45px" }}>
                                                <TabsTrigger value="personal">
                                                    Personal
                                                </TabsTrigger>

                                                <TabsTrigger value="employment">
                                                    Employment
                                                </TabsTrigger>

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

                                                    <div>
                                                        <Label className="mb-3">Date of Birth</Label>
                                                        <Input type="date" />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Gender</Label>
                                                        <Input className="h-9.5" />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <Label className="mb-3">Address</Label>
                                                        <Input className="h-9.5" />
                                                    </div>
                                                </div>
                                            </TabsContent>

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

                                            <TabsContent value="account">
                                                <div className="grid gap-4 md:grid-cols-2 mt-6">

                                                    <div>
                                                        <Label className="mb-3">Username</Label>
                                                        <Input className="h-9.5" />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Role</Label>
                                                        <Input className="h-9.5" />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Status</Label>
                                                        <Input className="h-9.5" />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-3">Last Login</Label>
                                                        <Input disabled />
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
                    <div className="min-h-screen">
                        <Card className="p-0">
                            <Skeleton className="min-h-screen" />
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
