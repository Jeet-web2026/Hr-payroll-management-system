import { DashboardLayout } from "@/comon/dashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";

export const JoininRequests = () => {
    return (
        <DashboardLayout sideHeader="Manage Joining Requests">
            <div className="p-5">
                <Card>
                    <CardContent>
                        <Button className="cursor-pointer ms-auto">
                            <LinkIcon />
                            Generate link
                        </Button>
                        
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}