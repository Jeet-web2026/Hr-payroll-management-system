import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, UserRound, ChevronRight } from "lucide-react";
import { GuestLayout } from "@/comon/guestLayout";
import { Link } from "react-router-dom";

export default function RoleSelection() {
    return (
        <GuestLayout>
            <Card className="border-0 shadow-2xl backdrop-blur-md">
                <CardContent className="p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-center">
                            Welcome to TeamHub
                        </h1>

                        <p className="mt-2 text-muted-foreground text-center">
                            Choose How You&apos;d Like to Continue
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* HR */}
                        <Link to="/dashboard">
                            <Button
                                variant="outline"
                                className="group h-auto justify-between rounded-2xl border-2 p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-xl"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="rounded-xl bg-primary/10 p-4">
                                        <BriefcaseBusiness className="h-8 w-8 text-primary" />
                                    </div>

                                    <div className="text-left">
                                        <h2 className="text-lg font-semibold">
                                            Continue as HR
                                        </h2>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Manage employees, attendance,
                                            payroll, leaves and reports.
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>

                        {/* Employee */}
                        <Button
                            variant="outline"
                            className="group h-auto justify-between rounded-2xl border-2 p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-xl"
                        >
                            <div className="flex items-center gap-5">
                                <div className="rounded-xl bg-primary/10 p-4">
                                    <UserRound className="h-8 w-8 text-primary" />
                                </div>

                                <div className="text-left">
                                    <h2 className="text-lg font-semibold">
                                        Continue as Employee
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        View attendance, salary slips,
                                        leaves and your profile.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}