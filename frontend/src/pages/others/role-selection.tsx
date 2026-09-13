import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuestLayout } from "@/comon/guestLayout";
import { useCurrentUser } from "@/hooks/userData";
import {
    Progress
} from "@/components/ui/progress"
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RoleSelection() {
    const { data: userData } = useCurrentUser();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedRole = (role: string) => {
        setSearchParams({
            role,
            progress: '75',
            step: '2'
        });
        console.log(role);
    }
    return (
        <GuestLayout>
            <div className="flex flex-col gap-3">
                <div className="mb-4 flex flex-col gap-1">
                    <p className="text-sm">Step {Number(searchParams.get('step')) || 35} out of 3</p>
                    <Progress value={Number(searchParams.get('progress')) || 35} />
                </div>
                {searchParams.get('role') ? (
                    <>
                        <Card className="w-110 py-8 px-3">
                            <CardContent className="flex flex-col gap-7">
                                <div className="flex flex-col gap-3">
                                    <Label>Joining ID</Label>
                                    <Input type="text" className="py-4" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Date of birth</Label>
                                    <Input type="date" className="py-4" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Joining date</Label>
                                    <Input type="date" className="py-4" />
                                </div>
                                <Button className="mt-4 py-4.5 cursor-pointer">
                                    Continue
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                ) : <>
                    <Card className="border-0 shadow-2xl backdrop-blur-md rounded-sm">
                        <CardContent className="p-10">
                            <p className="mb-4 text-base">Hi <strong>{userData?.firstName}</strong></p>
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