import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuestLayout } from "@/comon/guestLayout";
import {
    Progress
} from "@/components/ui/progress"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useEffect, useState } from "react";
import apiService from "@/comon/api/apiService";
import { CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function RoleSelection() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [count, startCount] = useState<Number>(0)
    const [searchParams, setSearchParams] = useSearchParams();
    const [generalError, setgeneralError] = useState({
        errorMessage: ""
    });

    const selectedRole = (role: string) => {
        setSearchParams({
            role,
            progress: '75',
            step: '2'
        });
    }

    const [formData, setFormData] = useState({
        joiningId: "",
        dob: "",
        joininDate: "",
        role: searchParams.get('role'),
        step: Number(searchParams.get('step'))
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            role: searchParams.get("role") ?? "",
            step: Number(searchParams.get("step")) || 1,
        }));
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setgeneralError({
            errorMessage: ""
        })

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const nextStepSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!formData.dob || !formData.joiningId || !formData.joininDate) {
                setgeneralError({
                    errorMessage: "All fields are required"
                })
                return;
            }

            const res = await apiService.post("/v2/user/next-step", formData);

            if (res.data.data?.success) {
                setSearchParams({
                    role: searchParams.get('role') ?? '',
                    progress: '100',
                    step: '3'
                });

                startCount(1);

                setTimeout(() => {
                    queryClient.clear();
                    navigate("/dashboard");
                }, 3000)
            } else {
                setgeneralError({
                    errorMessage: "Something went wrong!"
                })

                setTimeout(() => {
                    window.location.reload();
                }, 250)
            }
        } catch (error) {
            setgeneralError({
                errorMessage: "Something went wrong!"
            })
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <GuestLayout>
            <div className="flex flex-col gap-3">
                <div className="mb-4 flex flex-col gap-1">
                    <p className="text-sm">Step {Number(searchParams.get('step')) || 35} out of 3</p>
                    <Progress value={Number(searchParams.get('progress')) || 35} />
                </div>
                {searchParams.get('step') === "2" ? (
                    <>
                        <Card className="w-110 py-8 px-3">
                            <CardContent>
                                {generalError.errorMessage && (
                                    <>

                                        <p className="text-sm text-destructive border bg-red-950 p-2 rounded-md text-center mb-5">
                                            <i className="ri-error-warning-line me-2 text-base"></i>
                                            {generalError.errorMessage}
                                        </p>

                                    </>
                                )}
                                <form onSubmit={nextStepSubmission} className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-3">
                                        <Label>Joining ID</Label>
                                        <Input value={formData.joiningId}
                                            onChange={handleChange} type="text" name="joiningId" className="py-4" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Date of birth</Label>
                                        <Input type="date" name="dob" onChange={handleChange} value={formData.dob} className="py-4" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Joining date</Label>
                                        <Input type="date" name="joininDate" value={formData.joininDate} onChange={handleChange} className="py-4" />
                                    </div>
                                    <Button className="mt-4 py-4.5 cursor-pointer" disabled={submitting}>
                                        {submitting ? <>
                                            <i className="ri-loader-2-line text-xl animate-spin"></i>
                                            Submiting your request
                                        </> : <>
                                            Continue for final step
                                            <i className="ri-arrow-right-double-line text-xl"></i>
                                        </>
                                        }
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </>
                ) : searchParams.get('step') === "3" ?
                    <>
                        <Card className="mx-auto mt-8 max-w-lg p-8 text-center shadow-lg">
                            <div className="flex flex-col items-start">
                                <div className="mb-5 flex flex-row gap-2 items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-green-100">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-start text-base font-medium">Congratulations</p>
                                        <p className="text-sm font-xs text-gray-400">All steps are completed</p>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-muted-foreground text-start">
                                    You have successfully completed the final step.
                                    Your information has been submitted successfully.
                                </p>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Thank you for completing the process.
                                </p>

                                <Link to={"/dashboard"}>
                                    <Button className="mt-6 cursor-pointer rounded py-5 px-4">
                                        <i className="ri-external-link-line text-lg"></i>
                                        You are redirecting within {count ? "3" : "0"} seconds
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </> :
                    <>
                        <Card className="border-0 shadow-2xl backdrop-blur-md rounded-sm">
                            <CardContent className="p-10">
                                <p className="mb-4 text-base">Hi</p>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold">
                                        Welcome to TeamHub
                                    </h1>

                                    <p className="mt-2 text-muted-foreground">
                                        Choose How You&apos;d Like to Continue
                                    </p>
                                </div>

                                <div className="flex flex-row gap-3">
                                    <Button onClick={() => selectedRole('hr')} className="flex-1 cursor-pointer text-base rounded-sm py-5 font-semibold">
                                        <i className="ri-suitcase-line text-lg"></i>
                                        HR
                                    </Button>
                                    <Button onClick={() => selectedRole('employee')} className="flex-1 cursor-pointer text-base rounded-sm py-5 font-semibold">
                                        <i className="ri-user-2-line text-lg"></i>
                                        Employee
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>}
            </div>
        </GuestLayout>
    );
}