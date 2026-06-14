import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/comon/dashboardLayout";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/userData";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import apiService from "@/comon/api/apiService";

export function AddUser() {
    const { data: currentUser } = useCurrentUser();
    const [permissionData, setPermissionData] = useState<any[]>([]);
    let createUserType = '';

    if (currentUser?.role === 'admin') {
        createUserType = 'Company';
    } else {
        createUserType = 'Employee';
    }

    const fetchAllpermissions = async () => {
        try {
            const response = await apiService.get('/user/permissions');

            setPermissionData(
                Object.values(response.data?.data || {})
            );
        } catch (error) {
            toast.error("Failed to fetch permission data. Please try again.");
        }
    };

    useEffect(() => {
        fetchAllpermissions();
    }, []);

    return (
        <DashboardLayout sideHeader={`Add ${createUserType}`}>
            <div className="container mx-auto max-w-7xl p-4 md:p-6">
                <div className="mb-6 flex flex-col gap-2">
                    <p className="text-muted-foreground">
                        Create a new {createUserType} account and assign permissions.
                    </p>
                </div>

                <form className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Enter basic {createUserType} details.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>
                                        {createUserType && createUserType === 'Employee' && (
                                            `First`
                                        )} Name</Label>
                                    <Input placeholder="John" name="first-name" />
                                </div>

                                {createUserType && createUserType === 'Employee' && (
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input placeholder="Doe" name="last-name" />
                                    </div>
                                )}

                                {createUserType && createUserType === 'Company' && (
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label>UAN Number</Label>
                                        <Input type="text" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input placeholder="+91 9876543210" />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        {createUserType && createUserType === 'Employee' ? (
                                            `Date of Birth`
                                        ) : (
                                            `Established At`
                                        )}
                                    </Label>
                                    <Input type="date" />
                                </div>

                                {createUserType && createUserType === 'Employee' && (
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <Label>Address</Label>
                                    <Textarea
                                        placeholder="Enter full address..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {createUserType && createUserType === 'Employee' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Employment Information</CardTitle>
                                <CardDescription>
                                    Define employee job details.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Employee ID</Label>
                                        <Input placeholder="EMP-001" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Designation</Label>
                                        <Input placeholder="Software Engineer" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Input placeholder="Engineering" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Joining Date</Label>
                                        <Input type="date" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contract Start Date</Label>
                                        <Input type="date" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contract End Date</Label>
                                        <Input type="date" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Employment Type</Label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="full-time">
                                                    Full Time
                                                </SelectItem>
                                                <SelectItem value="part-time">
                                                    Part Time
                                                </SelectItem>
                                                <SelectItem value="intern">
                                                    Intern
                                                </SelectItem>
                                                <SelectItem value="contract">
                                                    Contract
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Salary</Label>
                                        <Input placeholder="50000" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Work Location</Label>
                                        <Input placeholder="Mumbai Office" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role & Access</CardTitle>
                            <CardDescription>
                                Assign system permissions and role.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {createUserType && createUserType === 'Company' ? (
                                                <>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="company">Company</SelectItem>
                                                </>
                                            ) : (
                                                <>
                                                    <SelectItem value="hr">HR</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="employee">Employee</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Temporary password"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2 mb-5 mt-3">
                                    <h3 className="mb-3">Manage Permissions</h3>
                                    <div className="flex flex-col lg:flex-row gap-6 mt-8 lg:mt-0">
                                        {permissionData.map((permission) => (
                                            <Field key={permission.id} orientation="horizontal" className="capitalize text-nowrap">
                                                <Checkbox
                                                    id={permission.id}
                                                    name={permission.permissionvalue}
                                                />
                                                <Label htmlFor={permission.id}>
                                                    {permission.permissionvalue}
                                                </Label>
                                            </Field>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button variant="outline">
                            Cancel
                        </Button>

                        <Button type="submit">
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}