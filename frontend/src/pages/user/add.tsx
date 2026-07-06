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
import { Link, useNavigate } from "react-router-dom";

export function AddUser() {
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser();
    const [permissionData, setPermissionData] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const permissions = permissionData.reduce((acc, permission) => {
        acc[permission.permissionvalue] = false;
        return acc;
    }, {} as Record<string, boolean>);
    const initialFormData = {
        "first-name": "",
        "last-name": "",
        "uan-number": "",
        "email": "",
        "phone-number": "",
        "dob": "",
        "gender": "",
        "address": "",
        "employee-id": "",
        'designation': "",
        'department': "",
        'joining-date': "",
        'contract-start-date': "",
        'contract-end-date': "",
        'employment-type': "",
        'salary': "",
        'work-location': "",
        'role': "",
        'status': "",
        'password': "",
        ...permissions
    };
    const [formData, setFromdata] = useState(initialFormData);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFromdata((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSelectChange = (name: string, value: string) => {
        setFromdata((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFromdata((prev: any) => ({
            ...prev,
            [name]: checked,
        }));
    };

    let createUserType = '';

    if (currentUser?.role === 'admin') {
        createUserType = 'Company';
    } else if (currentUser?.role === 'company') {
        createUserType = 'Human Resource';
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

    const usercreationFormSubmit = async (event: any) => {
        event.preventDefault();

        const payload = {
            name: `${formData['first-name']} ${formData['last-name']}`,
            contactNumber: formData['phone-number'],
            uanNumber: formData['uan-number'],
            email: formData['email'],
            establishedAt: formData['dob'],
            address: formData['address'],
            status: formData['status'],
            password: formData['password'],
            role: formData['role'],
        };

        try {
            const response = await apiService.post("/v2/user/add", payload);
            toast.success(response.data.message);
            setFromdata(initialFormData);
            navigate('/manage-permissions');

        } catch (error: any) {
            setErrors(error.response.data.errors);
            toast.error(error.response.data.message);
        }
    }

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

                <form className="space-y-6" onSubmit={usercreationFormSubmit}>
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
                                    <Input placeholder="John" value={formData['first-name']} name="first-name" onChange={handleChange} />
                                    {errors.name && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors.name.join(", ")}
                                        </p>
                                    )}
                                </div>

                                {createUserType && createUserType === 'Employee' && (
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input placeholder="Doe" value={formData['last-name']} name="last-name" onChange={handleChange} />
                                        {errors.name && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors.name.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {createUserType && createUserType === 'Company' && (
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label>UAN Number</Label>
                                        <Input type="text" value={formData['uan-number']} name="uan-number" onChange={handleChange} />
                                        {errors['uan-number'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['uan-number'].join(", ")}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="john@example.com" value={formData['email']} name="email" onChange={handleChange} />
                                    {errors['email'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['email'].join(", ")}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input placeholder="+91 9876543210" value={formData['phone-number']} name="phone-number" onChange={handleChange} />
                                    {errors['contactNumber'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['contactNumber'].join(", ")}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        {createUserType && createUserType === 'Employee' ? (
                                            `Date of Birth`
                                        ) : (
                                            `Established At`
                                        )}
                                    </Label>
                                    <Input type="date" name="dob" value={formData['dob']} onChange={handleChange} />
                                    {errors['establishedAt'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['establishedAt'].join(", ")}
                                        </p>
                                    )}
                                </div>

                                {createUserType && createUserType === 'Employee' && (
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select value={formData["gender"]} name="gender" onValueChange={(value) => handleSelectChange("gender", value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors['gender'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['gender'].join(", ")}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <Label>Address</Label>
                                    <Textarea
                                        placeholder="Enter full address..."
                                        className="min-h-[100px]"
                                        name="address"
                                        value={formData['address']}
                                        onChange={handleChange}
                                    />
                                    {errors['address'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['address'].join(", ")}
                                        </p>
                                    )}
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
                                        <Input placeholder="EMP-001" value={formData['employee-id']} name="employee-id" onChange={handleChange} />
                                        {errors['employee-id'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['employee-id'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Designation</Label>
                                        <Input placeholder="Software Engineer" value={formData['designation']} name="designation" onChange={handleChange} />
                                        {errors['designation'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['designation'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Input placeholder="Engineering" value={formData['department']} name="department" onChange={handleChange} />
                                        {errors['department'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['department'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Joining Date</Label>
                                        <Input type="date" value={formData['joining-date']} name="joining-date" onChange={handleChange} />
                                        {errors['joining-date'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['joining-date'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contract Start Date</Label>
                                        <Input type="date" value={formData['contract-start-date']} name="contract-start-date" onChange={handleChange} />
                                        {errors['contract-start-date'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['contract-start-date'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contract End Date</Label>
                                        <Input type="date" value={formData['contract-end-date']} name="contract-end-date" onChange={handleChange} />
                                        {errors['contract-end-date'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['contract-end-date'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Employment Type</Label>
                                        <Select value={formData['employment-type']} onValueChange={(value) => handleSelectChange("employment-type", value)}>
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
                                        {errors['employment-type'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['employment-type'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Salary</Label>
                                        <Input placeholder="50000" value={formData['salary']} name="salary" onChange={handleChange} />
                                        {errors['salary'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['salary'].join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Work Location</Label>
                                        <Input placeholder="Mumbai Office" value={formData['work-location']} name="work-location" onChange={handleChange} />
                                        {errors['work-location'] && (
                                            <p className="text-xs text-red-400 capitalize">
                                                {errors['work-location'].join(", ")}
                                            </p>
                                        )}
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
                                    <Select value={formData['role']} onValueChange={(value) => handleSelectChange("role", value)}>
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
                                    {errors['role'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['role'].join(", ")}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={formData['status']} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors['status'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['status'].join(", ")}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Temporary password"
                                        className="w-full"
                                        name="password"
                                        value={formData['password']}
                                        onChange={handleChange}
                                    />
                                    {errors['password'] && (
                                        <p className="text-xs text-red-400 capitalize">
                                            {errors['password'].join(", ")}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 mb-5 mt-3">
                                    <h3 className="mb-3">Manage Permissions</h3>
                                    <div className="flex flex-col lg:flex-row gap-6 mt-8 lg:mt-0">
                                        {permissionData.map((permission) => (
                                            <Field key={permission.id} orientation="horizontal" className="capitalize text-nowrap">
                                                <Checkbox
                                                    id={permission.id}
                                                    name={permission.permissionvalue}
                                                    checked={!!formData[permission.permissionvalue]}
                                                    onCheckedChange={(checked) =>
                                                        handleCheckboxChange(
                                                            permission.permissionvalue,
                                                            checked === true
                                                        )
                                                    }
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
                        <Link to="/manage-permissions">
                            <Button variant="outline" className="cursor-pointer">
                                Cancel
                            </Button>
                        </Link>

                        <Button type="submit" className="cursor-pointer">
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}