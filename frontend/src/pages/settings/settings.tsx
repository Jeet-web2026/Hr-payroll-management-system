import {
    User,
    Palette,
    Bell,
    Lock,
    ShieldCheck,
    KeyRound,
    Trash2,
    Mail,
    GitBranch,
    ExternalLinkIcon,
    Wrench,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";


export default function Settings() {

    return (
        <DashboardLayout sideHeader="Settings">
            <div className="min-h-screen bg-muted/30 p-5">

                <div className="space-y-5">

                    <Card className="rounded-2xl shadow-sm">

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User size={20} />
                                Profile Information
                            </CardTitle>

                            <CardDescription>
                                Update your personal details.
                            </CardDescription>

                        </CardHeader>

                        <hr />


                        <CardContent className="space-y-6">


                            <div className="flex items-center gap-5">

                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                                    JN
                                </div>


                                <Button variant="outline">
                                    Change Avatar
                                </Button>


                            </div>



                            <div className="grid md:grid-cols-2 gap-5">


                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input placeholder="Jit Nath" />
                                </div>


                                <div className="flex flex-col gap-2">
                                    <Label>Email</Label>
                                    <Input
                                        placeholder="jit@example.com"
                                    />
                                </div>



                                <div className="flex flex-col gap-2">
                                    <Label>Phone</Label>
                                    <Input placeholder="+91 XXXXX XXXXX" />
                                </div>



                                <div className="flex flex-col gap-2">
                                    <Label>Role</Label>

                                    <Input
                                        disabled
                                        value="Software Developer"
                                    />

                                </div>


                            </div>


                            <Button>
                                Save Changes
                            </Button>


                        </CardContent>

                    </Card>

                    <Card className="rounded-2xl">


                        <CardHeader>

                            <CardTitle className="flex gap-2 items-center">
                                <Palette size={20} />
                                Appearance
                            </CardTitle>


                            <CardDescription>
                                Customize application appearance.
                            </CardDescription>

                        </CardHeader>
                        <hr />


                        <CardContent className="space-y-6">


                            <div className="flex justify-between items-center">


                                <div>
                                    <p className="font-medium">
                                        Theme
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Choose application theme
                                    </p>

                                </div>



                                <Select>

                                    <SelectTrigger className="w-44">

                                        <SelectValue placeholder="Theme" />

                                    </SelectTrigger>


                                    <SelectContent>

                                        <SelectItem value="light">
                                            ☀️ Light
                                        </SelectItem>

                                        <SelectItem value="dark">
                                            🌙 Dark
                                        </SelectItem>

                                        <SelectItem value="system">
                                            💻 System
                                        </SelectItem>


                                    </SelectContent>


                                </Select>


                            </div>



                            <div className="flex justify-between items-center">


                                <div>
                                    <p className="font-medium">
                                        Compact Mode
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Reduce spacing in dashboard
                                    </p>

                                </div>

                                <Switch />

                            </div>


                        </CardContent>

                    </Card>

                    <Card className="rounded-2xl">


                        <CardHeader>

                            <CardTitle className="flex gap-2">
                                <Bell size={20} />
                                Notifications
                            </CardTitle>

                            <CardDescription>
                                Customize notification permissions.
                            </CardDescription>

                        </CardHeader>

                        <hr />


                        <CardContent className="space-y-5">


                            <NotificationItem
                                title="Email Notifications"
                                desc="Receive important updates"
                            />


                            <NotificationItem
                                title="Task Updates"
                                desc="Get notified when tasks change"
                            />



                            <NotificationItem
                                title="Security Alerts"
                                desc="Login and password alerts"
                            />


                        </CardContent>


                    </Card>


                    <Card className="rounded-2xl">


                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">
                                <Lock size={20} />
                                Security
                            </CardTitle>

                        </CardHeader>
                        <hr />



                        <CardContent className="space-y-6">


                            <div className="grid gap-4 grid-cols-2">


                                <div className="flex flex-col gap-2">

                                    <Label>
                                        Current Password
                                    </Label>

                                    <Input type="password" />

                                </div>



                                <div className="flex flex-col gap-2">

                                    <Label>
                                        New Password
                                    </Label>

                                    <Input type="password" />

                                </div>



                                <div className="flex flex-col gap-2">

                                    <Label>
                                        Confirm Password
                                    </Label>

                                    <Input type="password" />

                                </div>


                            </div>


                            <Button>
                                Update Password
                            </Button>



                        </CardContent>


                    </Card>

                    <Card className="rounded-2xl">

                        <CardHeader>

                            <CardTitle className="flex gap-2">

                                <ShieldCheck size={20} />
                                Two Factor Authentication

                            </CardTitle>

                        </CardHeader>
                        <hr />


                        <CardContent>


                            <div className="flex justify-between items-center">


                                <div>

                                    <p className="font-medium">
                                        Enable 2FA
                                    </p>


                                    <p className="text-sm text-muted-foreground">
                                        Protect your account with OTP verification
                                    </p>


                                </div>

                                <Button>
                                    <ExternalLinkIcon />
                                    Enable 2FA
                                </Button>


                            </div>


                        </CardContent>


                    </Card>

                    <Card className="rounded-2xl">

                        <div className="flex flex-row justify-between items-center pe-5">
                            <CardHeader className="flex-1">

                                <CardTitle>
                                    Connected Accounts
                                </CardTitle>

                            </CardHeader>
                            <Button>
                                <Wrench />
                                Manage Account Details
                            </Button>
                        </div>
                        <hr />



                        <CardContent className="space-y-4">


                            <AccountItem
                                icon={<GitBranch />}
                                title="Github"
                                desc="Connected"
                            />


                            <AccountItem
                                icon={<Mail />}
                                title="Google"
                                desc="Connected"
                            />



                        </CardContent>


                    </Card>

                    <Card className="rounded-2xl">


                        <CardHeader>

                            <CardTitle className="flex gap-2">

                                <KeyRound size={20} />
                                API Access

                            </CardTitle>


                            <CardDescription>
                                Manage your API tokens.
                            </CardDescription>

                        </CardHeader>


                        <CardContent>


                            <Button>
                                Generate API Key
                            </Button>


                        </CardContent>


                    </Card>


                    <Card className="border-destructive/40 rounded-2xl">


                        <CardHeader>

                            <CardTitle className="flex gap-2 text-destructive">

                                <Trash2 size={20} />
                                Danger Zone

                            </CardTitle>


                        </CardHeader>


                        <CardContent>


                            <Button variant="destructive">

                                Delete Account

                            </Button>


                        </CardContent>


                    </Card>



                </div>


            </div>
        </DashboardLayout>
    )

}





function NotificationItem({
    title,
    desc
}: {
    title: string,
    desc: string
}) {

    return (

        <div className="flex justify-between items-center">

            <div>

                <p className="font-medium">
                    {title}
                </p>

                <p className="text-sm text-muted-foreground">
                    {desc}
                </p>


            </div>

            <Switch />

        </div>

    )

}




function AccountItem({
    icon,
    title,
    desc
}: any) {

    return (

        <div className="flex items-center justify-between border rounded-xl p-4">

            <div className="flex gap-3 items-center">

                {icon}

                <div>

                    <p className="font-medium">
                        {title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {desc}
                    </p>

                </div>

            </div>


            <Button variant="outline">
                Manage
            </Button>


        </div>


    )

}